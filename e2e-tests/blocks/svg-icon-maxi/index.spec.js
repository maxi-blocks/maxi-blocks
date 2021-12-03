/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * Interactive dependencies
 */
import { getBlockStyle, modalMock } from '../../utils';

describe('Svg Icon Maxi', () => {
	it('Svg Icon Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('SVG Icon Maxi');

		await modalMock(page, { type: 'svg' });

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
