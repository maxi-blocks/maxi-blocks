/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openAdvancedSidebar,
	changeResponsive,
	openSidebar,
} from '../../utils';

describe('FancyRadioControl', () => {
	it('Checking the fancy radio control', async () => {
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
	it('Checking responsive fancy radio control', async () => {
		it('Check Responsive font-size', async () => {
			await insertBlock('Container Maxi');
			await page.$eval('.maxi-container-block', container =>
				container.focus()
			);
			const accordionPanel = await openSidebar(page, 'width height');

			const input = await accordionPanel.$$(
				'.maxi-full-size-control .maxi-advanced-number-control input'
			);

			await input[0].focus();
			await page.waitForTimeout(100);
			await page.keyboard.type('865');

			const heightValue = await accordionPanel.$$eval(
				'.maxi-full-size-control .maxi-advanced-number-control input',
				sizeInput => sizeInput[0].value
			);
			expect(heightValue).toStrictEqual('856');

			// s
			await changeResponsive(page, 's');

			const inputS = await accordionPanel.$$(
				'.maxi-full-size-control .maxi-advanced-number-control input'
			);

			await page.waitForTimeout(100);
			await inputS[0].focus();
			await page.waitForTimeout(100);
			await pressKeyTimes('Backspace', '3');
			await page.keyboard.type('252');

			const sizeSNumber = await accordionPanel.$$eval(
				'.maxi-full-size-control .maxi-advanced-number-control input',
				sizeInput => sizeInput[0].value
			);
			expect(sizeSNumber).toStrictEqual('252');

			const attributes = await getBlockAttributes();
			const size = attributes['container-height-s'];

			expect(size).toStrictEqual(252);

			// xs
			await changeResponsive(page, 'xs');

			const sizeXsNumber = await accordionPanel.$$eval(
				'.maxi-full-size-control .maxi-advanced-number-control input',
				sizeInput => sizeInput[0].value
			);
			expect(sizeXsNumber).toStrictEqual('252');

			// m
			await changeResponsive(page, 'm');

			const sizeMNumber = await accordionPanel.$$eval(
				'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
				sizeInput => sizeInput[0].value
			);
			expect(sizeMNumber).toStrictEqual('856');
		});
	});
});
