/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';
import getActiveStyleCard from './getActiveStyleCard';

export const SCToTypographyParser = (level, SCStyle) => {
	const response = {};
	const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];
	const numberSettings = ['font-weight'];

	Object.entries(SCStyle).forEach(([key, val]) => {
		if (key.includes(`${level}-`)) {
			if (key.includes('general')) {
				breakpoints.forEach(breakpoint => {
					if (response[key.replace('general', breakpoint)]) return;

					const checkKey = key.replace('general', breakpoint);
					if (isNil(SCStyle.checkKey)) {
						if (checkKey.includes('font-size')) {
							const [num, unit] = val.match(/[a-zA-Z]+|[0-9]+/g);
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

							const [num, unit] = newVal.match(
								/[a-zA-Z]+|[0-9\.]+/g
							);
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
				const [num, unit] = val.match(/[a-zA-Z]+|[0-9]+/g);
				response[key] = +num;
				const newUnitKey = key.replace('font-size', 'font-size-unit');
				response[newUnitKey] = unit;
				return;
			}
			if (key.includes('letter-spacing')) {
				let newVal;
				if (typeof val === 'number') newVal = `${val}px`;
				else newVal = val;

				const [num, unit] = newVal.match(/[a-zA-Z]+|[0-9\.]+/g);
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
		}
	});

	return response;
};

const getTypographyFromSC = (level, SCStyle, styleCards) => {
	let SC;

	if (isNil(styleCards) || isEmpty(styleCards))
		SC = getActiveStyleCard().value;
	else SC = styleCards;

	if (isNil(SC) || isEmpty(SC)) return {};

	const defaultTypography = SCToTypographyParser(
		level,
		SC.styleCardDefaults[SCStyle]
	);

	if (!isEmpty(SC.styleCard[SCStyle])) {
		const typography = SCToTypographyParser(level, SC.styleCard[SCStyle]);
		return { ...defaultTypography, ...typography };
	}
	return defaultTypography;
};

export default getTypographyFromSC;
