/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('fancy radio control', () => {
	it('checking the fancy radio control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing display');
		const accordionPanel = await openAdvancedSidebar(page, 'display');

		await accordionPanel.$$eval(
			'.maxi-display-control .maxi-base-control__field label',
			button => button[2].click()
		);

		const attributes = await getBlockAttributes();
		const display = attributes['display-general'];
		const expectResult = 'none';

		expect(display).toStrictEqual(expectResult);
	});
});
