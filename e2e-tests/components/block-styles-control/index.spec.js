/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
// import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

describe('block styles control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('cheking the block styles control', async () => {
		await insertBlock('Text Maxi');
		const accordionPanel = page.$eval(
			'.interface-pinned-items .components-button.has-icon',
			select => select.click()
		);

		const input = await accordionPanel.$$(
			'.maxi-tab-content__box .components-base-control .components-select-control__input'
		);
		const styleOptions = await input.$$('option');
		await input.select('Dark');

		await expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
