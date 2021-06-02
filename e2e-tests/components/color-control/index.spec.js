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

describe('color control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the color control', async () => {
		await insertBlock('Text Maxi');

		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-fancy-radio-control .maxi-base-control__field label',
			fancyRadioControls => fancyRadioControls[14].click()
			/* fancyRadioControls =>
				fancyRadioControls[1].querySelectorAll('input')[1].click() */
		);

		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-fancy-radio-control label',
			select => select[4].click()
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

		const attributes = await getBlockAttributes();

		expect(attributes['background-color']).toStrictEqual(expectedResult);
	}, 30000);
});
