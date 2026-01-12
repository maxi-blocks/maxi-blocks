import { select } from '@wordpress/data';

export const getVwSize = breakpoint => {
	const xxlSize = select('maxiBlocks').receiveXXLSize();

	const value =
		(breakpoint === 'xxl'
			? xxlSize
			: select('maxiBlocks').receiveMaxiBreakpoints()[breakpoint]) * 0.01;

	return value;
};

export const getVhSize = () => {
	if (typeof window === 'undefined') return 0;

	const height =
		window.innerHeight || document.documentElement?.clientHeight || 0;
	const value = height * 0.01;

	return value;
};

export default getVwSize;
