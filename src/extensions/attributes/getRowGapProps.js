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
	return Object.fromEntries(
		Object.entries(flexAttrs).filter(([key]) => key.includes('gap'))
	);
};

export default getRowGapProps;
