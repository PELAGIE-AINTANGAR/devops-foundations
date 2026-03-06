# syntax=docker/dockerfile:1

########## builder ##########
FROM alpine:3.20 AS builder
WORKDIR /build
COPY public ./public
COPY nginx ./nginx


########## production ##########
FROM nginx:1.27-alpine AS production

LABEL org.opencontainers.image.title="devops-foundations-frontend" \
      org.opencontainers.image.description="Frontend dashboard for DevOps Foundations" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.licenses="MIT"

# Nginx runs as nginx user (uid 101) in alpine image; still, we ensure no write needs.
COPY --from=builder /build/public /usr/share/nginx/html
COPY --from=builder /build/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ || exit 1
