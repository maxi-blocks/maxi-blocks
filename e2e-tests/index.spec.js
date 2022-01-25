/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockStyle, openSidebarTab } from './utils';

describe('DB optimization test', () => {
	it('test', async () => {
		await createNewPost();
		await pressKeyWithModifier('primary', 'F5');
		await insertBlock('Button Maxi');

		const el = await page.$('#maxi-blocks-sc-vars-inline-css');

		const elExist = !!el;
		expect(elExist).toBeTruthy();

		const elContent = await el.evaluate(e => e.innerText);
		expect(elContent).toMatchSnapshot();
	});
});
