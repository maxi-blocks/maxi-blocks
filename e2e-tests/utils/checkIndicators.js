/* eslint-disable no-await-in-loop */

/**
 * External dependencies
 */
import { isArray } from 'lodash';

const checkIndicators = async ({ page, indicators }) => {
	const indicator = await page.$$(
		'.maxi-accordion-control__item__button.maxi-accordion-control__item--active'
	);

	for (let i = 0; i < indicator.length; i += 1) {
		const expectIndicator = !isArray(indicators)
			? indicators
			: indicators[i];
		const activeIndicator = await page.$$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			input => input[0].outerText
		);

		if (activeIndicator !== expectIndicator)
			console.error(
				`The activated indicator has been ${activeIndicator}`
			);
	}
	return true;
};

export default checkIndicators;
