import { select, dispatch } from '@wordpress/data';
import {
	getProfileStart,
	recordProfile,
} from '@extensions/performance/profiler';

// Throttle rapid successive calls
let lastCallTime = 0;
let pendingCall = null;

const getSafeProfileStart = () => {
	try {
		return getProfileStart();
	} catch {
		return null;
	}
};

const recordProfileSafely = (label, start) => {
	try {
		recordProfile(label, start);
	} catch {
		// Profiling must never block screen-size switching.
	}
};

const setScreenSizeImmediate = size => {
	const start = getSafeProfileStart();
	const xxlSize = select('maxiBlocks').receiveXXLSize();
	const breakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

	if (size === 'general')
		dispatch('maxiBlocks').setMaxiDeviceType({ deviceType: 'general' });
	else
		dispatch('maxiBlocks').setMaxiDeviceType({
			deviceType: size,
			width: size !== 'xxl' ? breakpoints[size] : xxlSize,
		});

	recordProfileSafely(`setScreenSize immediate ${size}`, start);
};

const setScreenSize = size => {
	const start = getSafeProfileStart();
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
		recordProfileSafely(`setScreenSize ${size} throttled`, start);
		return;
	}

	lastCallTime = now;
	setScreenSizeImmediate(size);
	recordProfileSafely(`setScreenSize ${size}`, start);
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
