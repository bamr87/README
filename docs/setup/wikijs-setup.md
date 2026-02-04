# Wiki.js Integration Guide

## Overview

Wiki.js is a powerful, modern wiki application integrated into the bamr87 README submodule. It provides a beautiful, feature-rich documentation platform with:

- **Modern Interface**: Clean, responsive UI with real-time editing
- **Multi-format Support**: Markdown, HTML, AsciiDoc, and more
- **Search**: Full-text search with advanced filtering
- **Version Control**: Built-in Git integration for content versioning
- **Authentication**: Multiple authentication providers (local, OAuth, LDAP, etc.)
- **Access Control**: Granular permissions and user management
- **Extensibility**: Plugin system and API access

## Architecture

The Wiki.js setup includes:

```
README/
├── docker-compose.yml       # Container orchestration
├── .env                     # Environment configuration
├── docs/                    # Content source (mounted read-only)
│   ├── index.md
│   ├── api/
│   ├── architecture/
│   └── ...
└── scripts/
    └── wiki-manage.sh       # Management script
```

**Services:**
- **wiki**: Wiki.js application (port 3000)
- **db**: PostgreSQL 15 database
- **pgadmin**: Database management UI (port 5050, optional)

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- At least 512MB RAM available
- Ports 3000 and 5050 available

## Quick Start

### 1. Environment Setup

```bash
# Navigate to README directory
cd /path/to/bamr87/README

# Copy environment template
cp .env.example .env

# Edit configuration (optional)
vim .env
```

### 2. Start Wiki.js

```bash
# Start Wiki.js and database
docker-compose up -d

# View logs
docker-compose logs -f wiki

# Check service health
docker-compose ps
```

### 3. Initial Configuration

1. **Access Wiki.js**: Open browser to http://localhost:3000
2. **Administrator Setup**:
   - Email: Use value from `WIKI_ADMIN_EMAIL` in `.env`
   - Password: Set a strong password (min 8 characters)
   - Site URL: Should match `WIKI_SITE_URL`
3. **Complete Setup Wizard**:
   - Choose authentication method
   - Configure site settings
   - Set up content structure

### 4. Import Existing Documentation

Wiki.js can import content from the existing `docs/` directory:

**Option A: Manual Import**
1. Navigate to **Administration** > **Storage**
2. Add a **Git** storage target
3. Point to local repository or remote Git URL
4. Sync content

**Option B: File System Sync**
```bash
# The docs directory is already mounted as read-only
# Changes in docs/ can be manually imported via Admin UI
```

## Configuration

### Environment Variables

Edit `/Users/bamr87/github/bamr87/README/.env`:

```bash
# Database Configuration
WIKI_DB_USER=wikijs                    # PostgreSQL username
WIKI_DB_PASS=wikijsrocks              # PostgreSQL password (CHANGE THIS!)
WIKI_DB_NAME=wiki                      # Database name

# Wiki.js Settings
WIKI_ADMIN_EMAIL=admin@example.com     # Admin email address
WIKI_SITE_URL=http://localhost:3000    # Public site URL
WIKI_PORT=3000                         # Application port
WIKI_UPGRADE_COMPANION=0               # Auto-upgrade feature (0=disabled)

# pgAdmin (optional)
PGADMIN_EMAIL=admin@example.com        # pgAdmin login email
PGADMIN_PASSWORD=admin                 # pgAdmin password (CHANGE THIS!)
PGADMIN_PORT=5050                      # pgAdmin port
```

### Advanced Configuration

#### Custom PostgreSQL Settings

Create `config/postgresql.conf`:

```conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
```

Uncomment in `docker-compose.yml`:

```yaml
volumes:
  - ./config/postgresql.conf:/etc/postgresql/postgresql.conf
```

#### SSL/TLS Configuration

For production deployment with HTTPS:

```yaml
# Add to wiki service in docker-compose.yml
environment:
  - WIKI_SSL_ENABLED=true
  - WIKI_SSL_PORT=3443
```

## Usage

### Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# View logs
docker-compose logs -f wiki
docker-compose logs -f db

# Restart Wiki.js
docker-compose restart wiki

# Update Wiki.js image
docker-compose pull wiki
docker-compose up -d wiki

# Access Wiki.js shell
docker-compose exec wiki sh

# Access PostgreSQL
docker-compose exec db psql -U wikijs -d wiki

# Start with pgAdmin (database management UI)
docker-compose --profile admin up -d
```

### Backup and Restore

#### Backup

```bash
# Backup database
docker-compose exec db pg_dump -U wikijs wiki > backup_$(date +%Y%m%d).sql

# Backup Wiki.js data
docker-compose exec wiki tar -czf /tmp/wiki-data.tar.gz /wiki/data
docker cp bamr87-wiki:/tmp/wiki-data.tar.gz ./backups/

# Backup entire configuration
tar -czf wiki-backup-$(date +%Y%m%d).tar.gz .env docker-compose.yml backups/
```

#### Restore

```bash
# Restore database
docker-compose exec -T db psql -U wikijs wiki < backup_20250117.sql

# Restore Wiki.js data
docker cp ./backups/wiki-data.tar.gz bamr87-wiki:/tmp/
docker-compose exec wiki tar -xzf /tmp/wiki-data.tar.gz -C /
```

### Maintenance

#### Database Optimization

```bash
# Vacuum database
docker-compose exec db psql -U wikijs -d wiki -c "VACUUM ANALYZE;"

# Check database size
docker-compose exec db psql -U wikijs -d wiki -c "\l+"
```

#### Log Management

```bash
# View container logs
docker-compose logs --tail=100 wiki

# Clear logs (requires container restart)
docker-compose down
docker system prune -f
docker-compose up -d
```

## Content Management

### Creating Pages

1. Click **Create Page** button
2. Choose page type:
   - **Markdown**: Simple formatting with Markdown
   - **Visual Editor**: WYSIWYG editor
   - **Code**: Raw HTML/CSS/JS
3. Set page path and title
4. Add content and save

### Organizing Content

- **Folders**: Organize with hierarchical paths (e.g., `/api/endpoints/users`)
- **Tags**: Add tags for categorization
- **Categories**: Group related pages

### Version Control

- **History**: View page history and compare versions
- **Restore**: Rollback to previous versions
- **Git Integration**: Sync with Git repository for backup

## Integration with Existing Docs

### Importing MkDocs Content

The `docs/` directory is mounted as read-only. To integrate:

1. **Storage Configuration**:
   - Go to **Administration** > **Storage**
   - Enable **Git** storage
   - Configure sync settings

2. **Content Sync**:
   ```bash
   # Option 1: Use Wiki.js Git sync
   # Configure in Admin UI
   
   # Option 2: Manual import via API
   # Use Wiki.js GraphQL API for bulk import
   ```

3. **Format Conversion**:
   - MkDocs Markdown → Wiki.js Markdown (mostly compatible)
   - Update internal links if needed
   - Adjust frontmatter if using

### Link Structure

Wiki.js uses clean URLs:
- MkDocs: `/docs/api/reference.md`
- Wiki.js: `/api/reference`

Update links accordingly or use redirects.

## Security Best Practices

1. **Change Default Passwords**:
   ```bash
   # Update .env with strong passwords
   WIKI_DB_PASS=$(openssl rand -base64 32)
   PGADMIN_PASSWORD=$(openssl rand -base64 32)
   ```

2. **Restrict Network Access**:
   ```yaml
   # In docker-compose.yml, remove port mapping for db
   # Only wiki needs external access
   ```

3. **Enable Authentication**:
   - Configure OAuth/SSO in Wiki.js admin
   - Disable anonymous access
   - Set up user roles and permissions

4. **Regular Backups**:
   - Automate database backups
   - Store backups off-server
   - Test restore procedures

5. **Update Regularly**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## Troubleshooting

### Wiki.js Won't Start

```bash
# Check container logs
docker-compose logs wiki

# Common issues:
# 1. Database not ready - wait 30s and retry
# 2. Port conflict - change WIKI_PORT in .env
# 3. Permission issues - check volume permissions
```

### Database Connection Errors

```bash
# Verify database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection manually
docker-compose exec db psql -U wikijs -d wiki -c "\conninfo"
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Increase PostgreSQL memory (in config/postgresql.conf)
shared_buffers = 512MB
effective_cache_size = 2GB

# Restart services
docker-compose restart
```

### Content Not Syncing

```bash
# Check storage configuration in Admin UI
# Verify Git credentials and repository access
# Check logs for sync errors

# Manual sync trigger
docker-compose exec wiki node wiki sync
```

## Advanced Features

### API Access

Wiki.js provides a GraphQL API:

```bash
# Access API at: http://localhost:3000/graphql

# Example: Create page via API
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{"query": "mutation { pages { create(...) } }"}'
```

### Custom Theme

1. Navigate to **Administration** > **Theme**
2. Customize colors, fonts, and layout
3. Add custom CSS for advanced styling

### Extensions

Install plugins from **Administration** > **Extensions**:
- Analytics (Google Analytics, Matomo)
- Search engines (Algolia, Elasticsearch)
- Authentication providers
- Storage targets

## Production Deployment

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name wiki.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d wiki.example.com

# Auto-renewal is configured automatically
```

### Scaling

For high-traffic scenarios:

1. **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
2. **Storage**: External S3-compatible storage
3. **Caching**: Redis for session storage
4. **Load Balancing**: Multiple Wiki.js instances behind load balancer

## Resources

- **Official Documentation**: https://docs.requarks.io/
- **GitHub Repository**: https://github.com/requarks/wiki
- **Community Forum**: https://github.com/requarks/wiki/discussions
- **Docker Hub**: https://hub.docker.com/r/requarks/wiki

---

**Version:** 1.0.0  
**Last Updated:** 2025-12-17  
**Maintainer:** bamr87
