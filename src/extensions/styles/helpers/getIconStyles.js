/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getIconStyles = obj => {
	const response = {
		label: 'Icon',
		general: {},
	};

	if (!isNil(obj['icon-spacing']) && !isNil(obj['icon-position']))
		obj['icon-position'] === 'left'
			? (response.general['margin-right'] = `${obj['icon-spacing']}px`)
			: (response.general['margin-left'] = `${obj['icon-spacing']}px`);

	if (!isNil(obj['icon-size']))
		response.general.width = `${obj['icon-size']}px`;

	return response;
};

export default getIconStyles;
