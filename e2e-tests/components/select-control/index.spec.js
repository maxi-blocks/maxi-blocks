/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('SelectControl', () => {
	it('Check select control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'border');

		const selector = await accordionPanel.$(
			'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select'
		);
		await selector.select('dotted');

		const expectResult = 'dotted';
		const attributes = await getBlockAttributes();
		const style = attributes['border-style-general'];

		expect(style).toStrictEqual(expectResult);
	});

	it('Check Responsive select control', async () => {
		const responsiveButton = await page.$$(
			'.maxi-responsive-selector button'
		);

		// Dotted bottom enabled
		await page.$eval(
			'.edit-post-header .edit-post-header__toolbar .maxi-toolbar-layout button',
			button => button.click()
		);

		await responsiveButton[5].click();
		await page.$eval('.maxi-text-block', block => block.focus());

		const dottedButton = await page.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			button => button[3].innerHTML
		);

		expect(dottedButton).toMatchSnapshot();

		// responsive S
		const accordionPanel = await openSidebar(page, 'border');

		const selector = await accordionPanel.$(
			'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select'
		);
		await selector.select('dashed');

		const responsiveResult = 'dashed';
		const responsiveAttributes = await getBlockAttributes();
		const responsiveStyle = responsiveAttributes['border-style-s'];

		expect(responsiveStyle).toStrictEqual(responsiveResult);

		// responsive XS
		await responsiveButton[6].click();

		const responsiveXsResult = 'dashed';
		const responsiveXsAttributes = await getBlockAttributes();
		const responsiveXsStyle = responsiveXsAttributes['border-style-s'];

		expect(responsiveXsStyle).toStrictEqual(responsiveXsResult);

		// responsive M
		await responsiveButton[4].click();

		const responsiveMResult = 'dotted';
		const responsiveMAttributes = await getBlockAttributes();
		const responsiveMStyle = responsiveMAttributes['border-style-general'];

		expect(responsiveMStyle).toStrictEqual(responsiveMResult);
	});
});
