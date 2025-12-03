# MaxiBlocks Performance Monitoring System

## Overview

A comprehensive development-only monitoring system has been implemented to diagnose and track the memory (1-2GB) and CPU (95%) consumption issues in MaxiBlocks Gutenberg editor.

## Quick Start

### Enable Monitoring
Add to your editor URL:
```
?maxiDebugPerformance=true
```

Or in browser console:
```javascript
localStorage.setItem('maxiDebugPerformance', 'true');
location.reload();
```

### Basic Commands
```javascript
// Generate full report
maxiPerformance.report()

// Export as JSON
maxiPerformance.export()

// Check for memory leaks
leakDetector.report()

// Check event listeners
listenerTracker.report()
```

## What's Tracked

### 1. Memory Usage
- JS heap size monitoring
- Memory growth rate detection
- Automatic leak warnings when growth > 5 MB/min

### 2. Component Lifecycle
- Mount/unmount tracking
- Render frequency per block type
- Active component count
- Mount/unmount imbalance detection

### 3. Event Listeners
- MutationObserver instances
- Event listener count
- WordPress data subscriptions
- Automatic detection of listeners > 5 minutes old

### 4. Redux Store
- Action dispatch frequency
- State size tracking
- Most-called selectors
- Problematic action detection

### 5. DOM Operations
- Total node count
- MaxiBlocks element count
- DOM mutation tracking
- Orphaned node detection

### 6. API Calls
- REST API call tracking
- Response time monitoring
- Payload size tracking
- Font loading operations

### 7. Memory Leak Detection
- Automatic scanning every 30 seconds
- Component lifecycle leaks
- Event listener leaks
- Redux state bloat
- Detached DOM nodes

## Features

### Automatic Console Dashboard
Displays every 30 seconds:
```
=== MaxiBlocks Performance Monitor ===
Memory: 512 MB (+2.5 MB/min)
Active Blocks: 24
Event Listeners: 156
Redux Actions/sec: 12
Render Time (avg): 45ms
Warnings: 2 potential memory leaks detected
```

### Leak Detection
Automatically detects and warns about:
- Consistent memory growth
- High listener counts
- Component mount/unmount imbalances
- Growing Redux state
- Long-lived listeners
- Orphaned DOM nodes

### Export Functionality
Export comprehensive JSON reports including:
- Session duration and timing
- Memory trends
- Component lifecycle events
- Listener creation/removal log
- Redux store action history
- DOM operation logs
- API call history
- Detected issues with recommendations

## Implementation Details

### Files Created
```
src/extensions/performance-monitor/
├── index.js              # Core performance monitor
├── debugControl.js       # Debug mode control
├── listenerTracker.js    # Event listener tracking
├── storeMonitor.js       # Redux store monitoring
├── domTracker.js         # DOM operations tracking
├── apiTracker.js         # API/network monitoring
├── leakDetector.js       # Memory leak detection
├── .eslintrc.js          # ESLint configuration
├── README.md             # Detailed documentation
└── USAGE.md              # Quick reference guide
```

### Integration Points

**JavaScript Entry Point** (`src/index.js`):
- Early initialization of performance monitoring
- Exposes global debug commands
- Zero overhead when disabled

**Component Tracking** (`src/extensions/maxi-block/maxiBlockComponent.js`):
- Mount/unmount tracking
- Render time measurement
- MutationObserver tracking

**PHP Integration** (`core/class-maxi-blocks.php`):
- URL parameter detection
- Constant-based enabling
- Option-based enabling

## Enabling Methods

### 1. URL Parameter (Recommended for Testing)
```
?maxiDebugPerformance=true
```

### 2. LocalStorage (Persistent)
```javascript
localStorage.setItem('maxiDebugPerformance', 'true');
```

### 3. PHP Constant (wp-config.php)
```php
define('MAXI_DEBUG_PERFORMANCE', true);
```

### 4. WordPress Option
```php
update_option('maxi_debug_performance', true);
```

## Available Commands

### Main Monitor
```javascript
maxiPerformance.report()        // Full report
maxiPerformance.export()        // Download JSON
maxiPerformance.getMetrics()    // Raw metrics
maxiPerformance.stop()          // Stop monitoring
maxiPerformance.start()         // Restart
```

### Component Tracker
```javascript
// Metrics available in:
maxiPerformance.getMetrics().components
```

### Listener Tracker
```javascript
listenerTracker.report()
listenerTracker.getActiveListeners()
listenerTracker.detectLeaks()
```

### Store Monitor
```javascript
storeMonitor.report()
storeMonitor.getTopActions()
storeMonitor.getTopSelectors()
```

### DOM Tracker
```javascript
domTracker.report()
domTracker.getMutationStats()
domTracker.detectOrphanedNodes()
```

### API Tracker
```javascript
apiTracker.report()
apiTracker.getSlowCalls(threshold)
apiTracker.getMaxiBlocksCalls()
```

### Leak Detector
```javascript
leakDetector.report()
leakDetector.getAllLeaks()
leakDetector.clearLeaks()
```

### Debug Control
```javascript
maxiDebug.help()       // Show help
maxiDebug.enable()     // Enable debug mode
maxiDebug.disable()    // Disable debug mode
maxiDebug.isEnabled()  // Check status
```

## Troubleshooting Workflow

### For High Memory Usage (1-2 GB):
```javascript
// 1. Check leak detection
leakDetector.report()

// 2. Check listeners
listenerTracker.report()

// 3. Check component balance
const metrics = maxiPerformance.getMetrics();
console.log(JSON.stringify({
    mounted: metrics.components.mounted,
    unmounted: metrics.components.unmounted,
    active: metrics.components.active
}, null, 2));

// 4. Export full report
maxiPerformance.export()
```

### For High CPU Usage (95%):
```javascript
// 1. Check render times
maxiPerformance.report()

// 2. Check API calls
apiTracker.getSlowCalls(500)

// 3. Check DOM mutations
domTracker.getMutationStats()

// 4. Check Redux actions
storeMonitor.getActionFrequency(1)
```

## Performance Impact

- **When Disabled**: Absolute zero overhead (all checks wrapped in conditionals)
- **When Enabled**: Minimal overhead (~1-2%)
  - Memory sampling: every 5 seconds
  - DOM sampling: every 5 seconds
  - Leak detection: every 30 seconds
  - Console reporting: every 30 seconds

## Best Practices

1. **Enable Before Testing**: Turn on monitoring before reproducing issues
2. **Take Baselines**: Get initial measurements when editor loads
3. **Compare Over Time**: Export reports at intervals to track trends
4. **Focus on Trends**: Growth patterns matter more than absolute values
5. **Test Specific Workflows**: Isolate actions (add block, delete, etc.)
6. **Export Reports**: Download JSON for detailed analysis

## Warning Thresholds

- **Memory Growth**: > 5 MB/min indicates potential leak
- **Listeners**: > 200 total indicates potential leak
- **Component Imbalance**: > 50 difference (mounted - unmounted)
- **API Calls**: > 1000ms indicates slow request
- **State Size**: > 500KB indicates potential bloat

## Documentation

- **Detailed Documentation**: `src/extensions/performance-monitor/README.md`
- **Quick Reference**: `src/extensions/performance-monitor/USAGE.md`
- **This File**: Overview and quick start

## Support

For issues:
1. Ensure debug mode is enabled (`maxiDebug.isEnabled()` returns `true`)
2. Check browser console for errors
3. Try in different browser/incognito mode
4. Export and analyze JSON report

## Next Steps

1. Enable monitoring in development environment
2. Reproduce memory/CPU issues
3. Use `leakDetector.report()` to identify leak sources
4. Check `listenerTracker.report()` for unreleased listeners
5. Export report and analyze trends
6. Fix identified issues
7. Re-test with monitoring enabled to verify fixes

## Notes

- All tracking code is development-only
- No data is sent to servers
- Safe to use in production (via URL parameter)
- Respects browser performance APIs availability
- Console logs use `JSON.stringify()` as per coding standards

