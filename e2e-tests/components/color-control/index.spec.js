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
		const dataItem = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-color-palette-control__palette-label .maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);

		await changeResponsive(page, 's');
		await page.$eval('.maxi-text-block', block => block.focus());

		const backgroundColor = await dataItem;
		expect(backgroundColor).toStrictEqual('3');

		// responsive S
		await changeResponsive(page, 's');
		await openSidebar(page, 'typography');

		await page.$$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-color-palette-control__palette-label .maxi-sc-color-palette div',
			select => select[4].click()
		);
		const dataItemS = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-color-palette-control__palette-label .maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);
		const responsiveSOption = await dataItemS;

		expect(responsiveSOption).toStrictEqual('5');

		const attributes = await getBlockAttributes();
		const color = attributes['palette-color-s'];
		const expectColor = 5;

		expect(color).toStrictEqual(expectColor);

		// responsive XS
		await changeResponsive(page, 'xs');

		const dataItemXs = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-color-palette-control__palette-label .maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);
		const responsiveXsOption = await dataItemXs;

		expect(responsiveXsOption).toStrictEqual('5');

		// responsive M
		await changeResponsive(page, 'm');

		const dataItemM = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-color-palette-control__palette-label .maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);
		const responsiveMOption = await dataItemM;

		expect(responsiveMOption).toStrictEqual('3');
	});
});
