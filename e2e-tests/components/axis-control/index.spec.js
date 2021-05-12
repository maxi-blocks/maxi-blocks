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

describe('axis control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the axis control', async () => {
		await insertBlock('Text Maxi');

		await openSidebar(page, 'alignment');

		// await page.$eval(
		// 	'.interface-pinned-items .components-button.has-icon',
		// 	button => button.click()
		// );
		// /* const settings = */ await page.$$eval(
		// 	'.interface-interface-skeleton__sidebar .maxi-accordion-control.is-secondary .maxi-accordion-control__item .maxi-accordion-control__item__button',
		// 	accordion => accordion[1].click()
		// );

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
