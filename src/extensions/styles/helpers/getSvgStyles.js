/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getSvgStyles = (obj, target, parentBlockStyle) => {
	const response = {
		label: 'SVG',
		general: {},
	};

	if (target === 'path-fill') {
		if (
			obj['svg-palette-fill-color-status'] &&
			obj['svg-palette-fill-color']
		)
			response.general.fill = `var(--maxi-${parentBlockStyle}-icon-fill, var(--maxi-${parentBlockStyle}-color-${obj['svg-palette-fill-color']}))`;
		else if (
			!obj['svg-palette-fill-color-status'] &&
			!isNil(obj['svg-fill-color'])
		)
			response.general.fill = obj['svg-fill-color'];
	}

	if (target === 'path-stroke') {
		if (
			obj['svg-palette-line-color-status'] &&
			obj['svg-palette-line-color']
		)
			response.general.stroke = `var(--maxi-${parentBlockStyle}-icon-line, var(--maxi-${parentBlockStyle}-color-${obj['svg-palette-line-color']}))`;
		else if (
			!obj['svg-palette-line-color-status'] &&
			!isNil(obj['svg-line-color'])
		)
			response.general.stroke = obj['svg-line-color'];
	}

	return response;
};

export default getSvgStyles;
