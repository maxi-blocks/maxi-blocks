/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('RadioControl', () => {
	it('Check radio control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openSidebar(page, 'alignment');

		const alignmentSettings = await page.$$(
			'.components-popover__content .maxi-alignment-control__no-label .components-radio-control__option'
		);

		const alignments = ['center', 'right', 'justify', 'left'];

		for (let i = 0; i < alignmentSettings.length; i++) {
			const setting = alignmentSettings[i !== 3 ? i + 1 : 0];

			await setting.click();

			const attribute = attributes['text-alignment-general'];
			const attributes = await getBlockAttributes();

			expect(attribute).toStrictEqual(alignments[i]);
		}
	});
});
