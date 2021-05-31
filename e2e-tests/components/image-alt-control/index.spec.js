/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import openSidebar from '../../utils/openSidebar';
import { getBlockAttributes } from '../../utils';

describe('image alt', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the image alt control', async () => {
		await insertBlock('Image Maxi');
		const accordionPanel = await openSidebar(page, 'image alt tag');
		const selector = await accordionPanel.$(
			'.maxi-image-alt-control .components-select-control__input'
		);
		await selector.select('custom');

		const attributes = await getBlockAttributes();
		const expectAttributes = 'custom';

		expect(attributes.altSelector).toStrictEqual(expectAttributes);

		const insertText = await accordionPanel.$eval(
			'.maxi-image-alt-control .components-base-control .components-text-control__input',
			select => select.focus()
		);
		await page.keyboard.type('testing alt tag');

		const altTagAttributes = await getBlockAttributes();
		const altTag = 'testing alt tag';

		expect(altTagAttributes.mediaAlt).toStrictEqual(altTag);
	});
});
