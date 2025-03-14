/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getAttributes,
	getBlockAttributes,
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('AlignmentControl', () => {
	it('Return correct values on general responsive stage', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi', { delay: 350 });

		await openSidebarTab(page, 'style', 'alignment');

		const alignmentSettings = await page.$$(
			'.maxi-alignment-control button'
		);

		const alignments = ['center', 'right', 'justify', 'left'];
		for (let i = 0; i < alignmentSettings.length; i += 1) {
			const setting = alignmentSettings[i !== 3 ? i + 1 : 0];

			await setting.click();

			const attributes = await getBlockAttributes();
			const attribute = attributes['text-alignment-xl'];
			expect(attribute).toStrictEqual(alignments[i]);
		}
	});

	it('Check Responsive text-alignment control', async () => {
		const accordionPanel = await openSidebarTab(page, 'style', 'alignment');

		const isItemChecked = await page.$$eval(
			'.maxi-alignment-control button',
			select => select[0].ariaPressed
		);

		expect(isItemChecked).toBe('true');

		// responsive S
		await changeResponsive(page, 's');
		await accordionPanel.$eval(
			'.maxi-alignment-control .maxi-tabs-control__button-center',
			button => button.click()
		);

		const responsiveSOption = await page.$$eval(
			'.maxi-alignment-control button',
			select => select[1].ariaPressed
		);

		expect(responsiveSOption).toBe('true');

		expect(await getAttributes('text-alignment-s')).toStrictEqual('center');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$$eval(
			'.maxi-alignment-control button',
			select => select[1].ariaPressed
		);

		expect(responsiveXsOption).toBe('true');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$$eval(
			'.maxi-alignment-control button',
			select => select[0].ariaPressed
		);

		expect(responsiveMOption).toBe('true');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Responsive alignment control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);
		const accordionPanel = await openSidebarTab(page, 'style', 'alignment');

		await accordionPanel.$eval(
			'.maxi-alignment-control .maxi-tabs-control__button-center',
			button => button.click()
		);

		const isItemChecked = await page.$$eval(
			'.maxi-alignment-control button',
			select => select[1].ariaPressed
		);

		expect(isItemChecked).toBe('true');

		// responsive S
		await changeResponsive(page, 's');
		await accordionPanel.$eval(
			'.maxi-alignment-control .maxi-tabs-control__button-right',
			button => button.click()
		);

		const responsiveSOption = await page.$$eval(
			'.maxi-alignment-control button',
			select => select[2].ariaPressed
		);

		expect(responsiveSOption).toBe('true');

		expect(await getAttributes('alignment-s')).toStrictEqual('right');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$$eval(
			'.maxi-alignment-control button',
			select => select[2].ariaPressed
		);

		expect(responsiveXsOption).toBe('true');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$$eval(
			'.maxi-alignment-control button',
			select => select[1].ariaPressed
		);

		expect(responsiveMOption).toBe('true');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
