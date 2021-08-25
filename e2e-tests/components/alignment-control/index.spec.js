/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('AlignmentControl', () => {
	it('Checking the operation of alignment-control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		await page.$eval('.toolbar-item__alignment', button => button.click());

		await page.waitForSelector(
			'.components-popover__content .maxi-alignment-control__no-label'
		);
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
	it('Check Responsive alignment control', async () => {
		const accordionPanel = await openSidebar(page, 'alignment');
		const responsiveButton = await page.$$(
			'.maxi-responsive-selector button'
		);

		const alignmentSelector = await accordionPanel.$$(
			'.maxi-accordion-control__item__panel .maxi-alignment-control .maxi-radio-control__option'
		);

		await page.$eval(
			'.edit-post-header .edit-post-header__toolbar .maxi-toolbar-layout button',
			button => button.click()
		);

		// responsive S
		await responsiveButton[5].click();
		await alignmentSelector[1].click();

		const responsiveResult = 'center';
		const responsiveAttributes = await getBlockAttributes();
		const responsiveStyle = responsiveAttributes['text-alignment-s'];

		expect(responsiveStyle).toStrictEqual(responsiveResult);

		// responsive XS
		await responsiveButton[6].click();

		const responsiveXsResult = 'center';
		const responsiveXsAttributes = await getBlockAttributes();
		const responsiveXsStyle = responsiveXsAttributes['text-alignment-s'];

		expect(responsiveXsStyle).toStrictEqual(responsiveXsResult);

		// responsive M
		await responsiveButton[4].click();
		await alignmentSelector[3].click();

		const responsiveMResult = 'justify';
		const responsiveMAttributes = await getBlockAttributes();
		const responsiveMStyle = responsiveMAttributes['text-alignment-m'];

		expect(responsiveMStyle).toStrictEqual(responsiveMResult);
	});
});
