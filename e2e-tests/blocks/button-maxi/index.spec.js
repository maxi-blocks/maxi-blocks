/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	openSidebarTab,
	getAttributes,
	editColorControl,
	addCustomCSS,
	modalMock,
} from '../../utils';

describe('Button Maxi', () => {
	it('Button Maxi does not break and has default attributes', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		await page.keyboard.type('Hello', { delay: 100 });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Button Style', async () => {
		await openSidebarTab(page, 'style', 'quick styles');

		const buttons = await page.$$('.maxi-button-default-styles button');
		await buttons[4].click();

		await expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Button Icon(line icon)', async () => {
		await openSidebarTab(page, 'style', 'icon');

		// Width spacing
		await page.$$eval(
			'.maxi-tabs-content .maxi-icon-control .maxi-advanced-number-control input',
			select => select[0].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('343');

		//  stroke Width
		await page.$$eval(
			'.maxi-tabs-content .maxi-icon-control .maxi-advanced-number-control input',
			select => select[2].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('2');

		// spacing
		await page.$$eval(
			'.maxi-tabs-content .maxi-icon-control .maxi-advanced-number-control input',
			select => select[4].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('14');

		const attributes = await getAttributes([
			'icon-width-general',
			'icon-stroke-general',
			'icon-spacing-general',
		]);

		const expectedAttributesTwo = {
			'icon-width-general': '343',
			'icon-stroke-general': 2,
			'icon-spacing-general': 14,
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

		await page.$$eval(
			'.maxi-icon-styles-control .maxi-tabs-control__full-width button',
			button => button[1].click()
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

		// icon position
		await page.$eval('.maxi-icon-position-control button', leftButton =>
			leftButton.click()
		);
		expect(await getAttributes('icon-position')).toStrictEqual('left');

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
	});

	it('Check Button Icon Hover', async () => {
		await page.$eval(
			'.maxi-settingstab-control .maxi-tabs-control__button-Hover',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// Width spacing
		await page.$$eval(
			'.maxi-icon-control .maxi-advanced-number-control input',
			select => select[0].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('245');

		expect(await getAttributes('icon-width-general-hover')).toStrictEqual(
			'245'
		);

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

		// select border
		await page.$$eval(
			'.maxi-icon-styles-control .maxi-tabs-control__full-width button',
			button => button[1].click()
		);

		await page.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[3].click()
		);

		expect(
			await getAttributes('icon-border-style-general-hover')
		).toStrictEqual('dotted');

		// select border icon
		await page.$eval(
			'.maxi-icon-control .maxi-icon-styles-control .maxi-tabs-control__button-border',
			button => button.click()
		);

		await page.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[2].click()
		);

		// border color
		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-border-control .maxi-color-palette-control'
			),
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
	});

	it('Check Button inherit', async () => {
		await insertBlock('Button Maxi');

		// Change Typo color
		await openSidebarTab(page, 'style', 'typography');
		await editColorControl({
			page,
			instance: await page.$('.maxi-typography-control__color'),
			paletteStatus: true,
			colorPalette: 3,
		});

		expect(await getAttributes('palette-color-general')).toStrictEqual(3);

		// Change hover typo color
		await page.$eval(
			'.maxi-accordion-control__item__panel--disable-padding .maxi-tabs-control__button-Hover',
			button => button.click()
		);

		await page.$eval(
			'.maxi-tabs-content .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		await editColorControl({
			page,
			instance: await page.$('.maxi-typography-control__color'),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(
			await getAttributes('palette-color-general-hover')
		).toStrictEqual(5);

		// Change button background color
		await openSidebarTab(page, 'style', 'button background');

		await page.$$eval(
			'.maxi-settingstab-control .maxi-background-control__simple .maxi-tabs-control__full-width button',
			button => button[1].click()
		);

		await editColorControl({
			page,
			instance: await page.$('.maxi-background-control'),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(
			await getAttributes('button-background-palette-color-general')
		).toStrictEqual(5);

		// Change hover button background color
		await page.$eval(
			'.maxi-accordion-control__item__panel--disable-padding .maxi-tabs-control__button-Hover',
			button => button.click()
		);

		await page.$eval(
			'.maxi-tabs-content .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		await editColorControl({
			page,
			instance: await page.$('.maxi-background-control'),
			paletteStatus: true,
			colorPalette: 3,
		});

		expect(
			await getAttributes('button-background-palette-color-general-hover')
		).toStrictEqual(3);

		await openSidebarTab(page, 'style', 'icon');

		await modalMock(page, { type: 'button-icon-filled' });

		// change hover
		await page.$eval(
			'.maxi-accordion-control__item__panel--disable-padding .maxi-tabs-control__button-Hover',
			button => button.click()
		);

		await page.$eval(
			'.maxi-tabs-content .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		// hover icon attributes
		expect(await getAttributes('icon-status-hover')).toStrictEqual(true);

		expect(await getAttributes('icon-inherit')).toStrictEqual(true);

		// Icon position
		await page.$eval(
			'.maxi-accordion-control__item__panel--disable-padding .maxi-tabs-control__button-Normal',
			button => button.click()
		);

		await page.$eval(
			'.maxi-icon-position-control .maxi-tabs-control .maxi-tabs-control__button-Left',
			button => button.click()
		);

		expect(await getAttributes('icon-position')).toStrictEqual('left');

		// Icon only
		await page.$eval(
			'.maxi-icon-control .maxi-color-control__palette__custom input',
			input => input.click()
		);

		expect(await getAttributes('icon-only')).toStrictEqual(true);
	});

	it('Button Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
