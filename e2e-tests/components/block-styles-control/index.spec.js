/**
 * WordPress dependencies
 */
import {
	createNewPost,
	openDocumentSettingsSidebar,
	ensureSidebarOpened,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('BlockStylesControl', () => {
	it('Checking the block styles control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await openDocumentSettingsSidebar();
		await ensureSidebarOpened();

		const input = await page.$(
			'.maxi-tab-content__box .maxi-block-style-control select'
		);
		await input.select('dark');

		expect(await getAttributes('blockStyle')).toStrictEqual('dark');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
