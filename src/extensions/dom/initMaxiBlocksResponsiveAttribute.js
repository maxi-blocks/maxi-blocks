import { select } from '@wordpress/data';

const initMaxiBlocksResponsiveAttribute = element => {
	if (
		element &&
		!element.getAttributeNames().includes('maxi-blocks-responsive')
	) {
		const { receiveWinBreakpoint } = select('maxiBlocks');

		const winBreakpoint = receiveWinBreakpoint();

		element.setAttribute('maxi-blocks-responsive', winBreakpoint);
	}
};

export default initMaxiBlocksResponsiveAttribute;
