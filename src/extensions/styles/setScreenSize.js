import { select, dispatch } from '@wordpress/data';

const setScreenSize = size => {
	const xxlSize = select('maxiBlocks').receiveXXLSize();
	const breakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

	if (size === 'general') dispatch('maxiBlocks').setMaxiDeviceType('general');
	else
		dispatch('maxiBlocks').setMaxiDeviceType(
			size,
			size !== 'xxl' ? breakpoints[size] : xxlSize
		);
};

export default setScreenSize;
