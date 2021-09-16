/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('TextShadowControl', () => {
	it('Checking the text shadow control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		const accordionPanel = await openSidebar(page, 'typography');

		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control .maxi-textshadow-control label',
			select => select[1].click()
		);

		await accordionPanel.$$(
			'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control'
		);

		const shadowStyles = [
			'none',
			'0px 0px 5px #a2a2a2',
			'5px 0px 3px #a2a2a2',
			'2px 4px 0px #a2a2a2',
		];

		await accordionPanel.$$eval(
			'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control button',
			buttons => {
				buttons[1].click();
			}
		);

		for (let i = 0; i < shadowStyles.length; i += 1) {
			const setting = shadowStyles[i];

			await accordionPanel.$$eval(
				'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);
			await page.waitForTimeout(200);

			const shadowAttributes = await getBlockAttributes();
			const textShadow = shadowAttributes['text-shadow-general'];

			expect(textShadow).toStrictEqual(setting);
		}
	});
});
