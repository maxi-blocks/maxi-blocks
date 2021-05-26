/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('shape divider control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the shape divider control', async () => {
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'shape');
		const select = await accordionPanel.$$eval(
			'.maxi-accordion-control__item__panel .maxi-svg-defaults button',
			click => click[1].click()
		);
		const expectShape =
			'<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 36.1 36.1" version="1.1" y="0" x="0" data-item="image-maxi-333334__svg"><g><path d="M24.5 7.8c-2.1-1.3-4.4-2.2-6.9-2.8-2.4-.6-4.8-.9-7.1-.7-2.4.1-4.4.7-6 1.6-1.8 1-3 2.4-3.7 4.1-.3.8-.4 1.7-.2 2.6.1.7.4 1.5.9 2.4.3.5.8 1.4 1.5 2.4.6 1 1 1.8 1.2 2.5.2.7.3 1.6.3 2.7 0 .6-.1 1.6-.1 2.9 0 1.1.2 2.1.5 2.8.4 1 1.1 1.8 2.1 2.4 1.2.8 2.4 1.1 3.7 1.1.9 0 2-.3 3.5-.8 1.8-.6 3-1 3.7-1.1 1.5-.3 2.9-.3 4.4.1 3.2.8 5.7 1.1 7.5.9 2.5-.2 4.2-1.2 5.1-3.1.7-1.3.9-2.8.7-4.6-.2-1.7-.8-3.6-1.7-5.5-1-2-2.2-3.8-3.8-5.5-1.7-1.8-3.6-3.2-5.6-4.4z" fill=""/></g></svg>';
		const attributes = await getBlockAttributes();
		expect(attributes.SVGElement).toStrictEqual(expectShape);
	});
});
