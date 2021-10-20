/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebar,
	changeResponsive,
	getBlockStyle,
} from '../../utils';

describe('AlignmentControl', () => {
	it('Return correct values on general responsive stage', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		await openSidebar(page, 'alignment');

		const alignmentSettings = await page.$$(
			'.maxi-alignment-control label'
		);

		const alignments = ['center', 'right', 'justify', 'left'];
		for (let i = 0; i < alignmentSettings.length; i++) {
			const setting = alignmentSettings[i !== 3 ? i + 1 : 0];

			await setting.click();

			const attributes = await getBlockAttributes();
			const attribute = attributes['text-alignment-general'];
			expect(attribute).toStrictEqual(alignments[i]);
		}
	});

	it('Check Responsive text-alignment control', async () => {
		const accordionPanel = await openSidebar(page, 'alignment');

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

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Responsive alignment control', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		const accordionPanel = await openSidebar(page, 'alignment');

		await accordionPanel.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			button => button[1].click()
		);

		const isItemChecked = await page.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(isItemChecked).toBeTruthy();

		// responsive S
		await changeResponsive(page, 's');
		await accordionPanel.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			button => button[2].click()
		);

		const responsiveSOption = await page.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			select => select[2].checked
		);

		expect(responsiveSOption).toBeTruthy();

		const expectAttributes = await getBlockAttributes();
		const position = expectAttributes['alignment-s'];

		expect(position).toStrictEqual('right');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			select => select[2].checked
		);

		expect(responsiveXsOption).toBeTruthy();

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$$eval(
			'.maxi-alignment-control .maxi-base-control__field .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(responsiveMOption).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
