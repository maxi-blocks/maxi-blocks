/**
 * WordPress dependencies
 */
const { select } = wp.data;

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const getValueWithSC = (attribute, label, style = 'light', textLevel) => {
	if (!isNil(attribute) && !isEmpty(attribute)) return attribute;

	if (label === 'background-active-media') {
		return 'color';
	}

	const SC = select('maxiBlocks/style-cards').receiveMaxiStyleCards();

	if (isNil(SC) || isNil(SC[style])) return false;

	if (label === 'background-color') return SC[style]['background-1']; // temporary just background-1
	if (label.includes('font-size')) {
		const isUnit = label.includes('-unit');
		const prefix = textLevel ? `${textLevel}-` : '';
		const newKey = isUnit
			? prefix + label.replace('-unit', '')
			: prefix + label;
		const [num, unit] = SC[style][newKey].match(/[a-zA-Z]+|[0-9]+/g);

		if (isUnit) return unit;
		return num;
	}

	return SC[style][label];
};

export default getValueWithSC;
