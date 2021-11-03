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
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
} from '../../utils';

describe('ArrowControl', () => {
	it('Check the arrow control', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'callout arrow'
		);

		await accordionPanel.$eval(
			'.maxi-arrow-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		const values = ['top', 'bottom', 'right', 'left'];

		for (let i = 0; i < values.length; i++) {
			await page.$$eval(
				'.maxi-arrow-control .maxi-button-group-control button',
				(buttons, i) => buttons[i].click(),
				i
			);
			const attributes = await getBlockAttributes();
			const arrowAttributeX = attributes['arrow-side-general'];
			expect(arrowAttributeX).toStrictEqual(values[i]);
		}

		// Use Position
		const selectInput = await accordionPanel.$$(
			'.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await selectInput[0].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('9');

		const expectPosition = 59;
		const attributes = await getBlockAttributes();
		const arrowAttribute = attributes['arrow-position-general'];
		expect(arrowAttribute).toStrictEqual(expectPosition);

		// Use Arrow Size
		await selectInput[2].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('120');

		const expectSize = 120;
		const sizeAttributes = await getBlockAttributes();
		const arrowSizeAttribute = sizeAttributes['arrow-width-general'];
		expect(arrowSizeAttribute).toStrictEqual(expectSize);
	});

	it('Check the responsive arrow control', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'callout arrow'
		);

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-button-group-control button',
			openArrowControl => openArrowControl[0].click()
		);

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-button-group-control button',
			select => select[3].click()
		);

		const isItemChecked = await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-button-group-control button',
			select => select[3].ariaPressed
		);

		expect(isItemChecked).toBeTruthy();

		// responsive S
		await changeResponsive(page, 's');

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-button-group-control button',
			select => select[2].click()
		);

		await page.waitForTimeout(100);
		const responsiveSOption = await page.$$eval(
			'.maxi-arrow-control .maxi-button-group-control button',
			select => select[2].ariaPressed
		);

		expect(responsiveSOption).toBeTruthy();
		const expectAttributes = await getBlockAttributes();
		const position = expectAttributes['arrow-side-s'];

		expect(position).toStrictEqual('right');

		// responsive XS
		await changeResponsive(page, 'xs');
		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-button-group-control button',
			select => select[3].click()
		);
		await page.waitForTimeout(100);
		const responsiveXsOption = await page.$$eval(
			'.maxi-arrow-control .maxi-button-group-control button',
			select => select[3].ariaPressed
		);

		expect(responsiveXsOption).toBeTruthy();

		// responsive M
		await changeResponsive(page, 'm');

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-button-group-control button',
			select => select[2].click()
		);
		await page.waitForTimeout(100);
		const responsiveMOption = await page.$$eval(
			'.maxi-arrow-control .maxi-button-group-control button',
			select => select[2].ariaPressed
		);

		expect(responsiveMOption).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
