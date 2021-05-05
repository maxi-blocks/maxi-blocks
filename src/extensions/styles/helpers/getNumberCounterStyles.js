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
		response.general['fill'] = obj['number-counter-text-color'];

	if (target === 'text' && !isNil(obj['number-counter-title-font-size']))
		response.general[
			'font-size'
		] = `${obj['number-counter-title-font-size']}px`;

	return response;
};

export default getNumberCounterStyles;
