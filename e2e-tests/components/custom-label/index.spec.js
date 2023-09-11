/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('CustomLabel', () => {
	it('Checking the custom label', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
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

		await page.keyboard.type('Column');
		await page.waitForTimeout(150);

		expect(await getAttributes('extraClassName')).toStrictEqual('Column');
	});
});
