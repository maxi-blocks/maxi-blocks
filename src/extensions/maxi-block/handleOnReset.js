/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getDefaultAttribute } from '../attributes';

const handleOnReset = props => {
	const { receiveBaseBreakpoint, receiveMaxiDeviceType } =
		select('maxiBlocks');

	const breakpoint = receiveMaxiDeviceType();

	if (breakpoint !== 'g') return props;

	const result = { ...props };

	const baseBreakpoint = receiveBaseBreakpoint();

	Object.keys(result).forEach(attr => {
		if (attr.includes('g')) {
			const baseAttr = attr.replace('g', baseBreakpoint);
			const baseDefaultAttr = getDefaultAttribute(baseAttr);

			result[baseAttr] = baseDefaultAttr;
		}
	});

	return result;
};

export default handleOnReset;
