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

		const attributes = await getBlockAttributes();
		const heightAttribute = attributes['height-general'];

		expect(heightAttribute).toStrictEqual(330);

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

		const attributesS = await getBlockAttributes();
		const sHeight = attributesS['height-s'];

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
	it('Checking responsive column size', async () => {
		await insertBlock('Container Maxi');
		await page.$$eval('.maxi-row-block__template button', buttons =>
			buttons[1].click()
		);

		const accordionPanel = await openSidebar(page, 'width height');
		const input = await accordionPanel.$$(
			'.maxi-full-size-control .maxi-advanced-number-control input'
		);

		await input[0].focus();
		await page.waitForTimeout(100);
		await page.keyboard.type('652');

		const widthValue = await accordionPanel.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			widthInput => widthInput[0].value
		);
		expect(widthValue).toStrictEqual('652');

		// s
		await changeResponsive(page, 's');

		const inputS = await accordionPanel.$$(
			'.maxi-full-size-control .maxi-advanced-number-control input'
		);

		await inputS[0].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('88');

		const widthValueS = await accordionPanel.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			widthInput => widthInput[0].value
		);
		expect(widthValueS).toStrictEqual('688');

		const attributes = await getBlockAttributes();
		const width = attributes['width-s'];

		expect(width).toStrictEqual(688);

		// xs
		await changeResponsive(page, 'xs');

		const widthValueXs = await accordionPanel.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			widthInput => widthInput[0].value
		);
		expect(widthValueXs).toStrictEqual('688');

		// m
		await changeResponsive(page, 'm');

		const widthValueM = await accordionPanel.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			widthInput => widthInput[0].value
		);
		expect(widthValueM).toStrictEqual('652');
	});
	it('Checking responsive container height', async () => {
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
			heightInput => heightInput[0].value
		);
		expect(heightValue).toStrictEqual('865');

		// s
		await changeResponsive(page, 's');

		const inputS = await accordionPanel.$$(
			'.maxi-full-size-control .maxi-advanced-number-control input'
		);

		await page.waitForTimeout(100);
		await inputS[0].focus();
		await page.waitForTimeout(100);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('85');

		const heightValueS = await accordionPanel.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			heightInput => heightInput[0].value
		);
		expect(heightValueS).toStrictEqual('885');

		const attributes = await getBlockAttributes();
		const height = attributes['container-height-s'];

		expect(height).toStrictEqual(885);

		// xs
		await changeResponsive(page, 'xs');

		const heightValueXs = await accordionPanel.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			heightInput => heightInput[0].value
		);
		expect(heightValueXs).toStrictEqual('885');

		// m
		await changeResponsive(page, 'm');

		const heightValueM = await accordionPanel.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			heightInput => heightInput[0].value
		);
		expect(heightValueM).toStrictEqual('865');
	});
});
