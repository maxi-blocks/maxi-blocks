/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar, changeResponsive } from '../../utils';

describe('ColorControl', () => {
	it('Checking the color control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control label',
			fancyRadioControls => fancyRadioControls[5].click()
		);

		await page.$$eval(
			'.maxi-background-control .maxi-base-control__field .maxi-sc-color-palette div',
			select => select[3].click()
		);

		const attributes = await getBlockAttributes();
		const backgroundColor = attributes['background-palette-color'];
		const expectedResult = 4;

		expect(backgroundColor).toStrictEqual(expectedResult);
	});

	it('Check Responsive color control', async () => {
		debugger;
		const dataItem = await page.$eval(
			'.maxi-background-control .maxi-base-control__field .maxi-sc-color-palette .maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);

		await changeResponsive(page, 's');
		await page.$eval('.maxi-text-block', block => block.focus());

		const backgroundColor = await dataItem;
		expect(backgroundColor).toStrictEqual('4');

		// responsive S
		await changeResponsive(page, 's');
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control label',
			fancyRadioControls => fancyRadioControls[5].click()
		);

		await page.$$eval(
			'.maxi-background-control .maxi-base-control__field .maxi-sc-color-palette div',
			select => select[4].click()
		);

		const responsiveSOption = await dataItem;

		expect(responsiveSOption).toStrictEqual('5');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await dataItem;

		expect(responsiveXsOption).toStrictEqual('5');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await dataItem;

		expect(responsiveMOption).toStrictEqual('4');
	});
});
