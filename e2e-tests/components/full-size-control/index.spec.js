/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('Full Size Control', () => {
	it('Checking the full size control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'width height');

		await accordionPanel.$$eval(
			'.maxi-fancy-radio-control .maxi-base-control__field label',
			click => click[1].click()
		);

		const expectResult = 'full';
		const expectAttributes = await getBlockAttributes();
		const width = expectAttributes.fullWidth;

		expect(width).toStrictEqual(expectResult);
	});
});
