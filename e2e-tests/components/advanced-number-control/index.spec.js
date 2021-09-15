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

describe('Advanced Number Control', () => {
	it('Checking the advanced number control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		// Max value
		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
			select => select.focus()
		);
		await page.keyboard.type('31');

		const maxAttributes = await getBlockAttributes();
		const maxAttribute = maxAttributes['letter-spacing-m'];
		const expectMaxNum = 30;

		expect(maxAttribute).toStrictEqual(expectMaxNum);

		// Min value
		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('-4');

		const minAttributes = await getBlockAttributes();
		const minAttribute = minAttributes['letter-spacing-m'];
		const expectMinNum = -3;

		expect(minAttribute).toStrictEqual(expectMinNum);

		// reset value
		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('10');

		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .components-maxi-control__reset-button',
			click => click.click()
		);

		const resetAttributes = await getBlockAttributes();
		const resetAttribute = resetAttributes['letter-spacing-m'];
		const expectAuto = '';

		expect(resetAttribute).toStrictEqual(expectAuto);
	});
	it('Checking responsive ColumnSize', async () => {
		await insertBlock('Container Maxi');
		await page.$$eval('.maxi-row-block__template button', buttons =>
			buttons[1].click()
		);
		await page.$$eval(
			'.maxi-row-block__container .maxi-column-block',
			column => column[0].focus()
		);

		const accordionPanel = await openSidebar(page, 'column settings');

		const widthValue = await accordionPanel.$$eval(
			'.maxi-advanced-number-control .maxi-base-control__field input',
			widthInput => widthInput[0].value
		);

		expect(widthValue).toStrictEqual('48.75');

		// s
		await changeResponsive(page, 's');
		const inputS = await accordionPanel.$$(
			'.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await inputS[0].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('8');

		const widthValueS = await accordionPanel.$$eval(
			'.maxi-advanced-number-control .maxi-base-control__field input',
			widthInput => widthInput[0].value
		);
		expect(widthValueS).toStrictEqual('18');

		const attributes = await getBlockAttributes();
		const width = attributes['column-size-s'];

		expect(width).toStrictEqual(18);

		// xs
		await changeResponsive(page, 'xs');

		const widthValueXs = await accordionPanel.$$eval(
			'.maxi-advanced-number-control .maxi-base-control__field input',
			widthInput => widthInput[0].value
		);
		expect(widthValueXs).toStrictEqual('18');

		// m
		await changeResponsive(page, 'm');

		const widthValueM = await accordionPanel.$$eval(
			'.maxi-advanced-number-control .maxi-base-control__field input',
			widthInput => widthInput[0].value
		);
		expect(widthValueM).toStrictEqual('100');
	});
});
