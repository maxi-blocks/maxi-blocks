/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Alignment', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the operation of alignment-contorl', async () => {
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
		// Check alignment center
		expect(await getEditedPostContent()).toMatchSnapshot();

		await alignmentSettings[0].$eval('label', setting => setting.click());
		// Check alignment left
		expect(await getEditedPostContent()).toMatchSnapshot();

		await alignmentSettings[2].$eval('label', setting => setting.click());
		// Check alignment right
		expect(await getEditedPostContent()).toMatchSnapshot();

		await alignmentSettings[3].$eval('label', setting => setting.click());
		// Check alignment justify
		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
