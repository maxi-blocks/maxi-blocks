/**
 * WordPress dependencies
 */
import { expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import {
	addCustomCSS,
	changeResponsive,
	editAxisControl,
	getAttributes,
	getBlockStyle,
	getEditedPostContent,
	insertMaxiBlock,
	openSidebarTab,
	test,
	updateAllBlockUniqueIds,
} from '../../utils';

test.describe('Column Maxi', () => {
	test('Column Maxi does not break', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Container Maxi');

		await page.locator('.maxi-row-block__template button').first().click();

		await page.locator('.maxi-column-block').first().waitFor();

		await updateAllBlockUniqueIds(page);

		await expect(await getEditedPostContent(page, editor)).toMatchSnapshot(
			'column-maxi-does-not-break__content.html'
		);
	});

	test('Check column settings', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Container Maxi');

		await page.locator('.maxi-row-block__template button').first().click();

		await page.locator('.maxi-column-block').first().waitFor();

		await updateAllBlockUniqueIds(page);

		const columnClientId = await page
			.locator('.maxi-column-block')
			.first()
			.getAttribute('data-block');

		// Select the column block
		await page
			.locator(`.maxi-column-block[data-block="${columnClientId}"]`)
			.click();

		await openSidebarTab(page, 'style', 'column settings');

		const columnSizeInput = page.locator(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value'
		);

		await columnSizeInput.fill('50');

		await page.waitForTimeout(300);
		expect(await getAttributes(page, 'column-size-general')).toStrictEqual(
			50
		);

		const selector = page.locator(
			'.maxi-accordion-control__item__panel .maxi-base-control__field select'
		);
		await selector.selectOption('center');

		await page.waitForTimeout(300);
		expect(
			await getAttributes(page, 'justify-content-general')
		).toStrictEqual('center');

		// responsive S
		await changeResponsive(page, 's');
		const columnSizeInputValue = await page
			.locator(
				'.maxi-advanced-number-control .maxi-advanced-number-control__value'
			)
			.inputValue();

		expect(columnSizeInputValue).toStrictEqual('100');

		await page
			.locator(
				'.maxi-advanced-number-control .maxi-advanced-number-control__value'
			)
			.fill('9');

		const responsiveSOption = await page
			.locator(
				'.maxi-advanced-number-control .maxi-advanced-number-control__value'
			)
			.inputValue();

		expect(responsiveSOption).toStrictEqual('9');

		await page.waitForTimeout(300);
		expect(await getAttributes(page, 'column-size-s')).toStrictEqual(9);

		// responsive xs
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page
			.locator(
				'.maxi-advanced-number-control .maxi-advanced-number-control__value'
			)
			.inputValue();

		expect(responsiveXsOption).toStrictEqual('9');

		// responsive m
		await changeResponsive(page, 'm');

		const responsiveMOption = await page
			.locator(
				'.maxi-advanced-number-control .maxi-advanced-number-control__value'
			)
			.inputValue();

		expect(responsiveMOption).toStrictEqual('100');

		await expect(await getBlockStyle(page)).toMatchSnapshot(
			'column-maxi-check-column-settings__style.css'
		);
	});

	test('Check column Border', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Container Maxi');

		const templateButtons = page.locator(
			'.maxi-row-block__template button'
		);
		await templateButtons.nth(6).click();

		await page.locator('.maxi-column-block').first().waitFor();

		await updateAllBlockUniqueIds(page);

		// Ensure we select the third Column (index 2)
		await page
			.locator('.maxi-container-block .maxi-column-block')
			.nth(2)
			.click();

		const borderAccordion = await openSidebarTab(page, 'style', 'border');

		const axisControlInstance = borderAccordion.locator(
			'.maxi-axis-control__border'
		);

		await editAxisControl({
			page,
			instance: axisControlInstance,
			syncOption: 'none',
			values: ['16', '15', '24', '25'],
			unit: '%',
		});

		await page.waitForTimeout(300);
		const expectBorder = {
			'border-bottom-left-radius-general': 25,
			'border-bottom-right-radius-general': 24,
			'border-top-left-radius-general': 16,
			'border-top-right-radius-general': 15,
		};
		const borderResult = await getAttributes(page, [
			'border-bottom-left-radius-general',
			'border-bottom-right-radius-general',
			'border-top-left-radius-general',
			'border-top-right-radius-general',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		// check hover border
		await borderAccordion
			.locator('.maxi-settingstab-control .maxi-tabs-control button')
			.nth(1)
			.click();

		await borderAccordion
			.locator(
				'.maxi-border-status-hover .maxi-toggle-switch__toggle input'
			)
			.click();

		const axisControlHoverInstance = borderAccordion.locator(
			'.maxi-axis-control__border'
		);

		await editAxisControl({
			page,
			instance: axisControlHoverInstance,
			syncOption: 'none',
			values: ['33', '25', '55', '12'],
			unit: '%',
		});

		await page.waitForTimeout(300);
		const expectHoverBorder = {
			'border-bottom-left-radius-general-hover': 12,
			'border-bottom-right-radius-general-hover': 55,
			'border-top-left-radius-general-hover': 33,
			'border-top-right-radius-general-hover': 25,
		};
		const borderHoverResult = await getAttributes(page, [
			'border-bottom-left-radius-general-hover',
			'border-bottom-right-radius-general-hover',
			'border-top-left-radius-general-hover',
			'border-top-right-radius-general-hover',
		]);
		expect(borderHoverResult).toStrictEqual(expectHoverBorder);

		// check first column
		await page.locator('.maxi-column-block').first().waitFor();

		await page
			.locator('.maxi-container-block .maxi-column-block')
			.nth(0)
			.click();

		await expect(await getBlockStyle(page)).toMatchSnapshot(
			'column-maxi-check-column-border-first__style.css'
		);

		// check last column
		await page
			.locator('.maxi-container-block .maxi-column-block')
			.nth(2)
			.click();

		await expect(await getBlockStyle(page)).toMatchSnapshot(
			'column-maxi-check-column-border-last__style.css'
		);
	});

	test('Column Maxi Custom CSS', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Container Maxi');

		await page.locator('.maxi-row-block__template button').first().click();

		await page.locator('.maxi-column-block').first().waitFor();

		await updateAllBlockUniqueIds(page);

		await expect(await addCustomCSS(page)).toMatchSnapshot(
			'column-maxi-custom-css__style.css'
		);
	});
});
