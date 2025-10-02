/**
 * Helpers
 * - Validate nodes and values and construct CSS strings safely
 */
const hasValueAndUnit = node =>
	node &&
	typeof node.value !== 'undefined' &&
	typeof node.unit !== 'undefined';

const isFiniteNumericValue = value => {
	if (typeof value === 'number') return Number.isFinite(value);
	if (typeof value === 'string' && value.trim() !== '')
		return Number.isFinite(Number(value));

	return false;
};

const buildCoordinate = coordinate => `${coordinate.value}${coordinate.unit}`;

const getClipPath = clipPath => {
	// Guard against invalid structures
	if (!clipPath || !clipPath.type) return 'none';

	const { type, content } = clipPath;

	// Short-circuit explicit none
	if (type === 'none') return 'none';

	// Ensure content exists and is an object
	if (!content || typeof content !== 'object') return 'none';

	const arrayContent = Object.values(content);

	let newContent = '';

	switch (type) {
		case 'polygon': {
			// Ensure at least three valid points to form a polygon
			const safePoints = arrayContent.filter(
				point =>
					Array.isArray(point) &&
					point.length >= 2 &&
					point.every(hasValueAndUnit)
			);

			if (safePoints.length < 3) return 'none';

			newContent = safePoints
				.map(
					([first, second]) =>
						`${buildCoordinate(first)} ${buildCoordinate(second)}`
				)
				.join(', ');
			break;
		}
		case 'circle': {
			const [radiusHandle, centerHandle] = arrayContent;
			const radius = radiusHandle?.[0];
			const cx = centerHandle?.[0];
			const cy = centerHandle?.[1];

			if (![radius, cx, cy].every(hasValueAndUnit)) return 'none';

			newContent = `${buildCoordinate(radius)} at ${buildCoordinate(
				cx
			)} ${buildCoordinate(cy)}`;
			break;
		}
		case 'ellipse': {
			const [rxHandle, ryHandle, centerHandle] = arrayContent;
			const rx = rxHandle?.[0];
			const ry = ryHandle?.[0];
			const cx = centerHandle?.[0];
			const cy = centerHandle?.[1];

			if (![rx, ry, cx, cy].every(hasValueAndUnit)) return 'none';

			newContent = `${buildCoordinate(rx)} ${buildCoordinate(
				ry
			)} at ${buildCoordinate(cx)} ${buildCoordinate(cy)}`;
			break;
		}
		case 'inset': {
			// Validate four sides and ensure numeric values and non-empty units
			const sides = arrayContent.slice(0, 4).map(handle => handle?.[0]);

			if (
				sides.length < 4 ||
				sides.some(
					side =>
						!hasValueAndUnit(side) ||
						!isFiniteNumericValue(side.value) ||
						typeof side.unit !== 'string' ||
						side.unit.trim() === ''
				)
			)
				return 'none';

			newContent = sides.map(side => buildCoordinate(side)).join(' ');
			break;
		}
		default:
			return 'none';
	}

	return `${type}(${newContent})`;
};

export default getClipPath;
