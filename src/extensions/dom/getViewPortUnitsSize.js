import { select } from '@wordpress/data';

const getVwSize = () => {
	const xxlSize = select('maxiBlocks').receiveXXLSize();
	const currentBreakpoint = select('maxiBlocks').receiveMaxiDeviceType();
	const breakpoint =
		currentBreakpoint === 'general'
			? select('maxiBlocks').receiveBaseBreakpoint()
			: currentBreakpoint;

	return (
		(breakpoint === 'xxl'
			? xxlSize
			: select('maxiBlocks').receiveMaxiBreakpoints()[breakpoint]) * 0.01
	);
};

const getVhSize = () => window.innerHeight * 0.01;

export { getVwSize, getVhSize };
