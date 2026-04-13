# ---------- Builder stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first (optim cache)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy source
COPY src ./src


# ---------- Production stage ----------
FROM node:20-alpine

WORKDIR /app

# OCI labels
LABEL org.opencontainers.image.title="devops-foundations-backend" \
      org.opencontainers.image.description="Backend API for DevOps Foundations" \
      org.opencontainers.image.version="1.0.0"

# Create non-root user
RUN addgroup -g 10001 appgroup && \
    adduser -D -u 10001 -G appgroup appuser

ENV NODE_ENV=production

# Copy from builder
COPY --from=builder /app /app

USER 10001:10001

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/index.js"]
