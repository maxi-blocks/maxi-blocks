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
	getEditorFrame,
} from '../../utils';

// TODO: drag-to-resize in the editor iframe doesn't work with current test tooling
// (same root cause as icon/index.spec.js — re-resizable's flushSync targets the
// main-frame ReactDOM, not the iframe's separate React root)
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('BlockResizer', () => {
	it('Checking the block resizer', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Number Counter Maxi');
		await updateAllBlockUniqueIds(page);

		// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
		// Remove the maxi-block-inserter__last element
		// await page.evaluate(() => {
		// 	const element = document.querySelector(
		// 		'.maxi-block-inserter__last'
		// 	);
		// 	if (element) element.remove();
		// });

		const accordionPanel = await openSidebarTab(page, 'style', 'number');

		const blockBaseWith = await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-number-counter-control__width input',
			selector => selector.value
		);
		expect(blockBaseWith).toStrictEqual('250');
		await page.waitForTimeout(300);

		// click and drag
		const frame = await getEditorFrame(page);
		const resizerBottomRight = await frame.$(
			'.maxi-number-counter-block .maxi-resizable__handle-wrapper .maxi-resizable__handle-bottomright'
		);
		const boundingBox = await resizerBottomRight.boundingBox();

		const startX = boundingBox.x + boundingBox.width / 2;
		const startY = boundingBox.y + boundingBox.height / 2;

		await page.mouse.move(startX, startY);
		await page.mouse.down();
		// Drag left by 170px (250 → 80) while staying within the iframe (same y)
		await page.mouse.move(startX - 170, startY);
		await page.mouse.up();

		await page.waitForTimeout(300);

		const blockWidth = await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-number-counter-control__width input',
			selector => selector.value
		);
		expect(blockWidth).toStrictEqual('80');

		expect(
			await getAttributes('number-counter-width-general')
		).toStrictEqual('80');
	});
});
