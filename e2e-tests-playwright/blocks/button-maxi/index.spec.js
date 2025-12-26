/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import {
	addCustomCSS,
	editAdvancedNumberControl,
	editColorControl,
	getAttributes,
	getBlockStyle,
	getEditedPostContent,
	insertMaxiBlock,
	openSidebarTab,
	test,
	updateAllBlockUniqueIds,
} from '../../utils';

test.describe('Button Maxi', () => {
	test('Button Maxi does not break', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Button Maxi');

		await updateAllBlockUniqueIds(page);

		await page.keyboard.type('Hello');

		await expect(await getEditedPostContent(page, editor)).toMatchSnapshot(
			'button-maxi__content.html'
		);
		await expect(await getBlockStyle(page)).toMatchSnapshot(
			'button-maxi__style.css'
		);
	});

	test('Button Presets Test', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);

		await openSidebarTab(page, 'style', 'quick styles');

		const buttons = page.locator('.maxi-button-default-styles button');
		const count = await buttons.count();

		for (let i = 0; i < count; i += 1) {
			await buttons.nth(i).click();

			await expect(
				await getEditedPostContent(page, editor)
			).toMatchSnapshot(`button-maxi__preset-${i + 1}__content.html`);
			await expect(await getBlockStyle(page)).toMatchSnapshot(
				`button-maxi__preset-${i + 1}__style.css`
			);
		}
	});

	test('Check Button Icon', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Button Maxi');

		await updateAllBlockUniqueIds(page);

		await page.keyboard.type('Hello');

		await openSidebarTab(page, 'style', 'quick styles');

		const button = await page.locator(
			'.maxi-button-default-styles button[aria-label="Button shortcut 5"]'
		);
		await button.click();

		await openSidebarTab(page, 'style', 'icon');

		// Icon Width
		await editAdvancedNumberControl({
			page,
			instance: page.locator('.maxi-icon-control__width'),
			newNumber: '343',
		});

		// Stroke Width
		await editAdvancedNumberControl({
			page,
			instance: page.locator('.maxi-icon-control__stroke-width'),
			newNumber: '2',
		});

		// Spacing
		await editAdvancedNumberControl({
			page,
			instance: page.locator('.maxi-icon-control__spacing'),
			newNumber: '20',
		});

		// Icon position
		await page
			.locator(
				'.maxi-icon-control__position button.maxi-tabs-control__button-bottom'
			)
			.click();

		const attributes = await getAttributes(page, [
			'icon-width-general',
			'icon-stroke-general',
			'icon-spacing-general',
			'icon-position',
		]);

		const expectedAttributesTwo = {
			'icon-width-general': '343',
			'icon-stroke-general': 2,
			'icon-spacing-general': 20,
			'icon-position': 'bottom',
		};

		expect(attributes).toStrictEqual(expectedAttributesTwo);

		// Icon color
		await editColorControl({
			page,
			instance: page.locator(
				'.maxi-color-palette-control.maxi-icon-styles-control--color'
			),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(
			await getAttributes(page, 'icon-stroke-palette-color')
		).toStrictEqual(5);

		// Icon inherit color / border tab
		await page.locator('button.maxi-tabs-control__button-border').click();

		await editColorControl({
			page,
			instance: page.locator(
				'.maxi-border-control .maxi-color-palette-control'
			),
			paletteStatus: true,
			colorPalette: 6,
		});

		expect(
			await getAttributes(page, 'icon-border-palette-color-general')
		).toStrictEqual(6);

		// Border style
		await page
			.locator('.maxi-border-control .maxi-default-styles-control button')
			.nth(2)
			.click();

		expect(
			await getAttributes(page, 'icon-border-style-general')
		).toStrictEqual('dashed');

		// Border color
		await editColorControl({
			page,
			instance: page.locator('.maxi-border-control'),
			paletteStatus: true,
			colorPalette: 4,
		});

		expect(
			await getAttributes(page, 'icon-border-palette-color-general')
		).toStrictEqual(4);

		// Border width
		const borderWidthInput = page.locator(
			'.maxi-axis-control__content__item__border-width input[type="number"]'
		);
		await borderWidthInput.first().fill('59');
		await page.waitForTimeout(300);

		expect(
			await getAttributes(page, 'icon-border-bottom-width-general')
		).toStrictEqual(59);

		// Border radius
		const borderRadiusInput = page.locator(
			'.maxi-axis-control__content__item__border-radius input[type="number"]'
		);
		await borderRadiusInput.first().fill('26');
		await page.waitForTimeout(300);

		expect(
			await getAttributes(page, 'icon-border-bottom-right-radius-general')
		).toStrictEqual(26);

		// Icon padding
		const iconPaddingInput = page.locator(
			'.maxi-axis-control__content__item__icon-padding input[type="number"]'
		);
		await iconPaddingInput.first().fill('33');
		await page.waitForTimeout(300);

		expect(
			await getAttributes(page, 'icon-padding-bottom-general')
		).toStrictEqual('33');

		await expect(await getEditedPostContent(page, editor)).toMatchSnapshot(
			'button-maxi__icon__content.html'
		);
		await expect(await getBlockStyle(page)).toMatchSnapshot(
			'button-maxi__icon__style.css'
		);
	});

	test('Check Button Icon Hover', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);

		await openSidebarTab(page, 'style', 'quick styles');

		const button = await page.locator(
			'.maxi-button-default-styles button[aria-label="Button shortcut 5"]'
		);
		await button.click();

		const iconAccordion = await openSidebarTab(page, 'style', 'icon');

		await iconAccordion
			.locator('.maxi-settingstab-control .maxi-tabs-control button')
			.nth(1)
			.click();

		// Width
		const hoverInputs = page.locator(
			'.maxi-icon-control .maxi-advanced-number-control input[type="number"]'
		);
		await hoverInputs.nth(0).fill('245');

		// Stroke width
		await hoverInputs.nth(1).fill('4');
		await page.waitForTimeout(300);

		expect(
			await getAttributes(page, 'icon-stroke-general-hover')
		).toStrictEqual(4);
		expect(
			await getAttributes(page, 'icon-width-general-hover')
		).toStrictEqual('245');

		// Border tab
		await page.locator('button.maxi-tabs-control__button-border').click();

		// Border style
		await page
			.locator('.maxi-border-control .maxi-default-styles-control button')
			.nth(3)
			.click();
		await page.waitForTimeout(300);

		expect(
			await getAttributes(page, 'icon-border-style-general-hover')
		).toStrictEqual('dotted');

		// Border color
		await editColorControl({
			page,
			instance: page.locator('.maxi-border-control'),
			paletteStatus: true,
			colorPalette: 5,
		});

		await page.waitForTimeout(300);

		expect(
			await getAttributes(page, 'icon-border-palette-color-general-hover')
		).toStrictEqual(5);

		// Border width
		const borderWidthInput = page.locator(
			'.maxi-axis-control__content__item__border-width input[type="number"]'
		);
		await borderWidthInput.first().fill('70');
		await page.waitForTimeout(300);

		expect(
			await getAttributes(page, 'icon-border-bottom-width-general-hover')
		).toStrictEqual(70);

		await expect(await getEditedPostContent(page, editor)).toMatchSnapshot(
			'button-maxi__icon-hover__content.html'
		);
		await expect(await getBlockStyle(page)).toMatchSnapshot(
			'button-maxi__icon-hover__style.css'
		);
	});

	test('Button Maxi Custom CSS', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);

		await expect(await addCustomCSS(page)).toMatchSnapshot(
			'button-maxi__custom-css__style.css'
		);
	}, 500000);
});
