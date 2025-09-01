/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../../../utils';

describe('Text level', () => {
	it('Check text level', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });

		// open editor
		await page.$eval('.toolbar-wrapper .toolbar-item__text-level', button =>
			button.click()
		);

		// select h1
		await page.$$eval(
			'.components-popover__content .maxi-font-level-control .maxi-font-level-control__button',
			button => button[1].click()
		);

		expect(await getAttributes('textLevel')).toStrictEqual('h1');

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'typography');

		const textLevel = await page.$eval(
			'.maxi-font-level-control button[aria-pressed="true"]',
			input => input.outerText
		);

		expect(textLevel).toStrictEqual('H1');
	});
});
