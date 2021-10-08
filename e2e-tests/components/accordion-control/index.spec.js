/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import openSidebar from '../../utils/openSidebar';

describe('AccordionControl', () => {
	it('Checking the accordion control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		const accordionNames = [
			'alignment',
			'level',
			'typography',
			'background',
			'border',
			'height width',
			'box shadow',
			'padding margin',
		];

		for (const accordionItem of accordionNames) {
			const accordionPanel = await openSidebar(page, `${accordionItem}`);

			expect(accordionPanel).toBeTruthy();
		}
	});
});
