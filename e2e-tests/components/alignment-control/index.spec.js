/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar, changeResponsive } from '../../utils';

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
		await changeResponsive(page, 's');

		const isItemChecked = await page.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(isItemChecked).toBeTruthy();

		// responsive S
		await changeResponsive(page, 's');
		await accordionPanel.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			button => button[1].click()
		);

		const responsiveSOption = await page.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(responsiveSOption).toBeTruthy();

		const expectAttributes = await getBlockAttributes();
		const position = expectAttributes['text-alignment-s'];

		expect(position).toStrictEqual('center');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(responsiveXsOption).toBeTruthy();

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(responsiveMOption).toBeTruthy();
	});
});
