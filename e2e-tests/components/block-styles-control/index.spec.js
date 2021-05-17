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

		await accordionPanel.$$eval(
			'.maxi-tab-content__box .components-base-control__field',
			selectorOptions =>
				selectorOptions[1].querySelectorAll('select').select('Dark')
		);

		await expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
