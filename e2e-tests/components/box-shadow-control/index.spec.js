/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	getAttributes,
	changeResponsive,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('BoxShadowControl', () => {
	it('Checking the boxShadow control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'box shadow'
		);

		await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-default-styles-control__button',
			click => click[1].click()
		);

		const expectAttributes = {
			'box-shadow-blur-xl': 50,
			'box-shadow-color-xl': undefined,
			'box-shadow-horizontal-xl': 0,
			'box-shadow-spread-xl': 0,
			'box-shadow-status-hover': false,
			'box-shadow-vertical-xl': 30,
		};

		const typographyAttributes = await getAttributes([
			'box-shadow-blur-xl',
			'box-shadow-color-xl',
			'box-shadow-horizontal-xl',
			'box-shadow-spread-xl',
			'box-shadow-status-hover',
			'box-shadow-vertical-xl',
		]);

		expect(typographyAttributes).toStrictEqual(expectAttributes);

		// custom Horizontal, Vertical, Blur, Spread
		const inputs = await accordionPanel.$$(
			'.maxi-shadow-control .maxi-advanced-number-control input'
		);

		// Horizontal
		await inputs[2].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('30', { delay: 350 });
		await page.keyboard.press('Enter');

		// Vertical
		await inputs[4].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('40', { delay: 350 });
		await page.keyboard.press('Enter');

		// Blur
		await inputs[6].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('10', { delay: 350 });
		await page.keyboard.press('Enter');

		// Spread
		await inputs[8].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('60', { delay: 350 });
		await page.keyboard.press('Enter');

		const expectChanges = {
			'box-shadow-blur-xl': 10,
			'box-shadow-horizontal-xl': 30,
			'box-shadow-spread-xl': 60,
			'box-shadow-vertical-xl': 40,
		};

		const boxShadowAttributes = await getAttributes([
			'box-shadow-blur-xl',
			'box-shadow-horizontal-xl',
			'box-shadow-spread-xl',
			'box-shadow-vertical-xl',
		]);

		expect(boxShadowAttributes).toStrictEqual(expectChanges);
	});

	it('Check hover values kept after setting normal border to none', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'box shadow'
		);
		await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-default-styles-control__button',
			click => click[1].click()
		);

		await accordionPanel.$$eval(
			'[data-name="box shadow"] .maxi-tabs-control .maxi-tabs-control__button',
			buttons => buttons[1].click()
		);

		await page.$eval(
			'.maxi-box-shadow-status-hover.maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$$eval(
			'[data-name="box shadow"] .maxi-tabs-control .maxi-tabs-control__button',
			buttons => buttons[0].click()
		);

		await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-default-styles-control__button',
			click => click[0].click()
		);

		const expectBoxShadow = {
			'box-shadow-blur-xl': 0,
			'box-shadow-blur-xl-hover': undefined,
			'box-shadow-horizontal-xl': 0,
			'box-shadow-horizontal-xl-hover': undefined,
			'box-shadow-spread-xl': 0,
			'box-shadow-spread-xl-hover': undefined,
			'box-shadow-vertical-xl': 0,
			'box-shadow-vertical-xl-hover': undefined,
		};

		const boxShadowResult = await getAttributes([
			'box-shadow-blur-xl',
			'box-shadow-blur-xl-hover',
			'box-shadow-horizontal-xl',
			'box-shadow-horizontal-xl-hover',
			'box-shadow-spread-xl',
			'box-shadow-spread-xl-hover',
			'box-shadow-vertical-xl',
			'box-shadow-vertical-xl-hover',
		]);

		expect(boxShadowResult).toStrictEqual(expectBoxShadow);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check responsive box shadow', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'box shadow'
		);

		await accordionPanel.$$eval(
			'[data-name="box shadow"] .maxi-tabs-control .maxi-tabs-control__button',
			buttons => buttons[0].click()
		);

		// base
		await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-default-styles-control__button',
			click => click[1].click()
		);

		const expectAttributes = {
			'box-shadow-blur-xl': 50,
			'box-shadow-color-xl': undefined,
			'box-shadow-horizontal-xl': 0,
			'box-shadow-spread-xl': 0,
			'box-shadow-status-hover': true,
			'box-shadow-vertical-xl': 30,
		};

		const typographyAttributes = await getAttributes([
			'box-shadow-blur-xl',
			'box-shadow-color-xl',
			'box-shadow-horizontal-xl',
			'box-shadow-spread-xl',
			'box-shadow-status-hover',
			'box-shadow-vertical-xl',
		]);

		expect(typographyAttributes).toStrictEqual(expectAttributes);

		// s
		await changeResponsive(page, 's');

		await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-default-styles-control__button',
			click => click[3].click()
		);

		const expectSAttributes = {
			'box-shadow-blur-s': 0,
			'box-shadow-horizontal-s': 5,
			'box-shadow-spread-s': 0,
			'box-shadow-vertical-s': 6,
		};

		const typographySAttributes = await getAttributes([
			'box-shadow-blur-s',
			'box-shadow-horizontal-s',
			'box-shadow-spread-s',
			'box-shadow-vertical-s',
		]);

		expect(typographySAttributes).toStrictEqual(expectSAttributes);

		// xs
		await changeResponsive(page, 'xs');

		const xsHorizontal = await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-advanced-number-control input',
			input => input[2].value
		);

		expect(xsHorizontal).toStrictEqual('5');

		const xsVertical = await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-advanced-number-control input',
			input => input[4].value
		);

		expect(xsVertical).toStrictEqual('6');

		// m
		await changeResponsive(page, 'm');

		const mVertical = await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-advanced-number-control input',
			input => input[4].value
		);

		expect(mVertical).toStrictEqual('30');

		const mBlur = await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-advanced-number-control input',
			input => input[6].value
		);

		expect(mBlur).toStrictEqual('50');
	});
});
