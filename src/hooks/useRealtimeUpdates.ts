import { useEffect, useRef } from 'react';

import { BASE_API_URL, getCommonHeaders } from '../services/apiConfig';

interface RealtimeHandlers {
  [key: string]: (data: any) => void;
}

export function useRealtimeUpdates(handlers?: RealtimeHandlers) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If no handlers provided, don't establish connection
    if (!handlers || Object.keys(handlers).length === 0) {
      return;
    }

    // Check if we have a valid authentication token before establishing SSE connection
    const headers = getCommonHeaders();
    const token = headers['Authorization'];

    if (!token) {
      console.log(
        '[SSE] No authentication token available, skipping SSE connection'
      );
      return;
    }

    const connectSSE = async () => {
      // Close existing connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      try {
        // SECURITY FIX: Create secure SSE connection without exposing tokens in URL
        // Since EventSource doesn't support custom headers, we'll use a session-based approach
        // The backend will validate the session cookie instead of URL parameters
        const sseUrl = `${BASE_API_URL}/system/sse`;

        const eventSource = new EventSource(sseUrl);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log('[SSE] Connection established successfully');
        };

        // Listen for specific events by name
        Object.entries(handlers).forEach(([eventName, handler]) => {
          if (handler) {
            eventSource.addEventListener(eventName, event => {
              try {
                const data = JSON.parse(event.data);
                console.log(`[SSE] Received event '${eventName}':`, data);
                handler(data);
              } catch (error) {
                console.error(
                  `[SSE] Error parsing event '${eventName}':`,
                  error
                );
              }
            });
          }
        });

        eventSource.onerror = event => {
          console.warn('[SSE] Connection error occurred:', event);

          // Only attempt to reconnect if we have a valid token
          const headers = getCommonHeaders();
          const token = headers['Authorization'];

          if (token) {
            // Attempt to reconnect after 5 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('[SSE] Attempting to reconnect...');
              connectSSE();
            }, 5000);
          } else {
            console.log(
              '[SSE] No authentication token available, skipping reconnection'
            );
          }
        };
      } catch (error) {
        console.error('[SSE] Failed to create connection:', error);

        // Retry connection after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[SSE] Retrying connection after error...');
          connectSSE();
        }, 5000);
      }
    };

    // Initial connection
    connectSSE();

    return () => {
      // Cleanup on unmount
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [handlers]);

  // Return a function to manually close the connection if needed
  return () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };
}
