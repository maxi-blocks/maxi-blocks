/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes } from '../../utils';

describe('AlignmentControl', () => {
	it('Checking the operation of alignment-control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		debugger;
		await page.$eval('.toolbar-wrapper .toolbar-item__alignment', button =>
			button.click()
		);

		await page.waitForSelector(
			'.components-popover__content .maxi-alignment-control__no-label'
		);
		const alignmentSettings = await page.$$(
			'.components-popover__content .maxi-alignment-control__no-label label'
		);

		const alignments = ['center', 'right', 'justify', 'left'];

		for (let i = 0; i < alignmentSettings.length; i++) {
			const setting = alignmentSettings[i !== 3 ? i + 1 : 0];

			await setting.click();

			const attributes = await getBlockAttributes();
			const attribute = attributes['text-alignment-general'];
			expect(attribute).toStrictEqual(alignments[i]);
		}
	});
});
