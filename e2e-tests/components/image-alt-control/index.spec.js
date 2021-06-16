/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('ImageAltControl', () => {
	it('Checking the image alt control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openSidebar(page, 'image alt tag');

		const selector = await accordionPanel.$(
			'.maxi-image-alt-control .maxi-base-control__field select'
		);
		await selector.select('custom');

		const attributes = await getBlockAttributes();
		const expectSelector = attributes.altSelector;
		const expectAttributes = 'custom';

		expect(expectSelector).toStrictEqual(expectAttributes);

		await accordionPanel.$eval(
			'.maxi-image-alt-control .maxi-text-control .maxi-text-control__input',
			select => select.focus()
		);
		await page.keyboard.type('testing alt tag');

		const altTagAttributes = await getBlockAttributes();
		const altMedia = altTagAttributes.mediaAlt;
		const altTag = 'testing alt tag';

		expect(altMedia).toStrictEqual(altTag);
	});
});
