/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('Hover Effect Control', () => {
	it('Checking the hover effect control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'hover effects');

		await accordionPanel.$$eval(
			'.maxi-hover-effect-control .maxi-fancy-radio-control .maxi-base-control__field label',
			click => click[2].click()
		);

		// duration
		await accordionPanel.$$eval(
			'.maxi-hover-effect-control .components-range-control'
		);
		const attributes = await getBlockAttributes();
		const hoverPreview = attributes['hover-preview'];
		const expectResult = true;

		expect(hoverPreview).toStrictEqual(expectResult);
	});
});
