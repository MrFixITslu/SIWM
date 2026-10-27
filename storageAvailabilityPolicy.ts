/** Production never silently serves or mutates a demo/in-memory warehouse. */
export function assertStorageFallbackAllowed(production: boolean): void {
  if (production) {
    throw new Error('Production database unavailable; refusing in-memory fallback.');
  }
}
