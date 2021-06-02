/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	openDocumentSettingsSidebar,
	ensureSidebarOpened,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

describe('block styles control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('cheking the block styles control', async () => {
		await insertBlock('Text Maxi');

		await openDocumentSettingsSidebar();
		await ensureSidebarOpened();

		const input = await page.$(
			'.maxi-tab-content__box .maxi-block-style-control select'
		);
		await input.select('maxi-dark');

		const expectAttribute = 'maxi-dark';
		const styleAttributes = await getBlockAttributes();

		expect(styleAttributes.blockStyle).toStrictEqual(expectAttribute);
	});
});
