/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('BlockInserter', () => {
	it('Checking the block inserter', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

		const groupInserter = await page.$eval(
			'.maxi-block-inserter',
			select => select.innerHTML
		);

		expect(groupInserter).toMatchSnapshot();
	});
});
