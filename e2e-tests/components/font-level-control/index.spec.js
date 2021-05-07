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
		await page.$$eval(
			'.components-popover__content .maxi-font-level-control .components-button.maxi-font-level-control__button',
			settings => settings[1].click()
		);
		/** await levelSettings[1].evaluate(setting => setting.click()); */
		/** await alignmentSettings[1].$eval('label', setting => setting.click()); */
		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
