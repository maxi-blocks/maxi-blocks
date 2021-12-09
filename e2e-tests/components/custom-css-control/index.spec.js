/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockStyle, addCustomCSS } from '../../utils';

describe('Custom-Css-Control', () => {
	it('Checking the custom-css control in Group Maxi', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await addCustomCSS(page);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
