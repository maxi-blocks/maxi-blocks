/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openSidebar } from '../../utils';

describe('border control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the border control', async () => {
		await insertBlock('Text Maxi');

		const borderAccordion = await openSidebar(page, 'border');
		const borderButton = await borderAccordion.$$(
			'.maxi-tabs-content .maxi-default-styles-control button'
		);

		const expectAttributes = ['solid', 'dashed', 'dotted', undefined];

		for (let i = 0; i < expectAttributes.length; i++) {
			const expectResult = expectAttributes[i];

			await page.$$eval(
				'.maxi-border-control .maxi-default-styles-control button', // AHORA!!!1 :D
				(buttons, i) => buttons[i].click(),
				i // mea culpa.... hahahahahaha
			);

			const attributes = await getBlockAttributes();

			expect(attributes['border-style-general']).toStrictEqual(
				// no debería... pero ya lo revisarás. Eso es más facil. Seguimos!
				expectAttributes[i]
			);
		}

		const borderType = await borderAccordion.$(
			'.maxi-tabs-content .maxi-border-control__type .maxi-base-control__field select'
		);
		await borderType.select('groove');
		const expectBorderType = 'groove';
		const firstAttributes = await getBlockAttributes();

		expect(firstAttributes['border-style-general']).toStrictEqual(
			expectBorderType
		);

		// color
		await page.$$eval(
			'.maxi-border-control .maxi-color-palette-control .maxi-base-control__field .maxi-sc-color-palette div',
			clickDiv => clickDiv[4].click()
		);

		// await page.waitForTimeout(1000);

		const expectedColorResult = '4';

		const colorAttributes = await getBlockAttributes();

		expect(colorAttributes['palette-preset-border-color']).toStrictEqual(
			expectedColorResult
		);

		// sin problema!
	});
});
