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
		await page.waitForSelector(
			'.components-popover__content .maxi-alignment-control__no-label'
		);
		const alignmentSettings = await page.$$(
			'.components-popover__content .maxi-alignment-control__no-label .components-radio-control__option'
		);
		await alignmentSettings[1].$eval('label', setting => setting.click());

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});

// const popover = await page.$('.components-popover__content');
// const alignmentWrapper = popover.$('.maxi-alignment-control__no-label');
// const alignmentSettings = await alignmentWrapper.$$(
// 	'.components-radio-control__option'
// );
