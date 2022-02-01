/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebarTab, getBlockStyle } from '../../utils';

describe('DefaultStylesControl', () => {
	it('Checking the default styles control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('check default styles');
		const accordionPanel = await openSidebarTab(page, 'style', 'border');
		await accordionPanel.$$(
			'.maxi-tabs-content .maxi-default-styles-control button'
		);

		const expectAttributes = [undefined, 'solid', 'dashed', 'dotted'];

		/* eslint-disable no-await-in-loop */
		for (let i = 0; i < expectAttributes.length; i += 1) {
			await page.$$eval(
				'.maxi-border-control .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			const attributes = await getBlockAttributes();
			const borderAttribute = attributes['border-style-general'];

			expect(borderAttribute).toStrictEqual(expectAttributes[i]);
		}

		debugger;
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
