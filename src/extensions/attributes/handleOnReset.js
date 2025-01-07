/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getDefaultAttribute } from '@extensions/styles';

const handleOnReset = props => {
	const { receiveBaseBreakpoint, receiveMaxiDeviceType } =
		select('maxiBlocks');

	const breakpoint = receiveMaxiDeviceType();

	if (breakpoint !== 'general') return props;

	const result = { ...props };

	const baseBreakpoint = receiveBaseBreakpoint();

	Object.keys(result).forEach(attr => {
		if (attr.includes('general')) {
			const baseAttr = attr.replace('general', baseBreakpoint);
			const baseDefaultAttr = getDefaultAttribute(baseAttr);

			result[baseAttr] = baseDefaultAttr;
		}
	});

	return result;
};

export default handleOnReset;
