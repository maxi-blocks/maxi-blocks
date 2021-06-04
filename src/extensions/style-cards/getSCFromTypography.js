/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../styles';

/**
 * External dependencies
 */
import { isEmpty, isNumber, isBoolean } from 'lodash';

const unitSettings = ['font-size', 'line-height', 'letter-spacing'];

const getSCFromTypography = (styleCards, typographyObj) => {
	const parsedTypography = {};

	Object.entries(typographyObj).forEach(([key, val]) => {
		if (isEmpty(val) && !isNumber(val) && !isBoolean(val)) {
			if (!key.includes('-unit')) {
				const newValue = styleCards.defaultStyleCard[key];
				parsedTypography[key] = newValue;
			}

			return;
		}

		if (unitSettings.some(setting => key.includes(setting))) {
			const isUnit = key.includes('-unit');
			if (isUnit) return;

			const setting = unitSettings.filter(setting =>
				key.includes(setting)
			)[0];
			const breakpoint = key.match(/-[^-]*$/gm)[0].replace('-', '');
			const unitLabel = key
				.replace(setting, `${setting}-unit`)
				.replace(/-[^-]*$/gm, '');
			const unit = getLastBreakpointAttribute(
				unitLabel,
				breakpoint,
				typographyObj
			);

			parsedTypography[key] = `${val}${unit || ''}`;
		} else if (!key.includes('-unit')) parsedTypography[key] = val;
	});

	return parsedTypography;
};

export default getSCFromTypography;
