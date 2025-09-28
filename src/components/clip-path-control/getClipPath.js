/**
 * External dependencies
 */
import { isArray, isEmpty } from 'lodash';

const getClipPath = clipPath => {
	if (!clipPath || isEmpty(clipPath) || isEmpty(clipPath.content)) {
		return 'none';
	}

	const { type, content } = clipPath;
	const arrayContent = Object.values(content || {});

	let newContent = '';

	switch (type) {
		case 'polygon': {
			const safePoints = arrayContent.filter(
				point =>
					Array.isArray(point) &&
					point[0] &&
					point[1] &&
					typeof point[0].value !== 'undefined' &&
					typeof point[1].value !== 'undefined' &&
					point[0].unit &&
					point[1].unit
			);

			if (safePoints.length === 0) return 'none';

			newContent = safePoints
				.map(p => `${p[0].value}${p[0].unit} ${p[1].value}${p[1].unit}`)
				.join(', ');
			break;
		}
		case 'circle': {
			const r = arrayContent?.[0]?.[0];
			const cx = arrayContent?.[1]?.[0];
			const cy = arrayContent?.[1]?.[1];
			if (!r || !cx || !cy) return 'none';
			newContent = `${r.value}${r.unit} at ${cx.value}${cx.unit} ${cy.value}${cy.unit}`;
			break;
		}
		case 'ellipse': {
			const rx = arrayContent?.[0]?.[0];
			const ry = arrayContent?.[1]?.[0];
			const cx = arrayContent?.[2]?.[0];
			const cy = arrayContent?.[2]?.[1];
			if (!rx || !ry || !cx || !cy) return 'none';
			newContent = `${rx.value}${rx.unit} ${ry.value}${ry.unit} at ${cx.value}${cx.unit} ${cy.value}${cy.unit}`;
			break;
		}
		case 'inset': {
			const top = arrayContent?.[0]?.[0];
			const right = arrayContent?.[1]?.[0];
			const bottom = arrayContent?.[2]?.[0];
			const left = arrayContent?.[3]?.[0];
			if (!top || !right || !bottom || !left) return 'none';
			newContent = `${top.value}${top.unit} ${right.value}${right.unit} ${bottom.value}${bottom.unit} ${left.value}${left.unit}`;
			break;
		}
		default:
			return 'none';
	}
	const newCP = `${type}${type !== 'none' ? `(${newContent})` : ''}`;

	return newCP;
};

export default getClipPath;
