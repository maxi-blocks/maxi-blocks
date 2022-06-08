/* eslint-disable no-await-in-loop */

/**
 * External dependencies
 */
import { isArray } from 'lodash';

const checkIndicators = async ({ page, indicators }) => {
	const indicator = await page.$$(
		'.maxi-accordion-control__item__button.maxi-accordion-control__item--active'
	);
	debugger;

	for (let i = 0; i < indicator.length; i += 1) {
		const expectInspector = !isArray(indicators)
			? indicators
			: indicators[i];
		const test = await page.$$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			input => input[0].outerText
		);

		debugger;
		if (test !== expectInspector) return false;

		debugger;
	}
	return true;
};

export default checkIndicators;
