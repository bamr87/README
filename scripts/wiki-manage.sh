#!/bin/bash
# File: wiki-manage.sh
# Description: Management script for Wiki.js Docker container
# Author: bamr87
# Created: 2025-12-17
# Last Modified: 2025-12-17
# Version: 1.0.0
#
# Usage: ./wiki-manage.sh [command]
#
# Commands:
#   start       - Start Wiki.js and database
#   stop        - Stop Wiki.js and database
#   restart     - Restart Wiki.js
#   logs        - View Wiki.js logs
#   status      - Check service status
#   backup      - Backup database and data
#   restore     - Restore from backup
#   update      - Update Wiki.js to latest version
#   clean       - Clean up Docker resources
#   shell       - Access Wiki.js container shell
#   db-shell    - Access PostgreSQL shell
#   admin       - Start with pgAdmin for database management
#   help        - Show this help message

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKUP_DIR="${PROJECT_ROOT}/backups"
COMPOSE_FILE="${PROJECT_ROOT}/docker-compose.yml"
ENV_FILE="${PROJECT_ROOT}/.env"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Wiki.js Management Script${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_requirements() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    if [ ! -f "$ENV_FILE" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f "${PROJECT_ROOT}/.env.example" ]; then
            cp "${PROJECT_ROOT}/.env.example" "$ENV_FILE"
            print_success ".env file created. Please update with your settings."
        else
            print_error ".env.example not found. Cannot create .env file."
            exit 1
        fi
    fi

    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
}

start_services() {
    print_header
    print_info "Starting Wiki.js services..."
    
    cd "$PROJECT_ROOT"
    docker-compose up -d
    
    print_success "Services started successfully!"
    print_info "Wiki.js: http://localhost:$(grep WIKI_PORT .env | cut -d '=' -f2 || echo 3000)"
    print_info ""
    print_info "Run './wiki-manage.sh logs' to view logs"
    print_info "Run './wiki-manage.sh status' to check service status"
}

stop_services() {
    print_header
    print_info "Stopping Wiki.js services..."
    
    cd "$PROJECT_ROOT"
    docker-compose stop
    
    print_success "Services stopped successfully!"
}

restart_services() {
    print_header
    print_info "Restarting Wiki.js..."
    
    cd "$PROJECT_ROOT"
    docker-compose restart wiki
    
    print_success "Wiki.js restarted successfully!"
}

view_logs() {
    print_header
    print_info "Viewing Wiki.js logs (Ctrl+C to exit)..."
    echo ""
    
    cd "$PROJECT_ROOT"
    docker-compose logs -f --tail=100 wiki
}

check_status() {
    print_header
    print_info "Service Status:"
    echo ""
    
    cd "$PROJECT_ROOT"
    docker-compose ps
    
    echo ""
    print_info "Health Checks:"
    
    # Check if Wiki.js is responding
    WIKI_PORT=$(grep WIKI_PORT .env | cut -d '=' -f2 || echo 3000)
    if curl -sf "http://localhost:${WIKI_PORT}/healthz" > /dev/null 2>&1; then
        print_success "Wiki.js is healthy"
    else
        print_warning "Wiki.js health check failed"
    fi
    
    # Check if database is accepting connections
    if docker-compose exec -T db pg_isready -U wikijs > /dev/null 2>&1; then
        print_success "Database is healthy"
    else
        print_warning "Database health check failed"
    fi
}

backup_data() {
    print_header
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="${BACKUP_DIR}/wiki-backup-${TIMESTAMP}"
    
    print_info "Creating backup..."
    
    # Backup database
    print_info "Backing up database..."
    cd "$PROJECT_ROOT"
    docker-compose exec -T db pg_dump -U wikijs wiki > "${BACKUP_FILE}.sql"
    print_success "Database backup created: ${BACKUP_FILE}.sql"
    
    # Backup Wiki.js data
    print_info "Backing up Wiki.js data..."
    docker-compose exec wiki tar -czf /tmp/wiki-data.tar.gz /wiki/data 2>/dev/null || true
    docker cp bamr87-wiki:/tmp/wiki-data.tar.gz "${BACKUP_FILE}-data.tar.gz" 2>/dev/null || true
    print_success "Data backup created: ${BACKUP_FILE}-data.tar.gz"
    
    # Backup configuration
    print_info "Backing up configuration..."
    tar -czf "${BACKUP_FILE}-config.tar.gz" -C "$PROJECT_ROOT" .env docker-compose.yml 2>/dev/null
    print_success "Configuration backup created: ${BACKUP_FILE}-config.tar.gz"
    
    echo ""
    print_success "Full backup completed!"
    print_info "Backup location: ${BACKUP_DIR}/"
}

restore_data() {
    print_header
    print_warning "This will restore Wiki.js from a backup."
    
    # List available backups
    echo ""
    print_info "Available backups:"
    ls -1 "${BACKUP_DIR}"/*.sql 2>/dev/null | while read -r backup; do
        echo "  - $(basename "$backup" .sql)"
    done
    
    echo ""
    read -p "Enter backup timestamp (YYYYMMDD_HHMMSS): " timestamp
    
    BACKUP_FILE="${BACKUP_DIR}/wiki-backup-${timestamp}.sql"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    print_warning "This will overwrite current data. Are you sure? (yes/no)"
    read -p "> " confirm
    
    if [ "$confirm" != "yes" ]; then
        print_info "Restore cancelled."
        exit 0
    fi
    
    print_info "Restoring database..."
    cd "$PROJECT_ROOT"
    docker-compose exec -T db psql -U wikijs wiki < "$BACKUP_FILE"
    print_success "Database restored successfully!"
    
    # Restore data if available
    DATA_BACKUP="${BACKUP_DIR}/wiki-backup-${timestamp}-data.tar.gz"
    if [ -f "$DATA_BACKUP" ]; then
        print_info "Restoring Wiki.js data..."
        docker cp "$DATA_BACKUP" bamr87-wiki:/tmp/wiki-data.tar.gz
        docker-compose exec wiki tar -xzf /tmp/wiki-data.tar.gz -C /
        print_success "Data restored successfully!"
    fi
    
    print_info "Restarting services..."
    docker-compose restart
    
    print_success "Restore completed!"
}

update_wiki() {
    print_header
    print_info "Updating Wiki.js to latest version..."
    
    # Create backup before update
    print_info "Creating backup before update..."
    backup_data
    
    cd "$PROJECT_ROOT"
    
    # Pull latest image
    print_info "Pulling latest Wiki.js image..."
    docker-compose pull wiki
    
    # Restart with new image
    print_info "Restarting with new image..."
    docker-compose up -d wiki
    
    print_success "Wiki.js updated successfully!"
    print_info "Check logs with: ./wiki-manage.sh logs"
}

clean_resources() {
    print_header
    print_warning "This will remove stopped containers and unused images."
    print_warning "Active services will NOT be affected."
    
    read -p "Continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        print_info "Clean cancelled."
        exit 0
    fi
    
    print_info "Cleaning Docker resources..."
    docker system prune -f
    
    print_success "Cleanup completed!"
}

wiki_shell() {
    print_header
    print_info "Accessing Wiki.js container shell..."
    print_info "Type 'exit' to return"
    echo ""
    
    cd "$PROJECT_ROOT"
    docker-compose exec wiki sh
}

db_shell() {
    print_header
    print_info "Accessing PostgreSQL shell..."
    print_info "Type '\\q' to exit"
    echo ""
    
    cd "$PROJECT_ROOT"
    docker-compose exec db psql -U wikijs wiki
}

start_with_admin() {
    print_header
    print_info "Starting Wiki.js with pgAdmin..."
    
    cd "$PROJECT_ROOT"
    docker-compose --profile admin up -d
    
    WIKI_PORT=$(grep WIKI_PORT .env | cut -d '=' -f2 || echo 3000)
    PGADMIN_PORT=$(grep PGADMIN_PORT .env | cut -d '=' -f2 || echo 5050)
    
    print_success "Services started successfully!"
    print_info "Wiki.js: http://localhost:${WIKI_PORT}"
    print_info "pgAdmin: http://localhost:${PGADMIN_PORT}"
    print_info ""
    print_info "pgAdmin login credentials are in your .env file"
}

show_help() {
    print_header
    cat << EOF
Usage: $0 [command]

Commands:
  start       - Start Wiki.js and database services
  stop        - Stop all services
  restart     - Restart Wiki.js service
  logs        - View Wiki.js logs (real-time)
  status      - Check service status and health
  backup      - Create full backup (database + data + config)
  restore     - Restore from a backup
  update      - Update Wiki.js to latest version
  clean       - Clean up Docker resources
  shell       - Access Wiki.js container shell
  db-shell    - Access PostgreSQL shell
  admin       - Start with pgAdmin for database management
  help        - Show this help message

Examples:
  $0 start              # Start all services
  $0 logs               # View logs in real-time
  $0 backup             # Create a backup
  $0 update             # Update to latest version

For detailed documentation, see: docs/setup/wikijs-setup.md
EOF
}

# Main script logic
main() {
    check_requirements
    
    case "${1:-help}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        logs)
            view_logs
            ;;
        status)
            check_status
            ;;
        backup)
            backup_data
            ;;
        restore)
            restore_data
            ;;
        update)
            update_wiki
            ;;
        clean)
            clean_resources
            ;;
        shell)
            wiki_shell
            ;;
        db-shell)
            db_shell
            ;;
        admin)
            start_with_admin
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
