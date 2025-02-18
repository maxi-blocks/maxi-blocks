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
			'box-shadow-blur-general': 50,
			'box-shadow-color-general': undefined,
			'box-shadow-horizontal-general': 0,
			'box-shadow-spread-general': 0,
			'box-shadow-status-hover': false,
			'box-shadow-vertical-general': 30,
		};

		const typographyAttributes = await getAttributes([
			'box-shadow-blur-general',
			'box-shadow-color-general',
			'box-shadow-horizontal-general',
			'box-shadow-spread-general',
			'box-shadow-status-hover',
			'box-shadow-vertical-general',
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
			'box-shadow-blur-general': 10,
			'box-shadow-horizontal-general': 30,
			'box-shadow-spread-general': 60,
			'box-shadow-vertical-general': 40,
		};

		const boxShadowAttributes = await getAttributes([
			'box-shadow-blur-general',
			'box-shadow-horizontal-general',
			'box-shadow-spread-general',
			'box-shadow-vertical-general',
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
			'box-shadow-blur-general': 0,
			'box-shadow-blur-general-hover': undefined,
			'box-shadow-horizontal-general': 0,
			'box-shadow-horizontal-general-hover': undefined,
			'box-shadow-spread-general': 0,
			'box-shadow-spread-general-hover': undefined,
			'box-shadow-vertical-general': 0,
			'box-shadow-vertical-general-hover': undefined,
		};

		const boxShadowResult = await getAttributes([
			'box-shadow-blur-general',
			'box-shadow-blur-general-hover',
			'box-shadow-horizontal-general',
			'box-shadow-horizontal-general-hover',
			'box-shadow-spread-general',
			'box-shadow-spread-general-hover',
			'box-shadow-vertical-general',
			'box-shadow-vertical-general-hover',
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
			'box-shadow-blur-general': 50,
			'box-shadow-color-general': undefined,
			'box-shadow-horizontal-general': 0,
			'box-shadow-spread-general': 0,
			'box-shadow-status-hover': true,
			'box-shadow-vertical-general': 30,
		};

		const typographyAttributes = await getAttributes([
			'box-shadow-blur-general',
			'box-shadow-color-general',
			'box-shadow-horizontal-general',
			'box-shadow-spread-general',
			'box-shadow-status-hover',
			'box-shadow-vertical-general',
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
