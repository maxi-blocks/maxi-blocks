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

describe('Text color', () => {
	it('Check text color', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// open editor
		await page.$eval('.toolbar-item__text-color', button => button.click());

		// select color
		await page.$eval(
			'.components-popover__content .maxi-color-palette-control button[data-item="5"]',
			button => button.click()
		);

		// change opacity
		await page.$eval(
			'.components-popover__content .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('32', { delay: 500 });

		const expectDivider = {
			'palette-color-xl': 5,
			'palette-opacity-xl': 0.32,
		};

		await page.waitForTimeout(500);

		const dividerResult = await getAttributes([
			'palette-color-xl',
			'palette-opacity-xl',
		]);

		await page.waitForTimeout(500);

		expect(dividerResult).toStrictEqual(expectDivider);

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'typography');
		const color = await page.$eval(
			'.maxi-typography-control .maxi-typography-control__color .maxi-color-control__palette-label .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(color).toStrictEqual('5');

		const opacity = await page.$eval(
			'.maxi-typography-control__color .maxi-opacity-control input',
			input => input.value
		);

		expect(opacity).toStrictEqual('32');
	});
});
