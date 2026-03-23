import { getGroupAttributes } from '@extensions/styles';

/**
 * Returns flex gap-related attributes for row/column layout.
 * Builds a new object (never mutates getGroupAttributes output) so callers
 * can safely cache or compare references without cross-render side effects.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Subset of flex keys whose names include "gap".
 */
const getRowGapProps = attributes => {
	const flexAttrs = getGroupAttributes(attributes, 'flex');
	const response = {};

	Object.keys(flexAttrs).forEach(key => {
		if (key.includes('gap')) {
			response[key] = flexAttrs[key];
		}
	});

	return response;
};

export default getRowGapProps;
