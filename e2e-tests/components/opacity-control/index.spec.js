/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import openSidebar from '../../utils/openSidebar';
import { getBlockAttributes } from '../../utils';

describe('opacity control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the opacity control', async () => {
		await insertBlock('Button Maxi');

		await openSidebar(page, 'background');

		await page.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control',
			fancyRadioControls =>
				fancyRadioControls[1].querySelectorAll('input')[1].click()
		);

		await page.$eval(
			'.maxi-background-control .maxi-color-control__color input',
			select => select.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('FAFA03');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(1000);

		const expectedResult = 'rgba(250,250,3,1)';

		const attributesFirst = await getBlockAttributes();

		expect(attributesFirst['background-color']).toStrictEqual(
			expectedResult
		);

		await page.$eval(
			'.maxi-background-control .components-input-control__container input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type(50);
		await page.keyboard.press('Enter');
		const attributesSecond = await getBlockAttributes();
		const expectedResultSecond = 'rgba(250,250,3,0.50)';

		expect(attributesSecond['background-color']).toStrictEqual(
			expectedResultSecond
		);
	}, 30000);
});
