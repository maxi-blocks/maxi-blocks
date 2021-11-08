/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebarTab, getBlockStyle } from '../../utils';

describe('ButtonGroupControl', () => {
	it('Check button group control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		await openSidebarTab(page, 'style', 'alignment');

		const alignmentSettings = await page.$$(
			'.maxi-alignment-control button'
		);

		const alignments = ['center', 'right', 'justify', 'left'];
		for (let i = 0; i < alignmentSettings.length; i++) {
			const setting = alignmentSettings[i !== 3 ? i + 1 : 0];

			await setting.click();

			const attributes = await getBlockAttributes();
			const attribute = attributes['text-alignment-general'];
			expect(attribute).toStrictEqual(alignments[i]);
		}

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
