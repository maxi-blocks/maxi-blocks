/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */

import { openSidebarTab, insertMaxiBlock } from '../../utils';

describe('AccordionControl', () => {
	it('Checking the accordion control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		const accordionNames = [
			'heading paragraph tag',
			'alignment',
			'typography',
			'background layer',
			'border',
			'box shadow',
			'height width',
			'margin padding',
		];

		for (const accordionItem of accordionNames) {
			const accordionPanel = await openSidebarTab(
				page,
				'style',
				accordionItem
			);

			expect(accordionPanel).toBeTruthy();
		}
	});
});
