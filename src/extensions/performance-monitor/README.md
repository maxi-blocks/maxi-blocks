# MaxiBlocks Performance Monitor

A comprehensive development-only monitoring system to diagnose memory usage, CPU consumption, and identify performance bottlenecks in the MaxiBlocks Gutenberg editor.

## Features

- **Memory Tracking**: Monitor JS heap size and detect memory leaks
- **CPU Profiling**: Track component render times and expensive operations
- **Component Lifecycle**: Monitor mount/unmount/update cycles
- **Event Listener Tracking**: Detect listener leaks and excessive subscriptions
- **Redux Store Monitoring**: Track action dispatches and state size
- **DOM Operations**: Monitor node count and detect orphaned elements
- **API Call Tracking**: Monitor REST API calls and network requests
- **Leak Detection**: Automatic detection of potential memory leaks

## Enabling Debug Mode

### Option 1: URL Parameter (Recommended for Testing)
```
?maxiDebugPerformance=true
```
Add this to your editor URL to enable monitoring for the current session.

### Option 2: LocalStorage (Persistent)
```javascript
localStorage.setItem('maxiDebugPerformance', 'true');
// Then reload the page
```

To disable:
```javascript
localStorage.removeItem('maxiDebugPerformance');
// Then reload the page
```

### Option 3: PHP Constant (Site-wide)
Add to `wp-config.php`:
```php
define('MAXI_DEBUG_PERFORMANCE', true);
```

### Option 4: WordPress Option (Database)
```php
update_option('maxi_debug_performance', true);
```

## Using the Monitor

### Available Commands

Once debug mode is enabled, several global objects are available in the browser console:

#### Main Performance Monitor
```javascript
// Generate full performance report
maxiPerformance.report()

// Export report as downloadable JSON
maxiPerformance.export()

// Get raw metrics
maxiPerformance.getMetrics()

// Stop monitoring
maxiPerformance.stop()

// Restart monitoring
maxiPerformance.start()

// Clear warnings
maxiPerformance.clearWarnings()
```

#### Component Lifecycle Tracker
```javascript
// Automatically tracked via maxiPerformance.getMetrics()
const metrics = maxiPerformance.getMetrics();
console.log(JSON.stringify(metrics.components, null, 2));
```

#### Listener Tracker
```javascript
// Generate listener tracking report
listenerTracker.report()

// Get active listeners
listenerTracker.getActiveListeners()

// Detect listener leaks
listenerTracker.detectLeaks()
```

#### Store Monitor
```javascript
// Generate Redux store report
storeMonitor.report()

// Get action frequency
storeMonitor.getActionFrequency(seconds)

// Get top actions
storeMonitor.getTopActions(limit)

// Get top selectors
storeMonitor.getTopSelectors(limit)
```

#### DOM Tracker
```javascript
// Generate DOM tracking report
domTracker.report()

// Get mutation statistics
domTracker.getMutationStats()

// Get style injection stats
domTracker.getStyleStats()

// Detect orphaned nodes
domTracker.detectOrphanedNodes()
```

#### API Tracker
```javascript
// Generate API tracking report
apiTracker.report()

// Get API call statistics
apiTracker.getStats()

// Get slow API calls
apiTracker.getSlowCalls(threshold)

// Get MaxiBlocks API calls only
apiTracker.getMaxiBlocksCalls()
```

#### Leak Detector
```javascript
// Generate leak detection report
leakDetector.report()

// Get all detected leaks
leakDetector.getAllLeaks()

// Clear leak history
leakDetector.clearLeaks()
```

#### Debug Control
```javascript
// Show help
maxiDebug.help()

// Enable debug mode
maxiDebug.enable()

// Disable debug mode
maxiDebug.disable()

// Check if enabled
maxiDebug.isEnabled()
```

## Console Dashboard

The monitor automatically displays a console dashboard every 30 seconds showing:

```
=== MaxiBlocks Performance Monitor ===
Memory: 512 MB (growing at 2MB/min)
Active Blocks: 24
Event Listeners: 156
MutationObservers: 8
Redux Actions/sec: 12
Render Time (avg): 45ms
Warnings: 2 potential memory leaks detected
=====================================
```

## Understanding the Metrics

### Memory Metrics
- **usedMB**: Current JS heap memory usage in megabytes
- **Growth Rate**: MB per minute - positive values indicate growing memory
- **Warning**: Growth rate > 5 MB/min indicates potential memory leak

### Component Metrics
- **mounted**: Total components mounted since session start
- **unmounted**: Total components unmounted
- **active**: Currently active components (mounted - unmounted)
- **byType**: Breakdown by block type
- **renders**: Render count and total time per block type

### Listener Metrics
- **total**: Total active listeners (event listeners + observers + subscriptions)
- **mutationObservers**: Active MutationObserver instances
- **eventListeners**: Active event listeners
- **subscriptions**: Active WordPress data store subscriptions
- **Warning**: Total > 200 indicates potential listener leak

### Store Metrics
- **actions**: All dispatched Redux actions
- **stateSize**: Size of Redux state in KB
- **selectorCalls**: Count of selector function calls

### DOM Metrics
- **nodeCount**: Total DOM nodes
- **maxiBlockElements**: Count of `.maxi-block` elements
- **orphanedNodes**: Detached DOM nodes potentially held in memory

### API Metrics
- **calls**: All API requests (fetch + XHR)
- **failedCalls**: Number of failed requests
- **totalPayloadSize**: Total data transferred in bytes

## Warnings and Recommendations

The system automatically detects issues and provides recommendations:

### High Memory Growth
```
Description: Consistent memory growth detected: 5.5MB per 30 seconds
Recommendation: Check for: uncleaned event listeners, growing arrays in state,
                detached DOM nodes, or unreleased resources
```

### Component Lifecycle Imbalance
```
Description: Component mount/unmount imbalance: 55 more mounted than unmounted
Recommendation: Check componentWillUnmount methods for proper cleanup. Ensure all
                subscriptions, timers, and event listeners are removed.
```

### Listener Leak
```
Description: 15 long-lived listeners detected (> 5 minutes old)
Recommendation: Ensure all event listeners are removed in cleanup functions or
                componentWillUnmount.
```

### Redux State Growth
```
Description: Redux state size growing: 50KB → 175KB (250% increase)
Recommendation: Check for: accumulating arrays, unremoved deprecated blocks,
                or cached data not being cleared.
```

## Performance Impact

- **When Disabled**: Zero overhead - all tracking code is wrapped in conditional checks
- **When Enabled**: Minimal overhead from:
  - Memory sampling every 5 seconds
  - DOM sampling every 5 seconds
  - Leak detection every 30 seconds
  - Console reporting every 30 seconds

## Troubleshooting Common Issues

### Issue: High Memory Usage (1-2 GB)
**Check**:
1. Run `leakDetector.report()` to identify leak sources
2. Check `listenerTracker.report()` for unreleased listeners
3. Verify component cleanup with `maxiPerformance.report()`

### Issue: High CPU Usage (95%)
**Check**:
1. Check render frequency: `maxiPerformance.report()`
2. Look for slow API calls: `apiTracker.getSlowCalls(500)`
3. Check for excessive DOM mutations: `domTracker.getMutationStats()`

### Issue: Editor Becoming Slow Over Time
**Likely Causes**:
- Memory leak (check memory growth trend)
- Accumulating listeners (check listener count)
- Growing Redux state (check state size)
- Orphaned DOM nodes (check orphaned node count)

## Exporting Reports

Generate and download a comprehensive JSON report:

```javascript
maxiPerformance.export()
```

The exported report includes:
- Session duration and timing
- Memory trends and snapshots
- Component lifecycle data
- Top rendering components
- Listener summary
- Redux store operations
- DOM operations
- API call history
- All detected warnings
- Actionable recommendations

## Integration with Chrome DevTools

The performance marks and measures created by this system are visible in Chrome DevTools:

1. Open Chrome DevTools
2. Go to Performance tab
3. Record a profile
4. Look for marks prefixed with `maxi-block-`

## Best Practices

1. **Enable Before Testing**: Turn on debug mode before reproducing issues
2. **Baseline First**: Take a baseline report when editor first loads
3. **Compare Over Time**: Export reports at different intervals to track trends
4. **Focus on Trends**: Individual metrics matter less than growth patterns
5. **Check Imbalances**: Look for mount/unmount, listener add/remove imbalances
6. **Test Scenarios**: Test specific workflows (add block, delete block, etc.)

## Files

```
src/extensions/performance-monitor/
├── index.js            # Core performance monitor
├── debugControl.js     # Debug mode control and initialization
├── listenerTracker.js  # Event listener and observer tracking
├── storeMonitor.js     # Redux store operations monitoring
├── domTracker.js       # DOM operations tracking
├── apiTracker.js       # API and network monitoring
├── leakDetector.js     # Memory leak detection
└── README.md           # This file
```

## Contributing

When adding new performance tracking:

1. Wrap all tracking code in `if (window.maxiDebugPerformance)` checks
2. Use `JSON.stringify()` for console.log of objects
3. Add proper cleanup in component unmount/tracker cleanup methods
4. Update metrics in performanceMonitor.metrics
5. Add detection logic to leakDetector if relevant

## Support

For issues or questions about the performance monitoring system:
1. Check console for error messages
2. Ensure debug mode is properly enabled
3. Verify no browser extensions are interfering
4. Check browser console for any errors during initialization

