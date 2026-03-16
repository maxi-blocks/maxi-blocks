import { select, dispatch } from '@wordpress/data';

// Throttle rapid successive calls
let lastCallTime = 0;
let pendingCall = null;

/**
 * Exported for consumers that want to check the same condition.
 * Always returns true – logging is unconditional.
 *
 * @returns {boolean}
 */
export const isBreakpointDebug = () => true;

/**
 * Initialise (or reset) the per-switch debug accumulator stored on window so
 * that every module that participates in a breakpoint switch can write into the
 * same object without needing an import.
 *
 * @param {string} from - Departing breakpoint.
 * @param {string} to   - Target breakpoint.
 */
const initBPSwitchDebug = (from, to) => {
	window.__maxiBPSwitch__ = {
		from,
		to,
		startTime: performance.now(),
		totalBlocks: 0,
		fastPathBlocks: 0,
		regenBlocks: 0,
		xxlCacheBlocks: 0,
		viewportUnitBlocks: 0,
	};
};

const setScreenSizeImmediate = size => {
	const xxlSize = select('maxiBlocks').receiveXXLSize();
	const breakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

	const from = select('maxiBlocks').receiveMaxiDeviceType?.() ?? 'unknown';
	console.info(
		`[MaxiBP] ▶ setScreenSize: ${from} → ${size} @${performance.now().toFixed(1)}ms`
	);
	initBPSwitchDebug(from, size);

	if (size === 'general')
		dispatch('maxiBlocks').setMaxiDeviceType({ deviceType: 'general' });
	else
		dispatch('maxiBlocks').setMaxiDeviceType({
			deviceType: size,
			width: size !== 'xxl' ? breakpoints[size] : xxlSize,
		});
};

const setScreenSize = size => {
	const now = Date.now();

	// Cancel any pending call
	if (pendingCall) {
		clearTimeout(pendingCall);
		pendingCall = null;
	}

	// If called too rapidly, defer it
	if (now - lastCallTime < 50) {
		// 50ms throttle
		pendingCall = setTimeout(() => {
			lastCallTime = Date.now();
			setScreenSizeImmediate(size);
			pendingCall = null;
		}, 50);
		return;
	}

	lastCallTime = now;
	setScreenSizeImmediate(size);
};

// Export for testing
export const resetThrottleState = () => {
	lastCallTime = 0;
	if (pendingCall) {
		clearTimeout(pendingCall);
		pendingCall = null;
	}
};

export default setScreenSize;
