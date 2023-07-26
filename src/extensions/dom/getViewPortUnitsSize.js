import { select } from '@wordpress/data';

const getVwSize = breakpoint => {
	const xxlSize = select('maxiBlocks').receiveXXLSize();

	return (
		(breakpoint === 'xxl'
			? xxlSize
			: select('maxiBlocks').receiveMaxiBreakpoints()[breakpoint]) * 0.01
	);
};

export default getVwSize;
