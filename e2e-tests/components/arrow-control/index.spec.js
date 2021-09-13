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

describe('ArrowControl', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
	});

	it('Check the arrow control', async () => {
		const accordionPanel = await openSidebar(page, 'arrow');

		await accordionPanel.$$eval(
			'.maxi-accordion-control__item__panel .maxi-arrow-control .maxi-radio-control__option label',
			button => button[0].click()
		);

		const values = ['top', 'bottom', 'right', 'left'];

		/* eslint-disable no-await-in-loop */
		for (let i = 0; i < values.length; i += 1) {
			const positionButtons = await page.$$(
				'.maxi-arrow-control .maxi-fancy-radio-control'
			);

			await positionButtons[1].$$eval(
				'.maxi-radio-control__option label',
				(buttons, i) => buttons[i].click(),
				i
			);

			const attributes = await getBlockAttributes();
			const arrowAttribute = attributes['arrow-side-general'];
			expect(arrowAttribute).toStrictEqual(values[i]);
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

		const warningBox = await page.$eval(
			'.maxi-arrow-control .maxi-warning-box',
			warning => warning.innerHTML
		);
		await page.waitForTimeout(500);
		expect(warningBox).toMatchSnapshot();
	});

	it('Check the responsive arrow control', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebar(page, 'arrow');

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-fancy-radio-control .maxi-radio-control__option label',
			openArrowControl => openArrowControl[0].click()
		);

		const isItemChecked = await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-radio-control input',
			select => select[3].checked
		);

		expect(isItemChecked).toBeTruthy();

		// responsive S
		await changeResponsive(page, 's');

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-radio-control input',
			select => select[4].click()
		);

		await page.waitForTimeout(100);
		const responsiveSOption = await page.$$eval(
			'.maxi-arrow-control .maxi-radio-control .maxi-radio-control__option input',
			select => select[4].checked
		);

		expect(responsiveSOption).toBeTruthy();
		const expectAttributes = await getBlockAttributes();
		const position = expectAttributes['arrow-side-s'];

		expect(position).toStrictEqual('right');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$$eval(
			'.maxi-arrow-control .maxi-radio-control .maxi-radio-control__option input',
			select => select[4].checked
		);

		expect(responsiveXsOption).toBeTruthy();

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$$eval(
			'.maxi-arrow-control .maxi-radio-control input',
			select => select[3].checked
		);

		expect(responsiveMOption).toBeTruthy();
	});
});
