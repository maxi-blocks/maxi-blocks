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
import { openAdvancedSidebar, getBlockStyle } from '../../utils';

describe('TextareaControl', () => {
	it('Check textarea control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'hover effects');

		await accordionPanel.$$eval(
			'.maxi-hover-effect-control .maxi-radio-control input',
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

		const blockStyles = await getBlockStyle(page);
		expect(blockStyles).toMatchSnapshot();
	});
});
