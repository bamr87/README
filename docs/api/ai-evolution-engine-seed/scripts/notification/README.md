---
title: Notification Scripts
category: api
tags:
- api
last_updated: null
source_file: README.md
---
# Notification Scripts

Scripts for sending notifications about evolution cycles, system events, and status updates.

## Purpose

The notification scripts directory provides communication capabilities for:

- **Evolution Cycle Status**: Notifications about evolution cycle progress and completion
- **Error and Failure Alerts**: Critical error notifications and failure reporting
- **Success Confirmations**: Success notifications and completion confirmations
- **System Events**: General system event notifications and updates

## Scripts Overview

| Script | Purpose |
|--------|---------|
| `send-evolution-notification.sh` | Sends notifications about evolution cycles and system events |

## Features

- **Evolution Cycle Notifications**: Status updates for evolution cycle progress
- **Error and Failure Alerts**: Critical error notifications with detailed context
- **Success Confirmations**: Completion notifications with cycle details
- **Integration with External Systems**: Support for various communication channels and APIs

## Usage

### Send Evolution Notification

```bash
# Send evolution completion notification
./send-evolution-notification.sh --type success --cycle "evolution-2025-07-12"

# Send error notification
./send-evolution-notification.sh --type error --cycle "evolution-2025-07-12" --message "Failed to apply changes"

# Send progress notification
./send-evolution-notification.sh --type progress --cycle "evolution-2025-07-12" --stage "validation"
```

### Notification Types

- **`success`**: Evolution cycle completed successfully
- **`error`**: Evolution cycle encountered errors
- **`progress`**: Evolution cycle progress update
- **`warning`**: Non-critical warnings during evolution
- **`info`**: General information notifications

## Integration

These scripts integrate with:

- **[Core Evolution Scripts](../core/)** - Evolution cycle orchestration
- **[GitHub Actions Workflows](../../.github/workflows/)** - CI/CD automation
- **[External Communication APIs](../../docs/)** - Communication system documentation

## Related Documentation

- **[Scripts Directory README](../README.md)** - Complete scripts directory overview
- **[Evolution Engine Documentation](../../docs/evolution/)** - Evolution cycle implementation
- **[Workflow Documentation](../../docs/workflows/)** - Workflow execution and automation
