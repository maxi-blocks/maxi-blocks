/**
 * Internal dependencies
 */
import { getAttributeKey } from '@extensions/styles';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 *
 * @param {Object} attributes
 * @param {string} prefix
 * @returns {boolean} true if preserveAspectRatio is needed
 */
const shouldSetPreserveAspectRatio = (attributes, prefix = '') =>
	breakpoints.some(breakpoint => {
		const key = getAttributeKey(
			'width-fit-content',
			false,
			prefix,
			breakpoint
		);

		return key in attributes && attributes[key];
	});

export default shouldSetPreserveAspectRatio;
