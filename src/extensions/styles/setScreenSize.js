import { select, dispatch } from '@wordpress/data';

const setScreenSize = (size, changeSize = true) => {
	const xxlSize = select('maxiBlocks').receiveXXLSize();
	const breakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

	if (size === 'g')
		dispatch('maxiBlocks').setMaxiDeviceType({ deviceType: 'g' });
	else
		dispatch('maxiBlocks').setMaxiDeviceType({
			deviceType: size,
			width: size !== 'xxl' ? breakpoints[size] : xxlSize,
			changeSize,
		});
};

export default setScreenSize;
