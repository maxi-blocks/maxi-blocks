/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	getBlockAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('DividerControl', () => {
	it('Checking the style selector', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');
		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'line settings'
		);

		const dividerStyles = ['none', 'solid', 'dashed', 'dotted'];

		for (let i = 0; i < dividerStyles.length; i += 1) {
			const dividerStyle = dividerStyles[i];

			await accordionPanel.$$eval(
				'.maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			await page.waitForTimeout(500);

			const attributes = await getBlockAttributes();
			const borderStyle = attributes['divider-border-style-xl'];

			expect(borderStyle).toStrictEqual(dividerStyle);
		}

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
