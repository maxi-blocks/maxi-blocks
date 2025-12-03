/**
 * Debug Control System
 * Manages enabling/disabling performance monitoring
 *
 * @package
 */

/**
 * Check if debug mode should be enabled based on URL params or localStorage
 *
 * @returns {boolean} Whether debug mode is enabled
 */
export const isDebugEnabled = () => {
	// Check URL parameter
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.get('maxiDebugPerformance') === 'true') {
		return true;
	}

	// Check localStorage
	try {
		const storageValue = localStorage.getItem('maxiDebugPerformance');
		if (storageValue === 'true') {
			return true;
		}
	} catch (error) {
		console.warn('[MaxiBlocks] Cannot access localStorage:', error);
	}

	// Check window variable (can be set from PHP)
	if (window.maxiDebugPerformanceEnabled === true) {
		return true;
	}

	return false;
};

/**
 * Enable debug mode
 */
export const enableDebug = () => {
	try {
		localStorage.setItem('maxiDebugPerformance', 'true');
		console.log(
			'%c[MaxiBlocks] Performance monitoring enabled. Reload the page to activate.',
			'background: #4CAF50; color: white; font-weight: bold; padding: 2px 4px;'
		);
	} catch (error) {
		console.warn('[MaxiBlocks] Cannot enable debug mode:', error);
	}
};

/**
 * Disable debug mode
 */
export const disableDebug = () => {
	try {
		localStorage.removeItem('maxiDebugPerformance');
		console.log(
			'%c[MaxiBlocks] Performance monitoring disabled. Reload the page to deactivate.',
			'background: #f44336; color: white; font-weight: bold; padding: 2px 4px;'
		);
	} catch (error) {
		console.warn('[MaxiBlocks] Cannot disable debug mode:', error);
	}
};

/**
 * Initialize debug control
 * Exposes global functions for easy debugging
 */
export const initDebugControl = () => {
	window.maxiDebug = {
		enable: enableDebug,
		disable: disableDebug,
		isEnabled: isDebugEnabled,
		help: () => {
			console.log(
				'%c=== MaxiBlocks Debug Control ===',
				'background: #2196F3; color: white; font-weight: bold; padding: 4px 8px; font-size: 14px;'
			);
			console.log('Available commands:');
			console.log(
				'  maxiDebug.enable()  - Enable performance monitoring'
			);
			console.log(
				'  maxiDebug.disable() - Disable performance monitoring'
			);
			console.log(
				'  maxiDebug.isEnabled() - Check if monitoring is enabled'
			);
			console.log('\nWhen enabled, use:');
			console.log(
				'  maxiPerformance.report() - Generate performance report'
			);
			console.log('  maxiPerformance.export() - Export report as JSON');
			console.log('  maxiPerformance.getMetrics() - Get raw metrics');
			console.log('  maxiPerformance.stop() - Stop monitoring');
			console.log('  maxiPerformance.start() - Restart monitoring');
			console.log(
				'%c================================',
				'background: #2196F3; color: white; font-weight: bold; padding: 4px 8px;'
			);
		},
	};

	// Show help on first load if debug is enabled
	if (isDebugEnabled()) {
		console.log(
			'%c[MaxiBlocks] Debug mode active. Type maxiDebug.help() for commands.',
			'background: #4CAF50; color: white; font-weight: bold; padding: 2px 4px;'
		);
	}
};

export default {
	isDebugEnabled,
	enableDebug,
	disableDebug,
	initDebugControl,
};
