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
			'bs_blu-general': 50,
			'bs_cc-general': undefined,
			'bs_ho-general': 0,
			'bs_sp-general': 0,
			'bs.sh': false,
			'bs_v-general': 30,
		};

		const typographyAttributes = await getAttributes([
			'bs_blu-general',
			'bs_cc-general',
			'bs_ho-general',
			'bs_sp-general',
			'bs.sh',
			'bs_v-general',
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
			'bs_blu-general': 10,
			'bs_ho-general': 30,
			'bs_sp-general': 60,
			'bs_v-general': 40,
		};

		const boxShadowAttributes = await getAttributes([
			'bs_blu-general',
			'bs_ho-general',
			'bs_sp-general',
			'bs_v-general',
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
			'bs_blu-general': 0,
			'bs_blu-general-hover': undefined,
			'bs_ho-general': 0,
			'bs_ho-general-hover': undefined,
			'bs_sp-general': 0,
			'bs_sp-general-hover': undefined,
			'bs_v-general': 0,
			'bs_v-general-hover': undefined,
		};

		const boxShadowResult = await getAttributes([
			'bs_blu-general',
			'bs_blu-general-hover',
			'bs_ho-general',
			'bs_ho-general-hover',
			'bs_sp-general',
			'bs_sp-general-hover',
			'bs_v-general',
			'bs_v-general-hover',
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
			'bs_blu-general': 50,
			'bs_cc-general': undefined,
			'bs_ho-general': 0,
			'bs_sp-general': 0,
			'bs.sh': true,
			'bs_v-general': 30,
		};

		const typographyAttributes = await getAttributes([
			'bs_blu-general',
			'bs_cc-general',
			'bs_ho-general',
			'bs_sp-general',
			'bs.sh',
			'bs_v-general',
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
