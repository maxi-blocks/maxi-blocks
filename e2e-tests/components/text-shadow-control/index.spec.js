/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	getBlockStyle,
	changeResponsive,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('TextShadowControl', () => {
	it('Checking the text shadow control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		await accordionPanel.$eval(
			'.maxi-tabs-content .maxi-typography-control .maxi-textshadow-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$$(
			'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control'
		);

		const shadowStyles = [
			'none',
			'2px 4px 3px rgba(var(--maxi-light-color-8,150,176,203),0.3)',
			'2px 4px 3px rgba(var(--maxi-light-color-8,150,176,203),0.5)',
			'4px 4px 0px rgba(var(--maxi-light-color-8,150,176,203),0.21)',
		];

		for (let i = 0; i < shadowStyles.length; i += 1) {
			const setting = shadowStyles[i];

			await accordionPanel.$$eval(
				'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);
			await page.waitForTimeout(200);

			expect(await getAttributes('text-shadow-xl')).toStrictEqual(
				setting
			);
		}

		// change values manually
		const editTextShadow = await page.$$(
			'.maxi-textshadow-control .maxi-advanced-number-control'
		);

		// change X
		await editTextShadow[1].$eval('input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('34');

		await page.waitForTimeout(500);

		// 	change Y
		await editTextShadow[2].$eval('input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('12');

		await page.waitForTimeout(500);

		// change Blur
		await editTextShadow[3].$eval('input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('54');

		await page.waitForTimeout(500);

		expect(await getAttributes('text-shadow-xl')).toStrictEqual(
			'34px 12px 54px rgba(var(--maxi-light-color-8,150,176,203),0.21)'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Checking the text shadow control in responsive', async () => {
		await changeResponsive(page, 's');

		// expect values
		// S
		const baseSValue = await page.$$eval(
			'.maxi-textshadow-control .maxi-advanced-number-control input',
			input => input[2].value
		);
		expect(baseSValue).toStrictEqual('34');

		// Y
		const baseYValue = await page.$$eval(
			'.maxi-textshadow-control .maxi-advanced-number-control input',
			input => input[4].value
		);
		expect(baseYValue).toStrictEqual('12');

		// Blur
		const baseBlurValue = await page.$$eval(
			'.maxi-textshadow-control .maxi-advanced-number-control input',
			input => input[6].value
		);
		expect(baseBlurValue).toStrictEqual('54');

		// change values in S responsive
		const editTextShadow = await page.$$(
			'.maxi-textshadow-control .maxi-advanced-number-control'
		);

		// change X
		await editTextShadow[1].$eval('input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('67');

		await page.waitForTimeout(350);

		// 	change Y
		await editTextShadow[2].$eval('input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('15');

		await page.waitForTimeout(350);

		// change Blur
		await editTextShadow[3].$eval('input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('48');

		await page.waitForTimeout(350);

		// expect in Xs
		await changeResponsive(page, 'xs');

		await page.waitForTimeout(300);

		// S
		const xsSValue = await page.$$eval(
			'.maxi-textshadow-control .maxi-advanced-number-control input',
			input => input[2].value
		);
		await page.waitForTimeout(300);

		expect(xsSValue).toStrictEqual('67');

		// Y
		const xsYValue = await page.$$eval(
			'.maxi-textshadow-control .maxi-advanced-number-control input',
			input => input[4].value
		);
		expect(xsYValue).toStrictEqual('15');

		await page.waitForTimeout(500);

		// Blur
		const xsBlurValue = await page.$$eval(
			'.maxi-textshadow-control .maxi-advanced-number-control input',
			input => input[6].value
		);
		expect(xsBlurValue).toStrictEqual('48');

		// expect in M
		await changeResponsive(page, 'm');

		// S
		const mSValue = await page.$$eval(
			'.maxi-textshadow-control .maxi-advanced-number-control input',
			input => input[2].value
		);
		expect(mSValue).toStrictEqual('34');

		// Y
		const mYValue = await page.$$eval(
			'.maxi-textshadow-control .maxi-advanced-number-control input',
			input => input[4].value
		);
		expect(mYValue).toStrictEqual('12');

		// Blur
		const mBlurValue = await page.$$eval(
			'.maxi-textshadow-control .maxi-advanced-number-control input',
			input => input[6].value
		);
		expect(mBlurValue).toStrictEqual('54');
	});
});
