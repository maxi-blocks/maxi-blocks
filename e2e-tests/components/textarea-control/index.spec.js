/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebar } from '../../utils';

describe('TextareaControl', () => {
	it('Check textarea control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openSidebar(page, 'caption');

		const selectors = await accordionPanel.$(
			'.maxi-image-caption-type select'
		);
		await selectors.select('custom');

		await accordionPanel.$eval(
			'.maxi-base-control.custom-caption .maxi-base-control__field textarea',
			select => select.focus()
		);
		await page.keyboard.type('Testing everything works correctly!');

		const expectText = await accordionPanel.$eval(
			'.maxi-base-control.custom-caption .maxi-base-control__field textarea',
			expectHtml => expectHtml.innerHTML
		);

		expect(expectText).toMatchSnapshot();
	});
});
