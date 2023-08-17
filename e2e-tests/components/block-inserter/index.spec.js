/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { insertMaxiBlock, updateAllBlockUniqueIds } from '../../utils';

describe('BlockInserter', () => {
	it('Checking the block inserter', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');
		await updateAllBlockUniqueIds(page);

		const groupInserter = await page.$eval(
			'.maxi-block-inserter',
			select => {
				// Inserter creates a unique ID as a class for the `span` element that change on every render.
				select.querySelector('span').removeAttribute('class');

				return select.innerHTML;
			}
		);

		expect(groupInserter).toMatchSnapshot();
	});
});
