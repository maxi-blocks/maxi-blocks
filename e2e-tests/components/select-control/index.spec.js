/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, getAttributes } from '../../utils';

describe('SelectControl', () => {
	it('Check select control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebarTab(page, 'style', 'border');

		const selector = await accordionPanel.$(
			'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select'
		);
		await selector.select('dotted');

		expect(await getAttributes('border-style-general')).toStrictEqual(
			'dotted'
		);
	});
});
