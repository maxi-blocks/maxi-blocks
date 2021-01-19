/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getDividerStyles = (obj, target) => {
	const response = {
		label: 'Divider',
		general: {},
	};
	console.log('>>>>>', obj);
	if (target === 'line') {
		if (!isNil(obj['width']))
			response.general['width'] = `${obj['width']}${obj['width-unit']}`;

		if (!isNil(obj['height']))
			response.general[
				'height'
			] = `${obj['height']}${obj['height-unit']}`;

		if (!isNil(obj['border-style']))
			response.general['border-style'] = obj['border-style'];

		if (!isNil(obj['border-color']))
			response.general['border-color'] = obj['border-color'];

		if (!isNil(obj['border-top-width']))
			response.general[
				'border-top-width'
			] = `${obj['border-top-width']}${obj['border-top-unit']}`;

		if (!isNil(obj['border-right-width']))
			response.general[
				'border-right-width'
			] = `${obj['border-right-width']}${obj['border-right-unit']}`;

		if (!!obj['border-radius']) response.general['border-radius'] = '20px';
	} else {
		if (!isNil(obj.lineAlign))
			response.general['flex-direction'] = obj.lineAlign;
		if (!isNil(obj.lineVertical))
			response.general['align-items'] = obj.lineVertical;
		if (!isNil(obj.lineHorizontal))
			response.general['justify-content'] = obj.lineHorizontal;
	}

	return response;
};

export default getDividerStyles;
