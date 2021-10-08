/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('SelectControl', () => {
	it('Check select control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'border');

		const selector = await accordionPanel.$(
			'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select'
		);
		await selector.select('dotted');

		const expectResult = 'dotted';
		const attributes = await getBlockAttributes();
		const style = attributes['border-style-general'];

		expect(style).toStrictEqual(expectResult);

		const blockStyles = await getBlockStyle(page);
		expect(blockStyles).toMatchSnapshot();
	});
});
