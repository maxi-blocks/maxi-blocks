/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	// getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

describe('full size control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the full size control', async () => {
		await insertBlock('Text Maxi');

		const accordionPanel = await openSidebar(page, 'width height');
		await accordionPanel.$$eval(
			'.maxi-fancy-radio-control .maxi-base-control__field label',
			click => click[1].click()
		);

		const expectResult = 'full';
		const expectAttributes = await getBlockAttributes();

		expect(expectAttributes.fullWidth).toStrictEqual(expectResult);
	});
});
