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

describe('boxShadow control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the boxShadow control', async () => {
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'box shadow');

		const boxShadowControls = await accordionPanel.$$(
			'.maxi-shadow-control button'
		);

		for (let i = 0; i < boxShadowControls.length; i++) {
			const boxShadowControl = await boxShadowControls[i];

			const expectAttributes = {
				'box-shadow-blur-general': ,
				'box-shadow-color-general-hover': ,
				'box-shadow-horizontal-general': ,
				'box-shadow-spread-general': ,
				'box-shadow-status-hover': ,
				'box-shadow-vertical-general': ,
			};

			await boxShadowControl.click();
			const attributes = await getBlockAttributes();

			Object.entries(expectedAttributes).forEach(([key, value]) => {
			expect(attributes[key].toString()).toBe(value);});

		}

		
	});
});
