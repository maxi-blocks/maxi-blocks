/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, getAttributes } from '../../utils';

describe('CustomLabel', () => {
	it('Checking the custom label', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'add css classes'
		);

		await accordionPanel.$eval(
			'.maxi-custom-css-control__classes .maxi-base-control__field input',
			select => select.focus()
		);

		await page.keyboard.type('Column');

		expect(await getAttributes('extraClassName')).toStrictEqual('Column');
	});
});
