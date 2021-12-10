/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockStyle, openSidebarTab, addCustomCSS } from '../../utils';

describe('Custom-Css-Control', () => {
	it('Checking the custom-css', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
	it('Checking the custom-css Validation', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'custom css'
		);

		const selector = await accordionPanel.$(
			'.maxi-custom-css-control__category select'
		);

		await selector.select('group');

		await page.$eval('.maxi-additional__css-group textarea', input =>
			input.focus()
		);

		await page.keyboard.type('VALIDATE ERROR');

		await accordionPanel.$eval(
			'.maxi-additional__css-group button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		const error = await accordionPanel.$$eval(
			'.maxi-additional__css-error',
			input => input[0].innerText
		);
		expect(error).not.toBe('Valid');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
