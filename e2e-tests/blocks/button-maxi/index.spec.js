/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

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
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Button Maxi', () => {
	it('Button Maxi does not break', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');

		await updateAllBlockUniqueIds(page);

		await page.keyboard.type('Hello', { delay: 350 });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Button Presets Test', async () => {
		await openSidebarTab(page, 'style', 'quick styles');

		const buttons = await page.$$('.maxi-button-default-styles button');

		for (let i = 0; i < buttons.length; i += 1) {
			await page.$$eval(
				'.maxi-button-default-styles button',
				(buttons, i) => buttons[i].click(),
				i
			);

			await page.waitForTimeout(500);

			expect(await getEditedPostContent(page)).toMatchSnapshot();
			expect(await getBlockStyle(page)).toMatchSnapshot();

			await page.waitForTimeout(500);
		}

		// Need to end the test
		expect(true).toBeTruthy();
	});

	it('Check Button Icon', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');

		await updateAllBlockUniqueIds(page);

		await page.keyboard.type('Hello', { delay: 350 });
		await page.waitForTimeout(150);

		const quickStylesAccordion = await openSidebarTab(
			page,
			'style',
			'quick styles'
		);

		await quickStylesAccordion.waitForSelector(
			'	.maxi-button-default-styles button[aria-label="Button shortcut 5"]'
		);
		await quickStylesAccordion.$eval(
			'.maxi-button-default-styles button[aria-label="Button shortcut 5"]',
			buttons => buttons.click()
		);

		const iconAccordion = await openSidebarTab(page, 'style', 'icon');

		// Icon Width
		await editAdvancedNumberControl({
			page,
			instance: await iconAccordion.$('.maxi-icon-control__width'),
			newNumber: '343',
		});

		//  stroke Width
		await editAdvancedNumberControl({
			page,
			instance: await iconAccordion.$('.maxi-icon-control__stroke-width'),
			newNumber: '2',
		});

		// spacing
		await editAdvancedNumberControl({
			page,
			instance: await iconAccordion.$('.maxi-icon-control__spacing'),
			newNumber: '20',
		});

		// icon position
		await page.$eval(
			'.maxi-icon-control__position button.maxi-tabs-control__button-bottom',
			bottomButton => bottomButton.click()
		);

		const attributes = await getAttributes([
			'icon-width-xl',
			'icon-stroke-xl',
			'icon-spacing-xl',
			'icon-position',
		]);

		const expectedAttributesTwo = {
			'icon-width-xl': '343',
			'icon-stroke-xl': 2,
			'icon-spacing-xl': 20,
			'icon-position': 'bottom',
		};

		expect(attributes).toStrictEqual(expectedAttributesTwo);

		// icon color
		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-color-palette-control.maxi-icon-styles-control--color'
			),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(await getAttributes('icon-stroke-palette-color')).toStrictEqual(
			5
		);

		// Icon inherit color
		await page.$eval('button.maxi-tabs-control__button-border', button =>
			button.click()
		);

		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-border-control .maxi-color-palette-control'
			),
			paletteStatus: true,
			colorPalette: 6,
		});

		expect(
			await getAttributes('icon-border-palette-color-xl')
		).toStrictEqual(6);

		// border
		await page.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[2].click()
		);

		expect(await getAttributes('icon-border-style-xl')).toStrictEqual(
			'dashed'
		);

		// border color
		await editColorControl({
			page,
			instance: await page.$('.maxi-border-control'),
			paletteStatus: true,
			colorPalette: 4,
		});

		expect(
			await getAttributes('icon-border-palette-color-xl')
		).toStrictEqual(4);

		// border width
		await page.$$eval(
			'.maxi-axis-control__content__item__border-width input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('59', { delay: 350 });

		expect(
			await getAttributes('icon-border-bottom-width-xl')
		).toStrictEqual(59);

		// check border radius
		await page.$$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('26', { delay: 350 });

		expect(
			await getAttributes('icon-border-bottom-right-radius-xl')
		).toStrictEqual(26);

		// icon padding
		await page.$$eval(
			'.maxi-axis-control__content__item__icon-padding input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('33', { delay: 350 });

		expect(await getAttributes('icon-padding-bottom-xl')).toStrictEqual(
			'33'
		);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Button Icon Hover', async () => {
		const accordion = await openSidebarTab(page, 'style', 'icon');

		await accordion.$$eval(
			'.maxi-settingstab-control .maxi-tabs-control button',
			button => button[1].click()
		);
		await page.waitForTimeout(150);

		// Width spacing
		await page.$$eval(
			'.maxi-icon-control .maxi-advanced-number-control input',
			select => select[0].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('245', { delay: 350 });

		//  stroke Width
		await page.$$eval(
			'.maxi-icon-control .maxi-advanced-number-control input',
			select => select[2].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('4', { delay: 350 });

		expect(await getAttributes('icon-stroke-xl-hover')).toStrictEqual(4);
		expect(await getAttributes('icon-width-xl-hover')).toStrictEqual('245');

		// select border
		await page.$eval('button.maxi-tabs-control__button-border', button =>
			button.click()
		);

		await page.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[3].click()
		);

		expect(await getAttributes('icon-border-style-xl-hover')).toStrictEqual(
			'dotted'
		);

		// border color
		await editColorControl({
			page,
			instance: await page.$('.maxi-border-control'),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(
			await getAttributes('icon-border-palette-color-xl-hover')
		).toStrictEqual(5);

		// border width
		await page.$$eval(
			'.maxi-axis-control__content__item__border-width input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('70', { delay: 350 });

		expect(
			await getAttributes('icon-border-bottom-width-xl-hover')
		).toStrictEqual(70);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Button Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
