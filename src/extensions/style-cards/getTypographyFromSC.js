/**
 * External dependencies
 */
import { isEmpty, isNil, merge } from 'lodash';

export const SCToTypographyParser = SCStyle => {
	const response = {};
	const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];
	const numberSettings = ['font-weight'];

	Object.entries(SCStyle).forEach(([key, val]) => {
		if (key.includes('general')) {
			breakpoints.forEach(breakpoint => {
				if (response[key.replace('general', breakpoint)]) return;

				const checkKey = key; // .replace('general', breakpoint);
				if (isNil(SCStyle.checkKey)) {
					if (checkKey.includes('font-size')) {
						const [num, unit] = val.match(/[a-zA-Z]+|[0-9\\.]+/g);
						response[checkKey] = num;
						const newUnitKey = checkKey.replace(
							'font-size',
							'font-size-unit'
						);
						response[newUnitKey] = unit;
						return;
					}
					if (checkKey.includes('letter-spacing')) {
						let newVal;
						if (typeof val === 'number') newVal = `${val}px`;
						else newVal = val;

						const [num, unit] =
							newVal.match(/[a-zA-Z]+|[0-9\\.]+/g);
						response[checkKey] = num;
						const newUnitKey = checkKey.replace(
							'letter-spacing',
							'letter-spacing-unit'
						);

						response[newUnitKey] = unit;
						return;
					}
					if (
						numberSettings.some(setting =>
							checkKey.includes(setting)
						)
					)
						response[checkKey] = +val;
					else response[checkKey] = val;
				}
			});
		}
		if (key.includes('font-size')) {
			const [num, unit] = val.match(/[a-zA-Z]+|[0-9\\.]+/g);
			response[key] = +num;
			const newUnitKey = key.replace('font-size', 'font-size-unit');
			response[newUnitKey] = unit;
			return;
		}
		if (key.includes('letter-spacing')) {
			let newVal;
			if (typeof val === 'number') newVal = `${val}px`;
			else newVal = val;

			const [num, unit] = newVal.match(/[a-zA-Z]+|[0-9\\.]+/g);
			response[key] = +num;
			const newUnitKey = key.replace(
				'letter-spacing',
				'letter-spacing-unit'
			);

			response[newUnitKey] = unit;
			return;
		}
		if (numberSettings.some(setting => key.includes(setting)))
			response[key] = +val;
		else response[key] = val;
	});

	return response;
};

const getTypographyFromSC = (styleCard, type) => {
	if (isNil(styleCard) || isEmpty(styleCard)) return {};

	const SC = {
		...merge(styleCard.defaultStyleCard[type], styleCard.styleCard[type]),
	};

	return SCToTypographyParser(SC);
};

export default getTypographyFromSC;
