/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('TextControl', () => {
	it('Check test control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		const accordionPanel = await openAdvancedSidebar(
			page,
			'add css class id'
		);

		await accordionPanel.$eval(
			'.maxi-additional__css-classes .maxi-base-control__field input',
			select => select.focus()
		);

		await page.keyboard.type('title');

		const attributes = await getBlockAttributes();
		const className = attributes.extraClassName;
		const additionalClass = 'title';

		expect(className).toStrictEqual(additionalClass);
	});
});
