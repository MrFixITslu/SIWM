FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache nginx netcat-openbsd

COPY --from=builder /app/dist /app/dist
COPY backend /app/backend
COPY nginx.conf /etc/nginx/nginx.conf
COPY start-container.sh /start-container.sh

RUN cd /app/backend && npm ci --omit=dev \
    && chmod +x /start-container.sh \
    && mkdir -p /run/nginx

EXPOSE 80
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["/start-container.sh"]
