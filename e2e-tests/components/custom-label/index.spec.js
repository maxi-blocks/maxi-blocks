/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('position control', () => {
	it('checking the position control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing position');

		const accordionPanel = await openAdvancedSidebar(
			page,
			'custom classes'
		);

		await accordionPanel.$eval(
			'.maxi-additional__css-classes .maxi-base-control__field input',
			select => select.focus()
		);

		await page.keyboard.type('Column');

		const attributes = await getBlockAttributes();
		const className = attributes.extraClassName;
		const AdditionalClass = 'Column';

		expect(className).toStrictEqual(AdditionalClass);
	});
});
