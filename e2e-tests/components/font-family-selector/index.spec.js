/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	getBlockStyle,
	getAttributes,
} from '../../utils';

describe('FontFamilySelector', () => {
	it('Checking the font family selector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-family input',
			button => button.focus()
		);

		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		expect(await getAttributes('font-family-general')).toStrictEqual(
			'Montserrat'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
