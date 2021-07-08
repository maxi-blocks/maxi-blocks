/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getIconStyles = (obj, target, parentBlockStyle) => {
	const response = {
		label: 'Icon',
		general: {},
	};

	if (target === 'icon') {
		if (!isNil(obj['icon-spacing']) && !isNil(obj['icon-position']))
			obj['icon-position'] === 'left'
				? (response.general[
						'margin-right'
				  ] = `${obj['icon-spacing']}px`)
				: (response.general[
						'margin-left'
				  ] = `${obj['icon-spacing']}px`);

		if (!isNil(obj['icon-size']))
			response.general.width = `${obj['icon-size']}px`;
	}

	if (target === 'svg') {
		if (!obj['icon-palette-color-status'] && !isNil(obj['icon-color']))
			response.general.stroke = obj['icon-color'];
		else if (obj['icon-palette-color-status'] && obj['icon-palette-color'])
			response.general.stroke = `var(--maxi-${parentBlockStyle}-color-${obj['icon-palette-color']})`;
	}

	return response;
};

export default getIconStyles;
