#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════╗"
    echo "║      E-Commerce Platform Deployer        ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_prerequisites() {
    local missing=0

    if ! command -v docker &> /dev/null; then
        echo -e "${RED}[ERROR] Docker is not installed.${NC}"
        echo "  Install: https://docs.docker.com/get-docker/"
        missing=1
    fi

    if ! docker compose version &> /dev/null 2>&1; then
        echo -e "${RED}[ERROR] Docker Compose V2 is not available.${NC}"
        echo "  Install: https://docs.docker.com/compose/install/"
        missing=1
    fi

    if [ "$missing" -eq 1 ]; then
        exit 1
    fi

    echo -e "${GREEN}[OK] Docker and Docker Compose are installed.${NC}"
}

setup_env() {
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            echo -e "${YELLOW}[SETUP] Created .env from .env.example.${NC}"
            echo -e "${YELLOW}        Please edit .env with your actual values, then re-run this script.${NC}"
            echo ""
            echo "  Required values:"
            echo "    DB_PASSWORD    — PostgreSQL password"
            echo "    JWT_SECRET     — Secret key for JWT signing (use: openssl rand -base64 32)"
            echo ""
            exit 0
        else
            echo -e "${RED}[ERROR] No .env or .env.example found.${NC}"
            exit 1
        fi
    fi

    source .env
    echo -e "${GREEN}[OK] Environment loaded from .env${NC}"
}

cmd_up() {
    echo -e "${CYAN}[BUILD] Building and starting all services...${NC}"
    docker compose up --build -d

    echo ""
    echo -e "${GREEN}════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  All services are up and running!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  Frontend    →  ${CYAN}http://localhost:${FRONTEND_PORT:-3000}${NC}"
    echo -e "  Backend     →  ${CYAN}http://localhost:${BACKEND_PORT:-8181}${NC}"
    echo -e "  PostgreSQL  →  localhost:${DB_PORT:-5432}"
    echo ""
    echo -e "  View logs:  ${YELLOW}./deploy.sh logs${NC}"
    echo -e "  Stop all:   ${YELLOW}./deploy.sh down${NC}"
}

cmd_down() {
    echo -e "${CYAN}[STOP] Stopping all services...${NC}"
    docker compose down
    echo -e "${GREEN}[OK] All services stopped.${NC}"
}

cmd_logs() {
    local service="${1:-}"
    if [ -n "$service" ]; then
        docker compose logs -f "$service"
    else
        docker compose logs -f
    fi
}

cmd_clean() {
    echo -e "${YELLOW}[WARN] This will stop all containers and DELETE all data (including the database).${NC}"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose down -v
        echo -e "${GREEN}[OK] All containers and volumes removed.${NC}"
    else
        echo "Aborted."
    fi
}

cmd_restart() {
    local service="${1:-}"
    if [ -n "$service" ]; then
        echo -e "${CYAN}[RESTART] Restarting $service...${NC}"
        docker compose restart "$service"
    else
        echo -e "${CYAN}[RESTART] Restarting all services...${NC}"
        docker compose restart
    fi
    echo -e "${GREEN}[OK] Restart complete.${NC}"
}

cmd_status() {
    docker compose ps
}

print_usage() {
    echo "Usage: ./deploy.sh <command> [service]"
    echo ""
    echo "Commands:"
    echo "  up        Build and start all services (default)"
    echo "  down      Stop all services"
    echo "  restart   Restart all services (or a specific one)"
    echo "  logs      Tail logs (optionally for a specific service)"
    echo "  status    Show running containers"
    echo "  clean     Stop all and remove volumes (DESTRUCTIVE)"
    echo ""
    echo "Services: frontend, backend, postgres"
}

main() {
    print_banner
    check_prerequisites
    setup_env

    case "${1:-up}" in
        up)       cmd_up ;;
        down)     cmd_down ;;
        restart)  cmd_restart "${2:-}" ;;
        logs)     cmd_logs "${2:-}" ;;
        status)   cmd_status ;;
        clean)    cmd_clean ;;
        help|-h)  print_usage ;;
        *)
            echo -e "${RED}Unknown command: $1${NC}"
            print_usage
            exit 1
            ;;
    esac
}

main "$@"
