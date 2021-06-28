/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('ZIndexControl', () => {
	it('Checking the z-index control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'z index');

		await accordionPanel.$eval(
			'.maxi-zIndex-control .maxi-base-control__field input',
			input => input.focus()
		);

		await page.keyboard.type('2');

		const attributes = await getBlockAttributes();
		const zIndex = attributes['z-index-general'];
		const expectResult = 2;

		expect(zIndex).toStrictEqual(expectResult);
	});
});
