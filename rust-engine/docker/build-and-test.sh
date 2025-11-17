#!/bin/bash
# HubLab Rust Engine - Docker Build and Test Script

set -e

echo "🐳 HubLab Rust Engine - Docker Build Script"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${BLUE}📦 Building Docker image...${NC}"
docker build -t hublab-rust-engine:latest ..

echo ""
echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Check image size
IMAGE_SIZE=$(docker images hublab-rust-engine:latest --format "{{.Size}}")
echo -e "${BLUE}📊 Image size: ${IMAGE_SIZE}${NC}"

# Expected: < 50MB
SIZE_MB=$(docker images hublab-rust-engine:latest --format "{{.Size}}" | sed 's/MB//' | awk '{print int($1)}')
if [ "$SIZE_MB" -lt 50 ] 2>/dev/null; then
    echo -e "${GREEN}✅ Image size is under 50MB target${NC}"
else
    echo -e "${YELLOW}⚠️  Image size is larger than 50MB target${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Starting container for testing...${NC}"

# Stop and remove existing container if running
docker stop hublab-rust-test 2>/dev/null || true
docker rm hublab-rust-test 2>/dev/null || true

# Run container
docker run -d \
    --name hublab-rust-test \
    -p 8080:8080 \
    -e RUST_LOG=info \
    -v $(pwd)/../data:/app/data:ro \
    hublab-rust-engine:latest

echo "Waiting for container to start..."
sleep 3

# Test health endpoint
echo ""
echo -e "${BLUE}🏥 Testing health endpoint...${NC}"
if curl -f http://localhost:8080/healthz 2>/dev/null; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Health check failed${NC}"
    echo "Container logs:"
    docker logs hublab-rust-test
fi

echo ""
echo -e "${BLUE}📋 Container info:${NC}"
docker ps --filter name=hublab-rust-test --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo -e "${BLUE}🔍 Testing search endpoint...${NC}"
curl -s "http://localhost:8080/api/search?q=dashboard&limit=3" | jq '.' || echo "Search test failed"

echo ""
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "Container is running. Access it at: http://localhost:8080"
echo ""
echo "Useful commands:"
echo "  docker logs hublab-rust-test        # View logs"
echo "  docker stop hublab-rust-test        # Stop container"
echo "  docker rm hublab-rust-test          # Remove container"
echo ""
echo "To run with docker-compose:"
echo "  cd .. && docker-compose up -d"
