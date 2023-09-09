/**
 * WordPress dependencies
 */
import {
	createNewPost,
	ensureSidebarOpened,
	openDocumentSettingsSidebar,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { insertMaxiBlock, updateAllBlockUniqueIds } from '../../utils';

describe('SettingsTabsControl', () => {
	it('Checking the settings tabs control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await openDocumentSettingsSidebar();
		await ensureSidebarOpened();

		const firstContent = await page.$('.maxi-sidebar .maxi-tab-content');

		await page.$$eval(
			'.maxi-sidebar .maxi-settingstab-control button',
			tabs => tabs[1].click()
		);

		const secondContent = await page.$('.maxi-sidebar .maxi-tab-content');

		const result = firstContent !== secondContent;

		expect(result).toBeTruthy();
	});
});
