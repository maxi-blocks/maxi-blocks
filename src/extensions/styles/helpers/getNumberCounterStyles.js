/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getNumberCounterStyles = (obj, target) => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	if (
		target === 'circle-bar' &&
		!isNil(obj['number-counter-circle-bar-color'])
	)
		response.general['stroke'] = obj['number-counter-circle-bar-color'];

	if (
		target === 'circle-background' &&
		!isNil(obj['number-counter-circle-background-color'])
	)
		response.general['stroke'] =
			obj['number-counter-circle-background-color'];

	if (target === 'text' && !isNil(obj['number-counter-text-color']))
		response.general['color'] = obj['number-counter-text-color'];

	if (target === 'text' && !isNil(obj['number-counter-title-font-size']))
		response.general[
			'font-size'
		] = `${obj['number-counter-title-font-size']}px`;

	if (target === 'sup' && !isNil(obj['number-counter-title-font-size']))
		response.general['font-size'] = `calc(${
			obj['number-counter-title-font-size'] / 1.5
		}px)`;

	return response;
};

export default getNumberCounterStyles;
