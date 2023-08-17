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

		await page.keyboard.type('Hello', { delay: 100 });
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

		await page.keyboard.type('Hello', { delay: 100 });
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
			await getAttributes('icon-border-palette-color-general')
		).toStrictEqual(6);

		// border
		await page.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[2].click()
		);

		expect(await getAttributes('icon-border-style-general')).toStrictEqual(
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
			await getAttributes('icon-border-palette-color-general')
		).toStrictEqual(4);

		// border width
		await page.$$eval(
			'.maxi-axis-control__content__item__border-width input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('59');

		expect(
			await getAttributes('icon-border-bottom-width-general')
		).toStrictEqual(59);

		// check border radius
		await page.$$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('26');

		expect(
			await getAttributes('icon-border-bottom-right-radius-general')
		).toStrictEqual(26);

		// icon padding
		await page.$$eval(
			'.maxi-axis-control__content__item__icon-padding input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('33');

		expect(
			await getAttributes('icon-padding-bottom-general')
		).toStrictEqual('33');

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
		await page.keyboard.type('245');

		//  stroke Width
		await page.$$eval(
			'.maxi-icon-control .maxi-advanced-number-control input',
			select => select[2].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('4');

		expect(await getAttributes('icon-stroke-general-hover')).toStrictEqual(
			4
		);
		expect(await getAttributes('icon-width-general-hover')).toStrictEqual(
			'245'
		);

		// select border
		await page.$eval('button.maxi-tabs-control__button-border', button =>
			button.click()
		);

		await page.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[3].click()
		);

		expect(
			await getAttributes('icon-border-style-general-hover')
		).toStrictEqual('dotted');

		// border color
		await editColorControl({
			page,
			instance: await page.$('.maxi-border-control'),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(
			await getAttributes('icon-border-palette-color-general-hover')
		).toStrictEqual(5);

		// border width
		await page.$$eval(
			'.maxi-axis-control__content__item__border-width input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('70');

		expect(
			await getAttributes('icon-border-bottom-width-general-hover')
		).toStrictEqual(70);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Button Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
