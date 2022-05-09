/**
 * WordPress dependencies
 */
import { createNewPost, setPostContent } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */

import { getBlockStyle, getEditedPostContent } from '../../utils';
import basePattern from './pattern';

// paste blocks
/* const recovery = document
	.querySelectorAll('.components-button.is-primary')
	.forEach(e => {
		if (e.innerHTML === 'Attempt Block Recovery') e.click();
	}); */

describe('Pattern', () => {
	it('Checking pattern generate', async () => {
		await createNewPost();
		await setPostContent(basePattern);
		await page.waitForTimeout(1000);
		debugger;
		await page.waitForTimeout(1000);
		debugger;

		expect(await getEditedPostContent()).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
		// Checkeas frontend

		// Reload + snapshot again (snapshot de conteniido(html) y de styles)
	});
});
