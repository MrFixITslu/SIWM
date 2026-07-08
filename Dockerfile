FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache netcat-openbsd wget

COPY --from=builder /app/dist /app/dist
COPY backend /app/backend
COPY start-container.sh /start-container.sh

RUN cd /app/backend && npm ci --omit=dev \
    && chmod +x /start-container.sh

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=5 \
  CMD wget -qO- http://127.0.0.1:4000 || exit 1

CMD ["/start-container.sh"]
