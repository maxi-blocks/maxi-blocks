/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	getBlockStyle,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('DefaultStylesControl', () => {
	it('Checking the default styles control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('check default styles', { delay: 350 });
		const accordionPanel = await openSidebarTab(page, 'style', 'border');
		await accordionPanel.$$(
			'.maxi-tabs-content .maxi-default-styles-control button'
		);

		const expectAttributes = ['none', 'solid', 'dashed', 'dotted'];

		/* eslint-disable no-await-in-loop */
		for (let i = 0; i < expectAttributes.length; i += 1) {
			await page.$$eval(
				'.maxi-border-control .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			const attributes = await getBlockAttributes();
			const borderAttribute = attributes['border-style-xl'];

			expect(borderAttribute).toStrictEqual(expectAttributes[i]);
		}

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
