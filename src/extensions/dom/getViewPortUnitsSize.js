import { select } from '@wordpress/data';

export const getVwSize = breakpoint => {
	const xxlSize = select('maxiBlocks').receiveXXLSize();

	return (
		(breakpoint === 'xxl'
			? xxlSize
			: select('maxiBlocks').receiveMaxiBreakpoints()[breakpoint]) * 0.01
	);
};

export const getVhSize = () => {
	if (typeof window === 'undefined') return 0;

	const height =
		window.innerHeight || document.documentElement?.clientHeight || 0;

	return height * 0.01;
};

export default getVwSize;
