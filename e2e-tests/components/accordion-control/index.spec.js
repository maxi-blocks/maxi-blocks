/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	// getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

describe('accordion control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the accordion control', async () => {
		await insertBlock('Text Maxi');
		const accordionNames = [
			'alignment',
			'level',
			'typography',
			'background',
			'border',
			'width height',
			'box shadow',
			'padding margin',
		];

		for (const accordionItem of accordionNames) {
			const accordionPanel = await openSidebar(page, `${accordionItem}`);

			expect(accordionPanel).toBeTruthy();
		}
	});
});
