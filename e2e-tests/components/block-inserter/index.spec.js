/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('BlockInserter', () => {
	it('Checking the block inserter', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await page.waitForSelector('.maxi-group-block');

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
