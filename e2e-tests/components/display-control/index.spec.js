/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	// pressKeyTimes,
} from '@wordpress/e2e-test-utils';
// import openSidebar from '../../utils/openSidebar';
import { getBlockAttributes } from '../../utils';

describe('display control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the display control', async () => {
		await insertBlock('Text Maxi');
		const settings = await page.$$(
			'.interface-pinned-items .components-button'
		);
		await settings.click();

		const open = await settings.$('.maxi-tabs-control');
		await open.$$eval('button', advancedSettings =>
			advancedSettings[1].click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
