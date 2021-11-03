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
import { openSidebarTab, getBlockStyle } from '../../utils';

describe('TextareaControl', () => {
	it('Check textarea control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'hover effect'
		);

		await accordionPanel.$$eval(
			'.maxi-hover-effect-control .maxi-button-group-control button',
			buttons => buttons[2].click()
		);

		await page.$eval(
			'.maxi-hover-effect-control .maxi-base-control__field textarea',
			select => select.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.press('Backspace');
		await page.keyboard.type('Testing everything works correctly!');

		const expectText = await page.$eval(
			'.maxi-hover-effect-control .maxi-base-control__field textarea',
			expectHtml => expectHtml.innerHTML
		);

		expect(expectText).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
