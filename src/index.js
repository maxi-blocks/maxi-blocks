/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

// Performance Monitor - Initialize early if debug mode enabled
/* eslint-disable no-console */
import {
	isDebugEnabled,
	initDebugControl,
} from './extensions/performance-monitor/debugControl';
import performanceMonitor from './extensions/performance-monitor/index';
import listenerTracker from './extensions/performance-monitor/listenerTracker';
import storeMonitor from './extensions/performance-monitor/storeMonitor';
import domTracker from './extensions/performance-monitor/domTracker';
import apiTracker from './extensions/performance-monitor/apiTracker';
import leakDetector from './extensions/performance-monitor/leakDetector';

// Initialize debug control (always available)
initDebugControl();

// Initialize performance monitoring if debug mode is enabled
if (isDebugEnabled()) {
	// Set global flag
	window.maxiDebugPerformance = true;

	// Initialize core monitor
	performanceMonitor.init();

	// Initialize all trackers
	listenerTracker.report(); // Just to expose it
	storeMonitor.init();
	domTracker.init();
	apiTracker.init();
	leakDetector.init();

	// Expose trackers globally for debugging
	window.listenerTracker = listenerTracker;
	window.storeMonitor = storeMonitor;
	window.domTracker = domTracker;
	window.apiTracker = apiTracker;
	window.leakDetector = leakDetector;

	console.log(
		'%c[MaxiBlocks] Performance monitoring active',
		'background: #4CAF50; color: white; font-weight: bold; padding: 4px 8px; font-size: 12px;',
		'\nAvailable commands:',
		'\n  maxiPerformance.report() - Full performance report',
		'\n  maxiPerformance.export() - Export report as JSON',
		'\n  listenerTracker.report() - Listener tracking report',
		'\n  storeMonitor.report() - Redux store report',
		'\n  domTracker.report() - DOM operations report',
		'\n  apiTracker.report() - API calls report',
		'\n  leakDetector.report() - Memory leak detection report'
	);
}
/* eslint-enable no-console */

// Extensions
import './extensions';

// CSS
import './css';

// Blocks
import './blocks/button-maxi';
import './blocks/cloud-maxi';
import './blocks/column-maxi';
import './blocks/container-maxi';
import './blocks/divider-maxi';
import './blocks/group-maxi';
import './blocks/image-maxi';
import './blocks/map-maxi';
import './blocks/number-counter-maxi';
import './blocks/row-maxi';
import './blocks/svg-icon-maxi';
import './blocks/text-maxi';
import './blocks/list-item-maxi';
import './blocks/slider-maxi';
import './blocks/slide-maxi';
import './blocks/accordion-maxi';
import './blocks/pane-maxi';
import './blocks/video-maxi';
import './blocks/search-maxi';

// Editor
import './editor/saver';
import './editor/toolbar-buttons';
