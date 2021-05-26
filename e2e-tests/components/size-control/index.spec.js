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
			'.maxi-accordion-control__item__panel .maxi-fancy-radio-control label',
			click => click[2].click()
		);

		const expectResult = 'full';
		const expectAttributes = await getBlockAttributes();

		expect(expectAttributes.fullWidth).toStrictEqual(expectResult);
	});
});
