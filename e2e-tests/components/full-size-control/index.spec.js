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
import { getBlockAttributes, openSidebar, changeResponsive } from '../../utils';

describe('FullSizeControl', () => {
	it('Checking the full size control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'width height');

		await accordionPanel.$$eval(
			'.maxi-fancy-radio-control .maxi-base-control__field label',
			click => click[1].click()
		);

		const expectResult = 'full';
		const expectAttributes = await getBlockAttributes();
		const width = expectAttributes.fullWidth;

		expect(width).toStrictEqual(expectResult);
	});

	it('Check Responsive full size control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'width height');

		const inputs = await accordionPanel.$$(
			'.maxi-full-size-control .maxi-advanced-number-control .maxi-advanced-number-control__value'
		);

		await inputs[0].focus();
		await page.keyboard.type('330', { delay: 100 });

		const generalHeight = await accordionPanel.$eval(
			'.maxi-full-size-control .maxi-advanced-number-control .maxi-advanced-number-control__value',
			button => button.value
		);

		expect(generalHeight).toStrictEqual('330');
		await changeResponsive(page, 's');

		// responsive S
		await changeResponsive(page, 's');

		await inputs[0].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('99', { delay: 100 });

		const heightS = await accordionPanel.$eval(
			'.maxi-full-size-control .maxi-advanced-number-control .maxi-advanced-number-control__value',
			button => button.value
		);
		expect(heightS).toStrictEqual('399');

		const attributes = await getBlockAttributes();
		const sHeight = attributes['height-s'];

		expect(sHeight).toStrictEqual(399);

		// responsive XS
		await changeResponsive(page, 'xs');

		const heightXs = await accordionPanel.$eval(
			'.maxi-full-size-control .maxi-advanced-number-control .maxi-advanced-number-control__value',
			button => button.value
		);
		expect(heightXs).toStrictEqual('399');

		// responsive M
		await changeResponsive(page, 'm');

		const heightM = await accordionPanel.$eval(
			'.maxi-full-size-control .maxi-advanced-number-control .maxi-advanced-number-control__value',
			button => button.value
		);
		expect(heightM).toStrictEqual('330');
	});
});
