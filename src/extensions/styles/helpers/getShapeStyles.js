/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getShapeStyles = obj => {
	const response = {
		label: 'Shape',
		general: {},
	};
	if (!isNil(obj['shape-width']))
		response.general.width = `${obj['shape-width']}${obj['shape-width-unit']}`;

	return response;
};

export default getShapeStyles;
