"""
Sample documentation files for testing.
"""

SAMPLE_DOCS = {
    "api_docs.md": """# API Reference

This document provides comprehensive information about our REST API endpoints.

## Authentication

All API requests require authentication using Bearer tokens.

## Endpoints

### GET /api/users
Retrieve a list of all users.

**Parameters:**
- `limit` (optional): Maximum number of users to return
- `offset` (optional): Number of users to skip

**Response:**
```json
{
  "users": [...],
  "total": 100
}
```

### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Error Handling

All errors are returned in the following format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```
""",

    "user_guide.md": """# User Guide

Welcome to our application! This guide will help you get started.

## Getting Started

Follow these steps to set up your account:

1. **Create an account** - Visit our signup page
2. **Verify your email** - Check your inbox for verification link
3. **Complete your profile** - Add your personal information

## Tutorial

This tutorial will walk you through the basic features of our application.

### Step 1: Dashboard Overview
The dashboard shows your main metrics and recent activity.

### Step 2: Creating Your First Project
Learn how to create and configure your first project.

### Step 3: Inviting Team Members
Add team members to collaborate on your projects.

## How-to Guides

### How to Reset Your Password
1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for reset instructions

### How to Export Data
1. Navigate to the Reports section
2. Select the data you want to export
3. Choose your preferred format (CSV, JSON, PDF)
4. Click "Export"
""",

    "installation.md": """# Installation Guide

This document explains how to install and configure the application.

## Prerequisites

Before installing, ensure you have:

- **Python 3.8+** - Download from [python.org](https://python.org)
- **Node.js 16+** - Download from [nodejs.org](https://nodejs.org)
- **Docker** (optional) - For containerized deployment
- **Git** - For cloning the repository

## Installation Steps

### Option 1: Using pip (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/your-app.git
   cd your-app
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

### Option 2: Using Docker

1. **Build the Docker image:**
   ```bash
   docker build -t your-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8000:8000 your-app
   ```

## Configuration

### Environment Variables

Set the following environment variables:

- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - Secret key for encryption
- `DEBUG` - Set to `True` for development

### Configuration File

Create a `config.yaml` file:

```yaml
database:
  host: localhost
  port: 5432
  name: your_app

server:
  host: 0.0.0.0
  port: 8000
  debug: false
```

## Troubleshooting

### Common Issues

**Issue:** Database connection failed
**Solution:** Check your `DATABASE_URL` environment variable

**Issue:** Port already in use
**Solution:** Change the port in your configuration or stop the conflicting service
""",

    "development.md": """# Development Guide

This guide explains how to contribute to the project and set up a development environment.

## Development Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- Git
- Code editor (VS Code recommended)

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/your-app.git
   cd your-app
   ```

3. **Set up the development environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements-dev.txt
   ```

4. **Install pre-commit hooks:**
   ```bash
   pre-commit install
   ```

## Contributing

### Code Style

We follow PEP 8 for Python code. Use the following tools:

- **Black** for code formatting
- **Flake8** for linting
- **MyPy** for type checking

### Testing

Run tests before submitting a pull request:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/test_specific.py
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Architecture

### Project Structure

```
src/
├── api/          # API endpoints
├── models/       # Data models
├── services/     # Business logic
└── utils/        # Utility functions

tests/
├── unit/         # Unit tests
├── integration/  # Integration tests
└── fixtures/     # Test data
```

### Key Components

- **API Layer**: FastAPI-based REST API
- **Data Layer**: SQLAlchemy ORM
- **Service Layer**: Business logic and validation
- **Testing**: Pytest with comprehensive coverage
""",

    "architecture.md": """# System Architecture

This document describes the overall architecture and design principles of the system.

## Overview

The system follows a microservices architecture with the following key components:

- **API Gateway** - Entry point for all client requests
- **User Service** - Manages user accounts and authentication
- **Content Service** - Handles content management
- **Notification Service** - Manages notifications and alerts
- **Database** - PostgreSQL for data persistence
- **Cache** - Redis for caching frequently accessed data

## Design Principles

### Scalability
- Horizontal scaling through load balancing
- Database sharding for large datasets
- Caching strategies to reduce database load

### Reliability
- Circuit breakers for fault tolerance
- Health checks and monitoring
- Graceful degradation

### Security
- Authentication and authorization
- Data encryption at rest and in transit
- Input validation and sanitization

## Data Flow

### Request Processing

1. **Client Request** → API Gateway
2. **Authentication** → User Service
3. **Authorization** → Permission Service
4. **Business Logic** → Appropriate Service
5. **Data Access** → Database/Cache
6. **Response** → Client

### Event Processing

1. **Event Generation** → Service
2. **Event Publishing** → Message Queue
3. **Event Processing** → Consumer Services
4. **State Update** → Database

## Technology Stack

- **Backend**: Python, FastAPI, SQLAlchemy
- **Frontend**: React, TypeScript, Material-UI
- **Database**: PostgreSQL, Redis
- **Message Queue**: RabbitMQ
- **Monitoring**: Prometheus, Grafana
- **Deployment**: Docker, Kubernetes
""",

    "misc_doc.md": """# Miscellaneous Document

This is a miscellaneous document that doesn't fit into any specific category.

## Random Content

Here's some random content that should be categorized as miscellaneous.

### Some Section

This section contains various information that doesn't follow a specific pattern.

### Another Section

More random content here.

## Conclusion

This document serves as a test case for the categorization system.
"""
}

def get_sample_doc(filename: str) -> str:
    """Get a sample document by filename."""
    return SAMPLE_DOCS.get(filename, "")

def get_all_sample_docs() -> dict:
    """Get all sample documents."""
    return SAMPLE_DOCS.copy()

def create_test_repo_structure(base_path: Path) -> None:
    """Create a test repository structure with sample documents."""
    base_path.mkdir(parents=True, exist_ok=True)
    
    # Create different directory structures
    (base_path / "docs").mkdir(exist_ok=True)
    (base_path / "api").mkdir(exist_ok=True)
    (base_path / "guides").mkdir(exist_ok=True)
    
    # Add sample documents
    (base_path / "README.md").write_text(SAMPLE_DOCS["user_guide.md"])
    (base_path / "docs" / "api.md").write_text(SAMPLE_DOCS["api_docs.md"])
    (base_path / "docs" / "installation.md").write_text(SAMPLE_DOCS["installation.md"])
    (base_path / "api" / "reference.md").write_text(SAMPLE_DOCS["api_docs.md"])
    (base_path / "guides" / "development.md").write_text(SAMPLE_DOCS["development.md"])
    (base_path / "guides" / "architecture.md").write_text(SAMPLE_DOCS["architecture.md"])
    (base_path / "misc.md").write_text(SAMPLE_DOCS["misc_doc.md"])
