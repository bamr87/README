# Wiki.js Quick Reference

## Quick Commands

```bash
# Navigate to README directory
cd README

# Start Wiki.js
./scripts/wiki-manage.sh start

# View logs
./scripts/wiki-manage.sh logs

# Check status
./scripts/wiki-manage.sh status

# Stop services
./scripts/wiki-manage.sh stop

# Create backup
./scripts/wiki-manage.sh backup

# Update Wiki.js
./scripts/wiki-manage.sh update
```

## Default Access

- **Wiki.js**: http://localhost:3000
- **pgAdmin** (optional): http://localhost:5050

## First-Time Setup

1. **Start services**:
   ```bash
   cd README
   cp .env.example .env
   ./scripts/wiki-manage.sh start
   ```

2. **Access Wiki.js**: Open http://localhost:3000

3. **Complete setup wizard**:
   - Set admin email (from `.env`)
   - Create strong password
   - Configure site settings

## Common Tasks

### Import Existing Documentation

Your `docs/` directory is already mounted in Wiki.js. Choose one of these methods:

#### Method 1: Git Storage Sync (Recommended)

Best for ongoing synchronization with your repository:

1. Go to **Administration** → **Storage**
2. Enable **Git** storage target
3. Configure:
   - **Repository URI**: Your GitHub repo URL
   - **Branch**: `main`
   - **Sync Direction**: `Pull from remote`
   - **Sync Schedule**: Every 5 minutes
4. Click **Apply** → **Force Sync**

#### Method 2: Local File System Import

Best for one-time import or read-only access:

1. Go to **Administration** → **Storage**
2. Enable **Local File System**
3. Set **Path**: `/wiki/content` (maps to your `docs/` folder)
4. Click **Apply** → **Import All**

#### Method 3: Bulk Import via API Script

Best for selective import with custom path mapping:

```bash
# First, get an API key:
# 1. Go to http://localhost:3000/a/api
# 2. Create new key with "Manage All Pages" permission
# 3. Copy the key

# Preview what will be imported (dry run)
python scripts/import-docs-to-wiki.py --api-key YOUR_KEY --dry-run --verbose

# Actually import the docs
python scripts/import-docs-to-wiki.py --api-key YOUR_KEY --execute --verbose
```

### Create New Page

1. Click **New Page** button
2. Choose page type (Markdown recommended)
3. Set path: `/category/page-name`
4. Add content and save

### Manage Users

1. Go to **Administration** > **Users**
2. Add new users or configure groups
3. Set permissions per group

### Backup Data

```bash
# Automated backup
./scripts/wiki-manage.sh backup

# Backups stored in: README/backups/
```

### Restore from Backup

```bash
./scripts/wiki-manage.sh restore
# Follow prompts to select backup
```

## Troubleshooting

### Wiki.js won't start

```bash
# Check logs
./scripts/wiki-manage.sh logs

# Restart services
./scripts/wiki-manage.sh restart
```

### Database connection errors

```bash
# Check database health
docker-compose exec db pg_isready -U wikijs

# Restart database
docker-compose restart db
```

### Port already in use

Edit `.env` and change ports:
```bash
WIKI_PORT=3001
PGADMIN_PORT=5051
```

Then restart:
```bash
./scripts/wiki-manage.sh restart
```

## Advanced Usage

### Access Container Shell

```bash
# Wiki.js container
./scripts/wiki-manage.sh shell

# Database shell
./scripts/wiki-manage.sh db-shell
```

### Start with Database Admin UI

```bash
./scripts/wiki-manage.sh admin
# Access pgAdmin at http://localhost:5050
```

### Manual Database Backup

```bash
docker-compose exec db pg_dump -U wikijs wiki > backup.sql
```

### Update to Latest Version

```bash
./scripts/wiki-manage.sh update
```

## Configuration Files

- `docker-compose.yml` - Container orchestration
- `.env` - Environment variables
- `docs/` - Content directory (mounted read-only)
- `backups/` - Backup storage

## Resources

- [Full Setup Guide](docs/setup/wikijs-setup.md)
- [Official Documentation](https://docs.requarks.io/)
- [GitHub Repository](https://github.com/requarks/wiki)

---

**Quick Help**: `./scripts/wiki-manage.sh help`
