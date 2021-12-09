/**
 * Internal dependencies
 */
import getInstancePositions from './getInstancePositions';

const getFormatPosition = ({
	formatValue,
	formatName,
	formatClassName,
	formatAttributes,
}) => {
	const positions =
		getInstancePositions(
			formatValue,
			formatName,
			formatClassName,
			formatAttributes
		) ?? [];

	const { start, end } = formatValue;

	return positions.filter(pos => {
		if (pos[0] <= start && end - 1 <= pos[1]) return pos;

		return false;
	})[0];
};

export default getFormatPosition;
