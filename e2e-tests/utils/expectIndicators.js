/* eslint-disable no-await-in-loop */

/**
 * External dependencies
 */
import { isArray } from 'lodash';

const expectIndicators = async ({ page, indicators }) => {
	const indicator = await page.$$(
		'.maxi-accordion-control__item__button.maxi-accordion-control__item--active'
	);

	for (let i = 0; i < indicator.length; i += 1) {
		debugger;
		const activeIndicator = await page.$$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			input => input[indicator].outerText
		);

		const expectInspector = !isArray(indicators)
			? indicators
			: indicators[i];

		if (activeIndicator !== expectInspector) return false;
	}
	return true;
};

export default expectIndicators;
