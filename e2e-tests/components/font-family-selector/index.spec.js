/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, getBlockStyle, getAttributes } from '../../utils';

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

		// reset button
		await page.$eval(
			'.maxi-tabs-content .maxi-typography-control .maxi-base-control .components-maxi-control__font-reset-button',
			button => button.click()
		);

		expect(await getAttributes('font-family-general')).toStrictEqual(
			undefined
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
