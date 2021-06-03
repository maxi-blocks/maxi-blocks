/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import openSidebar from '../../utils/openSidebar';

describe('accordion control', () => {
	it('checking the accordion control', async () => {
		await createNewPost();
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
