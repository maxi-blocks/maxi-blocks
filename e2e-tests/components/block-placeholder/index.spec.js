/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('BlockPlaceholder', () => {
	it('Checking the block placeholder', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

		await page.$eval(
			'.maxi-group-block__group .maxi-block-placeholder .components-dropdown button',
			select => select.click()
		);

		const group = await page.$eval(
			'.maxi-group-block__group .maxi-block-placeholder .components-dropdown.block-editor-inserter',
			select => select.innerHTML
		);

		expect(group).toMatchSnapshot();
	});
});
