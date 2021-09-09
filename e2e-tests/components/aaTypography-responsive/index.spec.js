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
import { getBlockAttributes, changeResponsive, openSidebar } from '../../utils';

describe('OpacityControl', () => {
	it('Check Responsive palette-opacity', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const input = await accordionPanel.$(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input'
		);

		await input.focus();
		await page.waitForTimeout(100);
		await page.keyboard.type('80');
		await changeResponsive(page, 's');
		const opacityLevel = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			button => button.value
		);

		expect(opacityLevel).toStrictEqual('80');

		// responsive S
		await page.waitForTimeout(100);
		await changeResponsive(page, 's');

		await input.focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('55', { delay: 100 });

		const responsiveSOption = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveSOption).toStrictEqual('55');

		const attributes = await getBlockAttributes();
		const opacity = attributes['palette-opacity-s'];

		expect(opacity).toStrictEqual(55);

		// responsive XS
		await page.waitForTimeout(100);
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveXsOption).toStrictEqual('55');

		// responsive M
		await page.waitForTimeout(100);
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveMOption).toStrictEqual('80');
	});

	it('Check Responsive font-size', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const input = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input'
		);

		await input[0].focus();
		await page.waitForTimeout(100);
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('9');

		const sizeNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
			sizeInput => sizeInput[0].value
		);
		expect(sizeNumber).toStrictEqual('19');

		// s
		await changeResponsive(page, 's');

		const inputS = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input'
		);

		await page.waitForTimeout(100);
		await inputS[0].focus();
		await page.waitForTimeout(100);
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('1');

		const sizeSNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
			sizeInput => sizeInput[0].value
		);
		expect(sizeSNumber).toStrictEqual('11');

		const attributes = await getBlockAttributes();
		const size = attributes['font-size-s'];

		expect(size).toStrictEqual(11);

		// xs
		await changeResponsive(page, 'xs');

		const sizeXsNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
			sizeInput => sizeInput[0].value
		);
		expect(sizeXsNumber).toStrictEqual('11');

		// m
		await changeResponsive(page, 'm');

		const sizeMNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
			sizeInput => sizeInput[0].value
		);
		expect(sizeMNumber).toStrictEqual('19');
	});
	it('Check Responsive line-height', async () => {
		// await changeResponsive(page, 'general');
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const input = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input'
		);

		await input[0].focus();
		await page.waitForTimeout(100);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('555');

		const heightNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);
		expect(heightNumber).toStrictEqual('1.555');
		// s
		await changeResponsive(page, 's');

		const inputS = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input'
		);

		await page.waitForTimeout(100);
		await inputS[0].focus();
		await page.waitForTimeout(100);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('323');

		const heightSNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);
		expect(heightSNumber).toStrictEqual('1.323');

		const attributes = await getBlockAttributes();
		const height = attributes['line-height-s'];

		expect(height).toStrictEqual(1.323);

		// xs
		await changeResponsive(page, 'xs');

		const heightXsNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);
		expect(heightXsNumber).toStrictEqual('1.323');

		// m
		await changeResponsive(page, 'm');

		const heightMNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);
		expect(heightMNumber).toStrictEqual('1.555');
	});

	it('Check Responsive letter-spacing', async () => {
		// await changeResponsive(page, 'general');
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const input = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input'
		);

		await input[0].focus();
		await page.waitForTimeout(100);
		await page.keyboard.type('2');

		const heightNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input',
			heightInput => heightInput[0].value
		);
		expect(heightNumber).toStrictEqual('2');
		// s
		await changeResponsive(page, 's');

		const inputS = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input'
		);

		await page.waitForTimeout(100);
		await inputS[0].focus();
		await page.waitForTimeout(100);
		await page.keyboard.type('3');

		const heightSNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input',
			heightInput => heightInput[0].value
		);
		expect(heightSNumber).toStrictEqual('23');

		const attributes = await getBlockAttributes();
		const height = attributes['letter-spacing-s'];

		expect(height).toStrictEqual(23);

		// xs
		await changeResponsive(page, 'xs');

		const heightXsNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input',
			heightInput => heightInput[0].value
		);
		expect(heightXsNumber).toStrictEqual('23');

		// m
		await changeResponsive(page, 'm');

		const heightMNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input',
			heightInput => heightInput[0].value
		);
		expect(heightMNumber).toStrictEqual('2');
	});

	it('Check Responsive font-family', async () => {
		// await changeResponsive(page, 'general');
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');
		const closeAccordion = await page.$$(
			'.interface-interface-skeleton__sidebar .edit-post-sidebar__panel-tabs button'
		);
		const input = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family input'
		);
		await input.focus();
		await page.keyboard.type('Lato');
		await page.keyboard.press('Enter');

		const typographyInput = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family input'
		);

		expect(typographyInput).toStrictEqual('Lato');

		// s
		await closeAccordion[2].click();
		await changeResponsive(page, 's');
		await openSidebar(page, 'typography');

		await input.focus();
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('Arial');
		await page.keyboard.press('Enter');

		const typographyInputS = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family input'
		);

		expect(typographyInputS).toStrictEqual('Arial');

		const attributes = await getBlockAttributes();
		const height = attributes['font-family-s'];

		expect(height).toStrictEqual('Arial');

		// xs
		await closeAccordion[2].click();
		await changeResponsive(page, 'xs');
		await openSidebar(page, 'typography');

		const typographyInputXs = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family input'
		);

		expect(typographyInputXs).toStrictEqual('Arial');

		// m
		await closeAccordion[2].click();
		await changeResponsive(page, 'm');
		await openSidebar(page, 'typography');

		const typographyInputM = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family input'
		);

		expect(typographyInputM).toStrictEqual('Lato');
	});
	/* it.only('Check Responsive font-size-unit', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size select'
		);
		await selector.select('em');
		await page.waitForTimeout(100);

		const sizeNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size select',
			sizeInput => sizeInput.value
		);
		expect(sizeNumber).toStrictEqual('em');
	}); 

	it.only('Check Responsive font-size-unit', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__weight select'
		);
		await selector.select('100');
		await page.waitForTimeout(100);

		const sizeNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size select',
			sizeInput => sizeInput.value
		);
		expect(sizeNumber).toStrictEqual('100');
	}); */

	/* it('Check Responsive color', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-color-palette--light .maxi-sc-color-palette__custom .maxi-radio-control__option label',
			select => select[0].click()
		);

		await page.$eval(
			'.maxi-typography-control .maxi-typography-control__color .maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		expect(heightMNumber).toStrictEqual('1.555');
<<<<<<< Updated upstream
	});

	it.only('Check Responsive palette-color-status', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const customColor = await accordionPanel.$$(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option label'
		);

		// general
		await customColor[0].click();
		const customColorCheck = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(customColorCheck).toStrictEqual(false); // revise

		// s
		debugger;
		await changeResponsive(page, 's');
		await page.waitForTimeout(100);
		await customColor[1].click();
		await page.waitForTimeout(100);
		const customSColorCheck = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(customSColorCheck).toBeTruthy();

		/* const attributes = await getBlockAttributes();
		const color = attributes['palette-color-status-s'];

		expect(color).toStrictEqual(true); */

		// xs
		await changeResponsive(page, 'xs');
		const customXsColorCheck = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(customXsColorCheck).toBeTruthy();

		// m
		await changeResponsive(page, 'm');
		const customMColorCheck = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(customMColorCheck).toStrictEqual(false); // revise
	});
=======
	}); */
>>>>>>> Stashed changes
});
