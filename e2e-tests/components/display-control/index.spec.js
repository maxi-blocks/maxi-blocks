/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openAdvancedSidebar,
	changeResponsive,
} from '../../utils';

describe('DisplayControl', () => {
	it('Checking the display control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'display');

		await accordionPanel.$$eval(
			'.maxi-display-control .maxi-base-control__field label',
			button => button[2].click()
		);

		const attributes = await getBlockAttributes();
		const display = attributes['display-general'];
		const expectResult = 'none';

		expect(display).toStrictEqual(expectResult);
	});

	it('Check Responsive display control', async () => {
		await openAdvancedSidebar(page, 'display');
		const displayButtons = await page.$$(
			'.maxi-display-control .maxi-fancy-radio-control .maxi-radio-control__option'
		);

		const isItemChecked = await page.$$eval(
			'.maxi-display-control .maxi-fancy-radio-control .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(isItemChecked).toBeTruthy();

		// responsive S
		await changeResponsive(page, 's');
		await displayButtons[0].click();

		const responsiveSOption = await page.$$eval(
			'.maxi-display-control .maxi-fancy-radio-control .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(responsiveSOption).toBeTruthy();

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$$eval(
			'.maxi-display-control .maxi-fancy-radio-control .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(responsiveXsOption).toBeTruthy();

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$$eval(
			'.maxi-display-control .maxi-fancy-radio-control .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(responsiveMOption).toBeTruthy();

		const expectAttributes = await getBlockAttributes();
		const display = expectAttributes['display-general'];

		expect(display).toStrictEqual('none');
	});
});
