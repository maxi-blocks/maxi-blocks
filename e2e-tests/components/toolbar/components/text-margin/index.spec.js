/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, openSidebarTab } from '../../../../utils';

describe('Text margin', () => {
	it('Check text margin', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		// open editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__text-margin',
			button => button.click()
		);

		// edit margin
		await page.$eval(
			'.components-popover__content .toolbar-item__padding-margin__popover input',
			button => button.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('66');

		expect(await getAttributes('margin-bottom-general')).toStrictEqual(
			'66'
		);

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'margin padding');

		const margin = await page.$eval(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin input',
			input => input.value
		);

		expect(margin).toStrictEqual('66');
	});
});
