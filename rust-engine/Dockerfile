# HubLab Rust Engine - Production Docker Image
# Multi-stage build for optimal size and security

# ============================================================================
# Stage 1: Builder - Compile the Rust application
# ============================================================================
FROM rust:1.75-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    musl-dev \
    pkgconfig \
    openssl-dev \
    openssl-libs-static

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Cache dependencies by building a dummy project
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Copy source code
COPY src ./src
COPY benches ./benches
COPY tests ./tests

# Build the actual application
RUN cargo build --release --bin server

# Strip the binary to reduce size
RUN strip /app/target/release/server

# ============================================================================
# Stage 2: Runtime - Minimal Alpine image
# ============================================================================
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    wget \
    libgcc

# Create non-root user for security
RUN addgroup -g 1000 hublab && \
    adduser -D -u 1000 -G hublab hublab

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/server /app/hublab-server

# Copy data directory (if exists)
COPY --chown=hublab:hublab data ./data

# Set ownership
RUN chown -R hublab:hublab /app

# Switch to non-root user
USER hublab

# Environment variables with defaults
ENV PORT=8080
ENV HOST=0.0.0.0
ENV DATA_PATH=/app/data/all-capsules.json
ENV RUST_LOG=info
ENV CORS_ORIGINS=*

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

# Run the server
ENTRYPOINT ["/app/hublab-server"]
