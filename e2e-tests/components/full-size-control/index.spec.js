/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
	getAttributes,
} from '../../utils';

describe('FullSizeControl', () => {
	it('Checking the full size control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'height width'
		);

		await accordionPanel.$eval(
			'.maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		expect(await getAttributes('blockFullWidth')).toStrictEqual('full');
	});

	it('Check Responsive full size control', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'height width'
		);

		await accordionPanel.$eval(
			'.maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

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

		expect(await getAttributes('height-general')).toStrictEqual(330);

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

		expect(await getAttributes('height-s')).toStrictEqual(399);

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

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Checking fullSizeControl unit selector', async () => {
		await changeResponsive(page, 'base');

		await page.$$eval(
			'.maxi-full-size-control .maxi-toggle-switch input',
			button => button[0].click()
		);

		const selector = await page.$$(
			'.maxi-full-size-control .maxi-dimensions-control__units select'
		);

		for (let i = 0; i < selector.length; i += 1) {
			const selection = selector[i];

			await selection.select('em');
		}

		const expectSize = {
			'max-height-unit-general': 'em',
			'max-width-unit-general': 'em',
			'min-height-unit-general': 'em',
			'min-width-unit-general': 'em',
		};

		const result = await getAttributes([
			'max-height-unit-general',
			'max-width-unit-general',
			'min-height-unit-general',
			'min-width-unit-general',
		]);

		expect(result).toStrictEqual(expectSize);
	});
});
