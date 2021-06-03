/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openSidebar } from '../../utils';

describe('full size control', () => {
	it('checking the full size control', async () => {
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
