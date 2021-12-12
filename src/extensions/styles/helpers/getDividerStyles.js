/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

/**
 * External dependencies
 */
import { isNil, isNumber } from 'lodash';

const getDividerStyles = (obj, target, parentBlockStyle) => {
	const response = {
		label: 'Divider',
		general: {},
	};

	if (target === 'line') {
		if (!isNil(obj['divider-border-style']))
			response.general['border-style'] = obj['divider-border-style'];

		if (
			obj['divider-border-palette-status'] &&
			isNumber(obj['divider-border-palette-color'])
		)
			response.general['border-color'] = getColorRGBAString({
				firstVar: 'divider-color',
				secondVar: `color-${obj['divider-border-palette-color']}`,
				opacity: obj['divider-border-palette-opacity'],
				blockStyle: parentBlockStyle,
			});
		else if (
			!obj['divider-border-palette-status'] &&
			!isNil(obj['divider-border-color'])
		)
			response.general['border-color'] = obj['divider-border-color'];

		if (obj.lineOrientation === 'horizontal') {
			response.general['border-right'] = 'none';

			if (
				obj['divider-border-radius'] &&
				obj['divider-border-style'] === 'solid'
			)
				response.general['border-radius'] = '20px';

			if (!isNil(obj['divider-width']))
				response.general.width = `${obj['divider-width']}${obj['divider-width-unit']}`;
			if (!isNil(obj['divider-border-top-width']))
				response.general[
					'border-top-width'
				] = `${obj['divider-border-top-width']}${obj['divider-border-top-unit']}`;
		}

		if (obj.lineOrientation === 'vertical') {
			response.general['border-top'] = 'none';

			if (
				obj['divider-border-radius'] &&
				obj['divider-border-style'] === 'solid'
			)
				response.general['border-radius'] = '20px';

			if (!isNil(obj['divider-border-right-width']))
				response.general[
					'border-right-width'
				] = `${obj['divider-border-right-width']}${obj['divider-border-right-unit']}`;
			if (!isNil(obj['divider-height']))
				response.general.height = `${obj['divider-height']}%}`;
		}
	} else if (!isNil(obj.lineAlign)) {
		response.general['flex-direction'] = obj.lineAlign;

		if (obj.lineAlign === 'row') {
			if (!isNil(obj.lineVertical))
				response.general['align-items'] = obj.lineVertical;
			if (!isNil(obj.lineHorizontal))
				response.general['justify-content'] = obj.lineHorizontal;
		} else {
			if (!isNil(obj.lineVertical))
				response.general['justify-content'] = obj.lineVertical;
			if (!isNil(obj.lineHorizontal))
				response.general['align-items'] = obj.lineHorizontal;
		}
	}

	return response;
};

export default getDividerStyles;
