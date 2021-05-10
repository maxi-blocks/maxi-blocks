/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('font level', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the font level control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing level');
		await page.$eval('.toolbar-item__text-level', button => button.click());
		await page.waitForSelector(
			'.components-popover__content .maxi-font-level-control'
		);
		const fontLevelControl = await page.$$(
			'.components-popover__content .maxi-font-level-control .components-button.maxi-font-level-control__button'
		);

		for (let i = 0; i < fontLevelControl.length; i++) {
			const setting = fontLevelControl[i];

			await setting.click();
			expect(await getEditedPostContent()).toMatchSnapshot();
		}
	});
});
