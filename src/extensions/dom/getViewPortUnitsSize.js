import { select } from '@wordpress/data';

// Default breakpoint widths as fallback when store isn't ready
const DEFAULT_BREAKPOINTS = {
	xxl: 1920,
	xl: 1920,
	l: 1366,
	m: 1024,
	s: 767,
	xs: 480,
};

const getVwSize = breakpoint => {
	const xxlSize = select('maxiBlocks').receiveXXLSize();

	let size;
	if (breakpoint === 'xxl') {
		size = xxlSize;
	} else {
		const breakpoints = select('maxiBlocks').receiveMaxiBreakpoints();
		size = breakpoints?.[breakpoint];
	}

	// If size is not available from store, use default fallback
	if (!size || Number.isNaN(size)) {
		size = DEFAULT_BREAKPOINTS[breakpoint];
	}

	return size * 0.01;
};

export default getVwSize;
