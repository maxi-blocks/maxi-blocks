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
} from '../../utils';

describe('BoxShadowControl', () => {
	it('Checking the boxShadow control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

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
			'bs_blu-g': 50,
			'bs_cc-g': undefined,
			'bs_ho-g': 0,
			'bs_sp-g': 0,
			'bs.sh': false,
			'bs_v-g': 30,
		};

		const typographyAttributes = await getAttributes([
			'bs_blu-g',
			'bs_cc-g',
			'bs_ho-g',
			'bs_sp-g',
			'bs.sh',
			'bs_v-g',
		]);

		expect(typographyAttributes).toStrictEqual(expectAttributes);

		// custom Horizontal, Vertical, Blur, Spread
		const inputs = await accordionPanel.$$(
			'.maxi-shadow-control .maxi-advanced-number-control input'
		);

		// Horizontal
		await inputs[2].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('30');
		await page.keyboard.press('Enter');

		// Vertical
		await inputs[4].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('40');
		await page.keyboard.press('Enter');

		// Blur
		await inputs[6].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('10');
		await page.keyboard.press('Enter');

		// Spread
		await inputs[8].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('60');
		await page.keyboard.press('Enter');

		const expectChanges = {
			'bs_blu-g': 10,
			'bs_ho-g': 30,
			'bs_sp-g': 60,
			'bs_v-g': 40,
		};

		const boxShadowAttributes = await getAttributes([
			'bs_blu-g',
			'bs_ho-g',
			'bs_sp-g',
			'bs_v-g',
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
			'bs_blu-g': 0,
			'bs_blu-g.h': undefined,
			'bs_ho-g': 0,
			'bs_ho-g.h': undefined,
			'bs_sp-g': 0,
			'bs_sp-g.h': undefined,
			'bs_v-g': 0,
			'bs_v-g.h': undefined,
		};

		const boxShadowResult = await getAttributes([
			'bs_blu-g',
			'bs_blu-g.h',
			'bs_ho-g',
			'bs_ho-g.h',
			'bs_sp-g',
			'bs_sp-g.h',
			'bs_v-g',
			'bs_v-g.h',
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
			'bs_blu-g': 50,
			'bs_cc-g': undefined,
			'bs_ho-g': 0,
			'bs_sp-g': 0,
			'bs.sh': true,
			'bs_v-g': 30,
		};

		const typographyAttributes = await getAttributes([
			'bs_blu-g',
			'bs_cc-g',
			'bs_ho-g',
			'bs_sp-g',
			'bs.sh',
			'bs_v-g',
		]);

		expect(typographyAttributes).toStrictEqual(expectAttributes);

		// s
		await changeResponsive(page, 's');

		await accordionPanel.$$eval(
			'.maxi-shadow-control .maxi-default-styles-control__button',
			click => click[3].click()
		);

		const expectSAttributes = {
			'bs_blu-s': 0,
			'bs_ho-s': 5,
			'bs_sp-s': undefined,
			'bs_v-s': 6,
		};

		const typographySAttributes = await getAttributes([
			'bs_blu-s',
			'bs_ho-s',
			'bs_sp-s',
			'bs_v-s',
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
