/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
	activatePlugin,
	deactivatePlugin,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockStyle, openSidebarTab } from './utils';

describe('DB optimization test', () => {
	it('test', async () => {
		await deactivatePlugin('maxi-blocks-last-github-version');
		await activatePlugin('maxi-blocks-last-github-version');

		await createNewPost();
		await insertBlock('Button Maxi');

		const el = await page.$('#maxi-blocks-sc-vars-inline-css');

		const elExist = !!el;
		expect(elExist).toBeTruthy();

		const elContent = await el.evaluate(e => e.innerText);
		expect(elContent).toMatchSnapshot();
	});
});
