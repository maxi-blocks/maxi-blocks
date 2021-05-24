/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

import { getBlockAttributes } from '../../utils';

describe('toolbar', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the toolbar', async () => {
		await insertBlock('Text Maxi');
		const buttons = await page.$$('.toolbar-wrapper button');

		for (let i = 0; i < buttons.length; i++) {
			const setting = buttons[i];

			await setting.click();

			const attributes = await getBlockAttributes();

			expect(await getEditedPostContent()).toMatchSnapshot();
		}
	});
});
