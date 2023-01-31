/**
 * External dependencies
 */
import { isArray, isEmpty } from 'lodash';

const getClipPath = clipPath => {
	const { type, content } = clipPath;
	const arrayContent = Object.values(content);

	let newContent = '';

	switch (type) {
		case 'polygon':
			newContent = arrayContent.reduce((a, b) => {
				if (isArray(a))
					return `${a[0].value}${a[0].unit} ${a[1].value}${a[1].unit}, ${b[0].value}${b[0].unit} ${b[1].value}${b[1].unit}`;
				return `${!isEmpty(a) ? `${a}, ` : ''}${b[0].value}${
					b[0].unit
				} ${b[1].value}${b[1].unit}`;
			});
			break;
		case 'circle':
			newContent = `${arrayContent[0][0].value}${arrayContent[0][0].unit} at ${arrayContent[1][0].value}${arrayContent[1][0].unit} ${arrayContent[1][1].value}${arrayContent[1][1].unit}`;
			break;
		case 'ellipse':
			newContent = `${arrayContent[0][0].value}${arrayContent[0][0].unit} ${arrayContent[1][0].value}${arrayContent[1][0].unit} at ${arrayContent[2][0].value}${arrayContent[2][0].unit} ${arrayContent[2][1].value}${arrayContent[2][1].unit}`;
			break;
		case 'inset':
			newContent = `${arrayContent[0][0].value}${arrayContent[0][0].unit} ${arrayContent[1][0].value}${arrayContent[1][0].unit} ${arrayContent[2][0].value}${arrayContent[2][0].unit} ${arrayContent[3][0].value}${arrayContent[3][0].unit}`;
			break;
		default:
			break;
	}
	const newCP = `${type}${type !== 'none' ? `(${newContent})` : ''}`;

	return newCP;
};

export default getClipPath;
