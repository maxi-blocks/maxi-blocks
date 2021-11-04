/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, changeResponsive } from '../../../../utils';

describe('AlignmentControl', () => {
	it('Checking alignment in toolbar', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		await page.waitForSelector('.toolbar-wrapper .toolbar-item__alignment');
		await page.$eval('.toolbar-wrapper .toolbar-item__alignment', button =>
			button.click()
		);

		await page.waitForSelector(
			'.components-popover__content .maxi-alignment-control__no-label'
		);
		await page.waitForTimeout(150);
		const alignmentSettings = await page.$$(
			'.components-popover__content .maxi-alignment-control__no-label button'
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

	it('Checking alignment in toolbar responsive', async () => {
		// check general
		const expectAttributes = await getBlockAttributes();
		const position = expectAttributes['text-alignment-general'];

		expect(position).toStrictEqual('left');

		// responsive s
		await changeResponsive(page, 's');

		await page.$$eval(
			'.components-popover__content .maxi-alignment-control__no-label button',
			button => button[1].click()
		);

		const expectSAttributes = await getBlockAttributes();
		const positionS = expectSAttributes['text-alignment-s'];

		expect(positionS).toStrictEqual('center');

		// responsive xs
		await changeResponsive(page, 'xs');

		const selected = await page.$$eval(
			'.components-popover__content .maxi-alignment-control__no-label button',
			button => button[1].ariaPressed
		);

		expect(selected).toBe('true');

		// responsive m
		await changeResponsive(page, 'm');
		const selectedM = await page.$$eval(
			'.components-popover__content .maxi-alignment-control__no-label button',
			button => button[0].ariaPressed
		);

		expect(selectedM).toBe('true');
	});
});
