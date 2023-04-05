import { select } from '@wordpress/data';

const getVwSize = () => {
	const currentBreakpoint = select('maxiBlocks').receiveMaxiDeviceType();
	const breakpoint =
		currentBreakpoint === 'general'
			? select('maxiBlocks').receiveBaseBreakpoint()
			: currentBreakpoint;

	return select('maxiBlocks').receiveMaxiBreakpoints()[breakpoint] * 0.01;
};

const getVhSize = () => window.innerHeight * 0.01;

export { getVwSize, getVhSize };
