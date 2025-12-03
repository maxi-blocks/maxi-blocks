# Quick Start Guide - MaxiBlocks Performance Monitor

## Enabling Debug Mode

### Quick Test (URL Parameter)
Add to your editor URL:
```
?maxiDebugPerformance=true
```
Example: `http://localhost/wp-admin/post.php?post=123&action=edit&maxiDebugPerformance=true`

### Persistent (Browser Console)
```javascript
localStorage.setItem('maxiDebugPerformance', 'true');
location.reload();
```

## Basic Commands

### Get Overview
```javascript
maxiPerformance.report()
```

### Export Data
```javascript
maxiPerformance.export()
```

### Check Specific Areas

**Component Issues:**
```javascript
const metrics = maxiPerformance.getMetrics();
console.log(JSON.stringify(metrics.components, null, 2));
```

**Memory Leaks:**
```javascript
leakDetector.report()
```

**Event Listeners:**
```javascript
listenerTracker.report()
```

**Redux Store:**
```javascript
storeMonitor.report()
```

**DOM Operations:**
```javascript
domTracker.report()
```

**API Calls:**
```javascript
apiTracker.report()
```

## Interpreting Results

### High Memory Usage (1-2 GB)
**Check:**
1. `leakDetector.report()` - Look for leak types
2. `listenerTracker.getActiveListeners()` - Count should be < 200
3. Memory growth rate in dashboard - Should be < 5 MB/min

**Common Causes:**
- Event listeners not being removed
- MutationObservers not being disconnected
- Components not cleaning up in unmount
- Large arrays accumulating in Redux state

### High CPU Usage (95%)
**Check:**
1. `maxiPerformance.report()` - Look at render times
2. `apiTracker.getSlowCalls(500)` - Calls > 500ms
3. `domTracker.getMutationStats()` - High mutation count

**Common Causes:**
- Excessive component re-renders
- Slow API calls
- Large DOM mutations
- Inefficient selectors

### Editor Slowing Down Over Time
**Check:**
1. Memory trend (increasing = leak)
2. Listener count (growing = leak)
3. Redux state size (growing = data accumulation)
4. Orphaned DOM nodes

## Workflow Example

```javascript
// 1. Enable monitoring
localStorage.setItem('maxiDebugPerformance', 'true');
location.reload();

// 2. Get baseline
maxiPerformance.report();

// 3. Perform actions (add blocks, edit, delete)
// ... use the editor ...

// 4. Check for issues after 5 minutes
leakDetector.report();
listenerTracker.report();

// 5. Export full report
maxiPerformance.export();
```

## Disabling Debug Mode

```javascript
localStorage.removeItem('maxiDebugPerformance');
location.reload();
```

Or use:
```javascript
maxiDebug.disable();
location.reload();
```

## Getting Help

Type in console:
```javascript
maxiDebug.help()
```

## Console Dashboard

Appears automatically every 30 seconds showing:
- Current memory usage
- Active blocks count
- Event listener count
- Redux actions per second
- Average render time
- Active warnings

## Performance Tips

- Enable **before** reproducing issues
- Take baseline measurements first
- Export reports for comparison
- Focus on growth trends, not absolute numbers
- Test specific workflows in isolation

## Common Warning Messages

**"High memory growth rate: 5.5MB per 30 seconds"**
- Action: Check `leakDetector.report()` for leak sources

**"High number of active listeners: 156"**
- Action: Check `listenerTracker.report()` for uncleaned listeners

**"Component mount/unmount imbalance: 55"**
- Action: Check components for missing cleanup in `componentWillUnmount`

**"Redux state size growing: 50KB → 175KB"**
- Action: Check `storeMonitor.report()` for accumulating data

## Browser DevTools Integration

Performance marks/measures are visible in Chrome DevTools:
1. Open DevTools → Performance tab
2. Start recording
3. Perform actions
4. Stop recording
5. Look for `maxi-block-*` marks

## Notes

- Zero overhead when disabled
- All data stays in browser (nothing sent to server)
- Safe to use in production (when enabled via URL param)
- Minimal impact when enabled (~1-2% overhead)

