import { pressKeyTimes } from '@wordpress/e2e-test-utils';

/**
 * Adjust the advanced number control
 * @param {Object}                  params               - The parameters for the function
 * @param {Object}                  params.page          - The page object
 * @param {Object}                  params.instance      - The instance object
 * @param {number}                  params.numberOfTimes - The number of times to adjust the advanced number control
 * @param {'ArrowUp' | 'ArrowDown'} params.direction     - The direction to adjust the advanced number control
 */
const adjustANC = async ({
	page,
	instance,
	numberOfTimes = 3,
	direction = 'ArrowUp',
}) => {
	await instance.$eval('input', select => select.focus());
	await pressKeyTimes(direction, numberOfTimes);
	await page.waitForTimeout(350);
};

export default adjustANC;
