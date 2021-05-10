/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

import { getBlockAttributes } from '../../utils';

describe('Alignment', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the operation of alignment-control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing test maxi');
		await page.$eval('.toolbar-item__alignment', button => button.click());
		await page.waitForSelector(
			'.components-popover__content .maxi-alignment-control__no-label'
		);
		const alignmentSettings = await page.$$(
			'.components-popover__content .maxi-alignment-control__no-label .components-radio-control__option'
		);

		const alignments = ['left', 'center', 'right', 'justify'];

		for (let i = 0; i < alignmentSettings.length; i++) {
			const setting = alignmentSettings[i];

			await setting.click();

			const attributes = await getBlockAttributes();

			debugger;

			expect(attributes['text-alignment-general']).toStrictEqual(
				alignments[i]
			);
		}
	});
});
