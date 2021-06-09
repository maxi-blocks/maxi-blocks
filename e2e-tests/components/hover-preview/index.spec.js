/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('Hover Preview', () => {
	it('Checking the hover preview', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'hover effects');

		await accordionPanel.$$eval(
			'.maxi-hover-effect-control .maxi-fancy-radio-control .maxi-base-control__field label',
			click => click[5].click()
		);

		const attributes = await getBlockAttributes();
		const hoverPreview = attributes['hover-preview'];
		const expectResult = true;

		expect(hoverPreview).toStrictEqual(expectResult);
	});
});
