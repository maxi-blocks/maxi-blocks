/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	openDocumentSettingsSidebar,
	ensureSidebarOpened,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockStyle, getAttributes } from '../../utils';

describe('BlockStylesControl', () => {
	it('Checking the block styles control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openDocumentSettingsSidebar();
		await ensureSidebarOpened();

		const input = await page.$(
			'.maxi-tab-content__box .maxi-block-style-control select'
		);
		await input.select('maxi-dark');

		expect(await getAttributes('blockStyle')).toStrictEqual('maxi-dark');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
