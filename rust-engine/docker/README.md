# HubLab Rust Engine - Docker Documentation

Production-ready Docker setup for the HubLab search engine written in Rust.

## Quick Start

### Build and Run with Docker Compose

```bash
# Build and start the service
docker-compose up -d

# View logs
docker-compose logs -f hublab-rust

# Stop the service
docker-compose down
```

The API will be available at `http://localhost:8080`

### Build Manually

```bash
# Build the Docker image
docker build -t hublab-rust-engine:latest .

# Run the container
docker run -d \
  --name hublab-rust \
  -p 8080:8080 \
  -e RUST_LOG=info \
  -v $(pwd)/data:/app/data:ro \
  hublab-rust-engine:latest

# Check health
curl http://localhost:8080/healthz
```

## Image Details

### Size Optimization

The image uses a multi-stage build:
- **Builder stage:** `rust:1.75-alpine` - Compiles the application
- **Runtime stage:** `alpine:3.19` - Minimal runtime environment

**Expected image size:** ~40-50 MB

### Architecture

```
┌─────────────────────────────────────┐
│ alpine:3.19 (Runtime)               │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ hublab-server (binary)       │  │
│  │ ~10-15 MB (stripped)         │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ data/all-capsules.json       │  │
│  │ ~17 MB (mounted volume)      │  │
│  └──────────────────────────────┘  │
│                                     │
│  Base OS: ~5-10 MB                  │
└─────────────────────────────────────┘
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Server port |
| `HOST` | `0.0.0.0` | Bind address |
| `DATA_PATH` | `/app/data/all-capsules.json` | Path to capsules JSON |
| `RUST_LOG` | `info` | Log level (`trace`, `debug`, `info`, `warn`, `error`) |
| `CORS_ORIGINS` | `*` | Allowed CORS origins (comma-separated) |

### Example: Production Configuration

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  hublab-rust:
    image: hublab-rust-engine:latest
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - HOST=0.0.0.0
      - RUST_LOG=warn
      - CORS_ORIGINS=https://hublab.app,https://www.hublab.app
    volumes:
      - ./data:/app/data:ro
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 256M
        reservations:
          cpus: '0.5'
          memory: 128M
```

Run with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Health Checks

The container includes a built-in health check that runs every 30 seconds:

```bash
# Check container health status
docker inspect hublab-rust | jq '.[0].State.Health'

# Manual health check
curl http://localhost:8080/healthz
```

Expected response:
```json
{
  "status": "ok",
  "version": "0.1.0",
  "capsules_loaded": 8124,
  "uptime_seconds": 3600
}
```

## API Endpoints

Once running, the following endpoints are available:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/healthz` | GET | Health check |
| `/api/search` | GET | Search capsules |
| `/api/search/fuzzy` | GET | Fuzzy search |
| `/api/capsules/:id` | GET | Get capsule by ID |
| `/api/categories` | GET | List categories |
| `/api/stats` | GET | Engine statistics |

### Example Requests

```bash
# Health check
curl http://localhost:8080/healthz

# Search for "dashboard"
curl "http://localhost:8080/api/search?q=dashboard&limit=5"

# Search with filters
curl "http://localhost:8080/api/search?q=auth&category=Security&platform=react"

# Fuzzy search (typo-tolerant)
curl "http://localhost:8080/api/search/fuzzy?q=dashbord"

# Get specific capsule
curl http://localhost:8080/api/capsules/hero-section-1

# List categories
curl http://localhost:8080/api/categories

# Get stats
curl http://localhost:8080/api/stats
```

## Development Mode

Run in development mode with debug logging and hot reload:

```bash
# Start dev service
docker-compose --profile dev up hublab-rust-dev

# Available at http://localhost:8081
```

## Deployment

### Docker Hub

```bash
# Tag the image
docker tag hublab-rust-engine:latest yourusername/hublab-rust-engine:v0.1.0
docker tag hublab-rust-engine:latest yourusername/hublab-rust-engine:latest

# Push to Docker Hub
docker push yourusername/hublab-rust-engine:v0.1.0
docker push yourusername/hublab-rust-engine:latest
```

### AWS ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag the image
docker tag hublab-rust-engine:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/hublab-rust-engine:latest

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/hublab-rust-engine:latest
```

### Google Cloud Run

```bash
# Build for Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/hublab-rust-engine

# Deploy to Cloud Run
gcloud run deploy hublab-rust-engine \
  --image gcr.io/PROJECT_ID/hublab-rust-engine \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi
```

## Kubernetes

Example Kubernetes deployment:

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hublab-rust-engine
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hublab-rust-engine
  template:
    metadata:
      labels:
        app: hublab-rust-engine
    spec:
      containers:
      - name: hublab-rust-engine
        image: hublab-rust-engine:latest
        ports:
        - containerPort: 8080
        env:
        - name: RUST_LOG
          value: "info"
        - name: CORS_ORIGINS
          value: "https://hublab.app"
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 3
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: hublab-rust-engine
spec:
  selector:
    app: hublab-rust-engine
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f k8s/deployment.yaml
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs hublab-rust
```

Common issues:
- **Data file not found:** Ensure `data/all-capsules.json` exists and is mounted
- **Port already in use:** Change the port mapping in `docker-compose.yml`
- **Permission denied:** Check file ownership and permissions

### Health check failing

```bash
# Enter the container
docker exec -it hublab-rust sh

# Test health endpoint manually
wget -O- http://localhost:8080/healthz

# Check if server is running
ps aux | grep hublab-server
```

### High memory usage

The Rust engine is designed to be memory-efficient. Typical memory usage:
- **Initial load:** ~100-150 MB (loading 8K+ capsules)
- **Runtime:** ~80-120 MB (steady state)
- **Peak:** ~200 MB (under heavy load)

If memory usage is higher:
1. Check `RUST_LOG` level (debug/trace increases memory)
2. Verify data file size
3. Monitor concurrent requests

### Performance tuning

```yaml
# docker-compose.yml with performance optimizations
services:
  hublab-rust:
    # ... other config ...
    deploy:
      resources:
        limits:
          cpus: '2.0'      # Allow 2 CPUs
          memory: 512M
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
```

## Security

### Non-root User

The container runs as user `hublab` (UID 1000) for security.

### Read-only Filesystem

Mount data as read-only:
```yaml
volumes:
  - ./data:/app/data:ro
```

### Security Scanning

Scan the image for vulnerabilities:
```bash
# Using Trivy
trivy image hublab-rust-engine:latest

# Using Docker Scan
docker scan hublab-rust-engine:latest
```

## Performance Benchmarks

Expected performance on typical hardware (4 cores, 8GB RAM):

| Operation | Latency | Throughput |
|-----------|---------|------------|
| `/healthz` | <1ms | 50,000 req/s |
| `/api/search` (simple) | 3-8ms | 8,000 req/s |
| `/api/search` (complex) | 10-20ms | 3,000 req/s |
| `/api/search/fuzzy` | 15-40ms | 2,000 req/s |

Container resource usage:
- **CPU:** 5-15% (idle), up to 80% (load)
- **Memory:** 80-120 MB (steady state)
- **Startup time:** <2 seconds

## Maintenance

### Updating the Image

```bash
# Pull latest code
git pull

# Rebuild image
docker-compose build

# Restart with zero downtime (if using multiple replicas)
docker-compose up -d --no-deps --build hublab-rust
```

### Logs

```bash
# View logs
docker-compose logs -f hublab-rust

# Last 100 lines
docker-compose logs --tail=100 hublab-rust

# Save logs to file
docker-compose logs hublab-rust > hublab-rust.log
```

### Backup Data

```bash
# Backup capsules data
docker cp hublab-rust:/app/data/all-capsules.json ./backup-$(date +%Y%m%d).json
```

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/hublab/issues
- Documentation: https://docs.hublab.app
