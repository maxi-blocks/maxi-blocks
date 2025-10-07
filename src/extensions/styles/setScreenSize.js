import { select, dispatch } from '@wordpress/data';

// Throttle rapid successive calls
let lastCallTime = 0;
let pendingCall = null;

const setScreenSizeImmediate = size => {
	const xxlSize = select('maxiBlocks').receiveXXLSize();
	const breakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

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
			pendingCall = null;
			setScreenSizeImmediate(size);
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
