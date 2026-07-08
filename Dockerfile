# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install ALL deps (including dev deps) - needed because the build step
# runs the TypeScript compiler and Vite, which are devDependencies.
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Backend-facing API calls go through nginx at a relative /api/v1 path
# (see nginx.conf), so no build-time API URL needs to be injected here.
RUN npm run build

# ---- Runtime stage ----
FROM nginx:alpine AS runner

# Copy the built static assets
COPY --from=builder /app/dist /app/dist

# Custom nginx config: serves the SPA and proxies /api/ to the backend service
COPY nginx.conf /etc/nginx/nginx.conf

# nginx:alpine already ships with an unprivileged "nginx" user; just make
# sure it can write to the directories nginx needs at runtime.
RUN mkdir -p /var/cache/nginx /var/run \
  && chown -R nginx:nginx /var/cache/nginx /var/run /app/dist /etc/nginx/nginx.conf

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
