/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	addBackgroundLayer,
	addCustomCSS,
	getBlockStyle,
	getEditedPostContent,
	insertMaxiBlock,
} from '../../utils';

describe('Container Maxi', () => {
	it('Container Maxi does not break', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Container Maxi Custom CSS', async () => {
		await addBackgroundLayer(page, 'color');
		await addBackgroundLayer(page, 'color');

		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
