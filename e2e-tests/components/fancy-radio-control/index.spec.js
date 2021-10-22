/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('FancyRadioControl', () => {
	it('Checking the fancy radio control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openAdvancedSidebar(
			page,
			'show hide block'
		);

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
