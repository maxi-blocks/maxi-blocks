/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../../../utils';

describe('Toolbar size', () => {
	it('Check toolbar size', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit color
		await page.$eval('.toolbar-wrapper .toolbar-item__size', button =>
			button.click()
		);

		// enable full width
		await page.$eval(
			'.components-popover__content .toolbar-item__size__popover input',
			input => input.click()
		);

		// edit width
		await page.$eval(
			'.toolbar-item__size__popover .maxi-advanced-number-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('754', { delay: 350 });

		expect(await getAttributes('width-xl')).toStrictEqual(754);

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'height width');

		const width = await page.$eval(
			'.maxi-tabs-content .maxi-full-size-control .maxi-full-size-control__width input',
			input => input.value
		);

		expect(width).toStrictEqual('754');
	});
});
