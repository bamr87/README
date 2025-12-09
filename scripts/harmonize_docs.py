#!/usr/bin/env python3
"""
Documentation Harmonization CLI.

AI-powered tool for analyzing, reorganizing, and improving documentation.
Uses Grok API for intelligent document analysis and recommendations.

Usage:
    python scripts/harmonize_docs.py --scope api --batch-size 10
    python scripts/harmonize_docs.py --resume <session-id>
    python scripts/harmonize_docs.py --list-sessions
    python scripts/harmonize_docs.py --report <session-id>
    python scripts/harmonize_docs.py --apply <session-id> --dry-run
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add scripts directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

try:
    from harmonize import (
        create_engine,
        PREDEFINED_SCOPES,
        ActionType,
        ProcessingStatus,
    )
    from harmonize.processor import RecommendationProcessor
except ImportError as e:
    print(f"Error importing harmonize module: {e}")
    print("Make sure you're running from the correct directory")
    sys.exit(1)


def print_progress(current: int, total: int, message: str = ""):
    """Print progress bar."""
    width = 40
    percent = current / total if total > 0 else 0
    filled = int(width * percent)
    bar = '=' * filled + '-' * (width - filled)
    print(f'\r[{bar}] {current}/{total} {message[:50]}', end='', flush=True)
    if current == total:
        print()


def print_result(result):
    """Print processing result."""
    status_emoji = {
        ProcessingStatus.ANALYZED: "✅",
        ProcessingStatus.RECOMMENDED: "💡",
        ProcessingStatus.ERROR: "❌",
        ProcessingStatus.SKIPPED: "⏭️",
    }
    emoji = status_emoji.get(result.status, "📄")
    print(f"\n{emoji} {result.document_path}")
    
    if result.analysis:
        print(f"   Quality: {result.analysis.quality_score}/10 | Type: {result.analysis.document_type}")
    
    if result.action:
        print(f"   Action: {result.action.action.value} ({result.action.priority})")
        if result.action.target_category:
            print(f"   → Category: {result.action.target_category}")


def cmd_list_scopes(args):
    """List available scopes."""
    print("\n📋 Available Scopes:\n")
    for name, scope in PREDEFINED_SCOPES.items():
        print(f"  {name}")
        print(f"    {scope.description}")
        print(f"    Patterns: {', '.join(scope.include_patterns[:2])}...")
        print()


def cmd_list_sessions(args):
    """List existing sessions."""
    engine = create_engine(docs_root=args.docs_root, use_mock_ai=True)
    sessions = engine.list_sessions()
    
    if not sessions:
        print("\nNo sessions found.")
        return
    
    print("\n📁 Existing Sessions:\n")
    print(f"{'Session ID':<12} {'Scope':<15} {'Progress':<15} {'Started':<20}")
    print("-" * 65)
    
    for s in sessions:
        progress = f"{s['processed']}/{s['total']}"
        print(f"{s['session_id']:<12} {s['scope']:<15} {progress:<15} {s['started_at'][:19]}")


def cmd_analyze(args):
    """Analyze documents."""
    print(f"\n🔍 Documentation Harmonization")
    print(f"   Scope: {args.scope}")
    print(f"   Batch Size: {args.batch_size}")
    print(f"   Mock AI: {args.mock}")
    print(f"   Dry Run: {args.dry_run}")
    print()
    
    # Create engine
    engine = create_engine(
        docs_root=args.docs_root,
        use_mock_ai=args.mock,
        dry_run=args.dry_run
    )
    
    # Set callbacks
    if args.verbose:
        engine.set_result_callback(print_result)
    engine.set_progress_callback(print_progress)
    
    # Start or resume session
    if args.resume:
        session_id = engine.start_session(args.scope, resume_session=args.resume)
    else:
        session_id = engine.start_session(args.scope)
    
    print(f"Session: {session_id}")
    print()
    
    # Process documents
    if args.max_batches:
        summary = engine.process_all(
            batch_size=args.batch_size,
            delay_between_calls=args.delay,
            max_batches=args.max_batches
        )
    else:
        # Process one batch at a time for interactive use
        results = engine.process_batch(
            batch_size=args.batch_size,
            delay_between_calls=args.delay
        )
        summary = engine.generate_summary()
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 Summary")
    print("=" * 60)
    print(f"Processed: {summary['processed']}/{summary['total_documents']}")
    print(f"Pending: {summary['pending']}")
    print(f"Failed: {summary['failed']}")
    
    if summary.get('action_counts'):
        print("\nRecommended Actions:")
        for action, count in summary['action_counts'].items():
            print(f"  - {action}: {count}")
    
    if summary.get('category_recommendations'):
        print("\nCategory Recommendations:")
        for cat, count in summary['category_recommendations'].items():
            print(f"  - {cat}: {count} documents")
    
    print(f"\nTo continue: python scripts/harmonize_docs.py --resume {session_id}")
    print(f"To generate report: python scripts/harmonize_docs.py --report {session_id}")


def cmd_report(args):
    """Generate report for a session."""
    engine = create_engine(docs_root=args.docs_root, use_mock_ai=True)
    
    # Load session
    state = engine.load_state(args.session_id)
    if not state:
        print(f"Session {args.session_id} not found")
        return
    
    engine.state = state
    
    # Generate report
    output_path = args.output or f"docs/.harmonize/report_{args.session_id}.md"
    report = engine.generate_report(output_path)
    
    if args.output:
        print(f"Report written to: {output_path}")
    else:
        print(report)


def cmd_export(args):
    """Export recommendations to structured JSON."""
    # Load state directly as JSON for compatibility
    import json
    state_path = Path(args.docs_root) / '.harmonize' / f'state_{args.session_id}.json'
    
    if not state_path.exists():
        print(f"Session {args.session_id} not found")
        return
    
    with open(state_path, 'r') as f:
        state_data = json.load(f)
    
    # Create processor
    processor = RecommendationProcessor(docs_root=args.docs_root)
    
    # Parse filters
    filter_actions = None
    if args.actions:
        filter_actions = {ActionType(a) for a in args.actions.split(',')}
    
    # Export with filters
    output_file = args.output or f"recommendations_{args.session_id}.json"
    recommendations = processor.export_recommendations(
        results=state_data['results'],
        output_file=output_file,
        include_analysis=not args.summary_only,
        filter_actions=filter_actions,
        min_priority=args.min_priority
    )
    
    print(f"\n📊 Export Summary:")
    print(f"   Total documents: {len(state_data['results'])}")
    print(f"   Exported recommendations: {len(recommendations['recommendations'])}")
    print(f"   Actions: {recommendations['summary']['by_action']}")
    if recommendations['summary']['by_priority']:
        print(f"   Priorities: {recommendations['summary']['by_priority']}")


def cmd_apply(args):
    """Apply recommendations systematically."""
    # Load session
    engine = create_engine(
        docs_root=args.docs_root,
        use_mock_ai=True,
        dry_run=args.dry_run
    )
    
    state = engine.load_state(args.session_id)
    if not state:
        print(f"Session {args.session_id} not found")
        return
    
    # Load recommendations JSON if provided
    if args.from_json:
        with open(args.from_json, 'r') as f:
            recommendations = json.load(f)
    else:
        # Create recommendations from state
        processor = RecommendationProcessor(docs_root=args.docs_root)
        recommendations = processor.export_recommendations(
            results=state.results,
            output_file=f".temp_rec_{args.session_id}.json",
            include_analysis=True
        )
    
    # Parse filters
    filter_actions = None
    if args.actions:
        filter_actions = {a.strip() for a in args.actions.split(',')}
    
    filter_priority = None
    if args.priority:
        filter_priority = {p.strip() for p in args.priority.split(',')}
    
    # Create processor and execute
    processor = RecommendationProcessor(docs_root=args.docs_root)
    
    print(f"\n{'🔍 DRY RUN - ' if args.dry_run else '⚡ EXECUTING - '}Applying recommendations...")
    print(f"   Session: {args.session_id}")
    if filter_actions:
        print(f"   Actions: {filter_actions}")
    if filter_priority:
        print(f"   Priorities: {filter_priority}")
    print()
    
    # Execute
    execution_summary = processor.execute_recommendations(
        recommendations=recommendations,
        dry_run=args.dry_run,
        create_backup=not args.no_backup,
        filter_actions=filter_actions,
        filter_priority=filter_priority
    )
    
    # Show detailed results if verbose
    if args.verbose:
        if execution_summary['executed']:
            print("\n✅ Executed:")
            for item in execution_summary['executed'][:20]:  # Show first 20
                print(f"  {item['path']}: {item['action']} ({item.get('priority', 'N/A')})")
            if len(execution_summary['executed']) > 20:
                print(f"  ... and {len(execution_summary['executed']) - 20} more")
        
        if execution_summary['failed']:
            print("\n❌ Failed:")
            for item in execution_summary['failed']:
                print(f"  {item['path']}: {item['error']}")


def cmd_validate(args):
    """Validate recommendations before applying."""
    engine = create_engine(docs_root=args.docs_root, use_mock_ai=True)
    
    state = engine.load_state(args.session_id)
    if not state:
        print(f"Session {args.session_id} not found")
        return
    
    # Create processor
    processor = RecommendationProcessor(docs_root=args.docs_root)
    
    # Export recommendations
    recommendations = processor.export_recommendations(
        results=state.results,
        output_file=f".temp_rec_{args.session_id}.json",
        include_analysis=False
    )
    
    # Validate
    print(f"\n🔍 Validating {len(recommendations['recommendations'])} recommendations...")
    validation_issues = processor.validate_recommendations(recommendations)
    
    if not validation_issues:
        print("✅ All recommendations validated successfully!")
        print(f"   Ready to apply {len(recommendations['recommendations'])} recommendations")
    else:
        print(f"\n⚠️  Found {len(validation_issues)} documents with validation issues:\n")
        for path, issues in list(validation_issues.items())[:10]:
            print(f"  {path}:")
            for issue in issues:
                print(f"    - {issue}")
        
        if len(validation_issues) > 10:
            print(f"\n  ... and {len(validation_issues) - 10} more documents with issues")
        
        print(f"\nFix these issues before applying recommendations.")


def cmd_stats(args):
    """Show detailed statistics for a session."""
    engine = create_engine(docs_root=args.docs_root, use_mock_ai=True)
    
    state = engine.load_state(args.session_id)
    if not state:
        print(f"Session {args.session_id} not found")
        return
    
    # Collect statistics
    stats = {
        'total': len(state.results),
        'by_action': {},
        'by_priority': {},
        'by_category': {},
        'by_quality': {i: 0 for i in range(11)},
        'issues': []
    }
    
    for path, result in state.results.items():
        if result.action:
            action = result.action.action.value
            stats['by_action'][action] = stats['by_action'].get(action, 0) + 1
            
            if result.action.priority:
                stats['by_priority'][result.action.priority] = stats['by_priority'].get(result.action.priority, 0) + 1
            
            if result.action.target_category:
                stats['by_category'][result.action.target_category] = stats['by_category'].get(result.action.target_category, 0) + 1
        
        if result.analysis:
            score = result.analysis.quality_score
            stats['by_quality'][score] = stats['by_quality'].get(score, 0) + 1
            
            if result.analysis.is_duplicate:
                stats['issues'].append(f"Duplicate: {path}")
            if result.analysis.is_outdated:
                stats['issues'].append(f"Outdated: {path}")
    
    # Print statistics
    print(f"\n📊 Session Statistics: {args.session_id}")
    print("=" * 70)
    
    print(f"\n📁 Total Documents: {stats['total']}")
    
    print(f"\n⚡ Actions Recommended:")
    for action, count in sorted(stats['by_action'].items(), key=lambda x: x[1], reverse=True):
        pct = (count / stats['total']) * 100 if stats['total'] > 0 else 0
        print(f"  {action:20} {count:4} ({pct:5.1f}%)")
    
    print(f"\n🎯 Priority Distribution:")
    for priority in ['critical', 'high', 'medium', 'low']:
        count = stats['by_priority'].get(priority, 0)
        pct = (count / stats['total']) * 100 if stats['total'] > 0 else 0
        print(f"  {priority:10} {count:4} ({pct:5.1f}%)")
    
    print(f"\n📂 Category Recommendations:")
    for category, count in sorted(stats['by_category'].items(), key=lambda x: x[1], reverse=True):
        pct = (count / stats['total']) * 100 if stats['total'] > 0 else 0
        print(f"  {category:20} {count:4} ({pct:5.1f}%)")
    
    print(f"\n⭐ Quality Score Distribution:")
    for score in range(10, 0, -1):
        count = stats['by_quality'].get(score, 0)
        if count > 0:
            bar = '█' * int((count / stats['total']) * 50) if stats['total'] > 0 else ''
            print(f"  {score:2}/10: {count:4} {bar}")
    
    if stats['issues']:
        print(f"\n⚠️  Issues Found: {len(stats['issues'])}")
        for issue in stats['issues'][:10]:
            print(f"  - {issue}")
        if len(stats['issues']) > 10:
            print(f"  ... and {len(stats['issues']) - 10} more")


def cmd_approve(args):
    """Approve recommendations for a session."""
    engine = create_engine(docs_root=args.docs_root, use_mock_ai=True)
    
    state = engine.load_state(args.session_id)
    if not state:
        print(f"Session {args.session_id} not found")
        return
    
    engine.state = state
    
    # Approve all or specific documents
    approved = 0
    for path, result in state.results.items():
        if args.paths and path not in args.paths:
            continue
        
        if result.action and result.status == ProcessingStatus.RECOMMENDED:
            result.status = ProcessingStatus.APPROVED
            approved += 1
    
    engine.save_state()
    print(f"Approved {approved} recommendations")


def main():
    parser = argparse.ArgumentParser(
        description="AI-powered documentation harmonization tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # Analyze API documentation
    python scripts/harmonize_docs.py --scope api --batch-size 10
    
    # Use mock AI for testing
    python scripts/harmonize_docs.py --scope api --mock
    
    # Resume a previous session
    python scripts/harmonize_docs.py --resume abc12345
    
    # List all sessions
    python scripts/harmonize_docs.py --list-sessions
    
    # Generate a report
    python scripts/harmonize_docs.py --report abc12345
    
    # Apply changes (dry run)
    python scripts/harmonize_docs.py --apply abc12345 --dry-run
    
    # Apply changes for real
    python scripts/harmonize_docs.py --apply abc12345 --no-dry-run --force

Environment Variables:
    XAI_API_KEY or GROK_API_KEY: Grok API key for AI analysis
        """
    )
    
    # Global options
    parser.add_argument('--docs-root', default='docs',
                        help='Root directory for documentation (default: docs)')
    parser.add_argument('--verbose', '-v', action='store_true',
                        help='Verbose output')
    
    # Commands via flags
    cmd_group = parser.add_mutually_exclusive_group()
    cmd_group.add_argument('--list-scopes', action='store_true',
                           help='List available scopes')
    cmd_group.add_argument('--list-sessions', action='store_true',
                           help='List existing sessions')
    cmd_group.add_argument('--report', metavar='SESSION_ID',
                           help='Generate report for a session')
    cmd_group.add_argument('--export', metavar='SESSION_ID',
                           help='Export recommendations to JSON')
    cmd_group.add_argument('--apply', metavar='SESSION_ID',
                           help='Apply recommendations from a session')
    cmd_group.add_argument('--validate', metavar='SESSION_ID',
                           help='Validate recommendations before applying')
    cmd_group.add_argument('--stats', metavar='SESSION_ID',
                           help='Show detailed statistics for a session')
    
    # Analysis options
    parser.add_argument('--scope', choices=list(PREDEFINED_SCOPES.keys()),
                        default='all', help='Scope to analyze (default: all)')
    parser.add_argument('--resume', metavar='SESSION_ID',
                        help='Resume a previous session')
    parser.add_argument('--batch-size', type=int, default=10,
                        help='Documents per batch (default: 10)')
    parser.add_argument('--max-batches', type=int,
                        help='Maximum number of batches to process')
    parser.add_argument('--delay', type=float, default=1.0,
                        help='Delay between API calls in seconds (default: 1.0)')
    parser.add_argument('--mock', action='store_true',
                        help='Use mock AI client for testing')
    
    # Apply options
    parser.add_argument('--dry-run', action='store_true', default=True,
                        help='Dry run - don\'t actually modify files (default)')
    parser.add_argument('--no-dry-run', action='store_false', dest='dry_run',
                        help='Actually modify files')
    parser.add_argument('--force', action='store_true',
                        help='Apply without requiring approval')
    parser.add_argument('--no-backup', action='store_true',
                        help='Don\'t create backups before modifying files')
    parser.add_argument('--from-json', metavar='PATH',
                        help='Apply recommendations from JSON file')
    parser.add_argument('--actions', metavar='ACTIONS',
                        help='Comma-separated list of actions to apply/filter')
    parser.add_argument('--priority', metavar='PRIORITIES',
                        help='Comma-separated list of priorities to apply/filter')
    
    # Export options
    parser.add_argument('--output', '-o', metavar='PATH',
                        help='Output path for report/export')
    parser.add_argument('--summary-only', action='store_true',
                        help='Export summary only without full analysis')
    parser.add_argument('--min-priority', choices=['critical', 'high', 'medium', 'low'],
                        help='Minimum priority level for export')
    
    args = parser.parse_args()
    
    # Route to appropriate command
    if args.list_scopes:
        cmd_list_scopes(args)
    elif args.list_sessions:
        cmd_list_sessions(args)
    elif args.report:
        args.session_id = args.report
        cmd_report(args)
    elif args.export:
        args.session_id = args.export
        cmd_export(args)
    elif args.apply:
        args.session_id = args.apply
        cmd_apply(args)
    elif args.validate:
        args.session_id = args.validate
        cmd_validate(args)
    elif args.stats:
        args.session_id = args.stats
        cmd_stats(args)
    else:
        # Default: analyze documents
        cmd_analyze(args)


if __name__ == '__main__':
    main()
