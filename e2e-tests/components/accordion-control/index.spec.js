/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */

import { openSidebarTab } from '../../utils';

describe('AccordionControl', () => {
	it('Checking the accordion control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

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
