/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getAttributes, openSidebarTab, getBlockStyle } from '../../utils';

describe('TextShadowControl', () => {
	it('Checking the text shadow control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
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
			'2px 4px 3px rgba(var(--maxi-light-color-8),0.3)',
			'2px 4px 3px rgba(var(--maxi-light-color-8),0.5)',
			'4px 4px 0px rgba(var(--maxi-light-color-8),0.21)',
		];

		for (let i = 0; i < shadowStyles.length; i += 1) {
			const setting = shadowStyles[i];

			await accordionPanel.$$eval(
				'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);
			await page.waitForTimeout(200);

			expect(await getAttributes('text-shadow-general')).toStrictEqual(
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

		// 	change Y
		await editTextShadow[2].$eval('input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('12');
		// change Blur
		await editTextShadow[3].$eval('input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('54');

		expect(await getAttributes('text-shadow-general')).toStrictEqual(
			'34px 12px 54px rgba(var(--maxi-light-color-8),0.21)'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
