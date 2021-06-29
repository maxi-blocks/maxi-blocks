/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('BorderControl', () => {
	it('Checking the border control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		const borderAccordion = await openSidebar(page, 'border');
		await borderAccordion.$$(
			'.maxi-tabs-content .maxi-default-styles-control button'
		);

		const expectAttributes = [undefined, 'solid', 'dashed', 'dotted'];

		for (let i = 0; i < expectAttributes.length; i++) {
			expectAttributes[i];

			await page.$$eval(
				'.maxi-border-control .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			const attributes = await getBlockAttributes();
			const borderAttribute = attributes['border-style-general'];

			expect(borderAttribute).toStrictEqual(expectAttributes[i]);
		}

		const borderType = await borderAccordion.$(
			'.maxi-tabs-content .maxi-border-control__type .maxi-base-control__field select'
		);

		await borderType.select('groove');
		const expectBorderType = 'groove';

		const attributes = await getBlockAttributes();
		const borderAttribute = attributes['border-style-general'];

		expect(borderAttribute).toStrictEqual(expectBorderType);

		// color
		await page.$$eval(
			'.maxi-border-control .maxi-base-control__field .maxi-sc-color-palette div',
			clickDiv => clickDiv[4].click()
		);

		const expectedColorResult = 5;

		const colorAttributes = await getBlockAttributes();
		const borderColor = colorAttributes['border-palette-color-general'];

		expect(borderColor).toStrictEqual(expectedColorResult);
	});
});
