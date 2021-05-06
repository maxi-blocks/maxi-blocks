/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	// pressKeyWithModifier,
	// openPreviewPage,
	// pressKeyTimes,
	// setClipboardData,
} from '@wordpress/e2e-test-utils';

describe('Alignment', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it.only('write a sentence in text maxi and use alignment', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Alignment');
		await page.$eval('.toolbar-item__alignment', button => button.click());
		const alignmentSettings = await page.$$(
			'.components-radio-control__options'
		);
		await alignmentSettings[1].$eval(
			'.components-radio-control__option',
			setting => setting.click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
