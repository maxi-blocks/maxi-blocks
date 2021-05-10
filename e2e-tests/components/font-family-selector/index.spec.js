import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('font level', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the font family selector', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing font family selector');
		await page.$eval('.toolbar-item__text-options', button =>
			button.click()
		);
		await page.waitForSelector(
			'.components-popover__content .maxi-font-options'
		);
		const fontFamilySelector = await page.$(
			'.components-popover__content .maxi-font-options .toolbar-item__popover__font-options__font'
		);
		await fontFamilySelector.focus();
		await page.keyboard.type('Lato');
		await page.keyboard.press('Enter');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
