/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('BlockPlaceholder', () => {
	it('Checking the block placeholder', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

		const groupPlaceholder = await page.$eval(
			'.maxi-block-placeholder',
			select => select.innerHTML
		);

		expect(groupPlaceholder).toMatchSnapshot();
	});
});
