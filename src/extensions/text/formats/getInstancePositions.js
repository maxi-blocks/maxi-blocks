/**
 * External dependencies
 */
import { isNil, chunk } from 'lodash';

/**
 * Check for the requested format type positions
 *
 * @param {Object} formatValue RichText format value
 * @param {string} formatName  RichText format type
 * @returns {Array} Array with pairs of position for start and end
 */
const getInstancePositions = (
	formatValue,
	formatName,
	formatClassName,
	formatAttributes
) => {
	if (!formatValue?.formats) return [];

	const locatedInstances = formatValue.formats.map((formatEl, i) => {
		if (
			formatEl.some(format => {
				if (!formatClassName && !formatAttributes)
					return format.type === formatName;
				if (!formatAttributes)
					return (
						format.type === formatName &&
						format.attributes.className === formatClassName
					);
				if (!formatClassName)
					return (
						format.type === formatName &&
						format.attributes.url === formatAttributes.url
					);

				return false;
			})
		)
			return i;

		return null;
	});

	const filteredLocatedInstances = locatedInstances.filter(
		(current, i, array) => {
			const prev = array[i - 1];
			const next = array[i + 1];

			return (
				(isNil(prev) && current + 1 === next) ||
				(isNil(next) && current - 1 === prev)
			);
		}
	);

	return chunk(filteredLocatedInstances, 2).map(instance => [
		instance[0],
		instance[1] + 1,
	]);
};

export default getInstancePositions;
