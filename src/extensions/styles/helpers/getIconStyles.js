/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getIconStyles = (obj, target) => {
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

	if (target === 'svg' && !obj['icon-palette-color-status'])
		if (!isNil(obj['icon-color']))
			response.general.fill = obj['icon-color'];

	return response;
};

export default getIconStyles;
