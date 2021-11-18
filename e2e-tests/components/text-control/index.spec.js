/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebarTab } from '../../utils';

describe('TextControl', () => {
	it('Check test control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'add css classes'
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
