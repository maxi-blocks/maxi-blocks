/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 *  Internal dependencies
 */
import { getIsValid } from './utils';

const updateBreakpointAttributes = (attributes, exceptions = []) => {
	const response = {};

	Object.entries(attributes).forEach(([key, value]) => {
		if (
			key.includes('-general') &&
			!exceptions.includes(key) &&
			getIsValid(value.default, true)
		) {
			const newKey = key.replace(
				'-general',
				`-${select('maxiBlocks').receiveWinBreakpoint()}`
			);

			response[newKey] = value;
		}
	});

	return { ...attributes, ...response };
};

export default updateBreakpointAttributes;
