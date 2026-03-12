/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	modalMock,
	getAttributes,
	openSidebarTab,
	insertMaxiBlock,
	getEditorFrame,
} from '../../utils';

// TODO: drag-to-resize in the editor iframe doesn't work with current test tooling
// because re-resizable's flushSync targets the main-frame ReactDOM, not the
// iframe's separate React root, so offsetWidth is stale when onMouseUp fires.
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Svg Icon Maxi default size', () => {
	it('Svg Icon Maxi default size', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Icon Maxi');

		// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
		// Remove the maxi-block-inserter__last element
		// await page.evaluate(() => {
		// 	const element = document.querySelector(
		// 		'.maxi-block-inserter__last'
		// 	);
		// 	if (element) element.remove();
		// });

		await modalMock(page, { type: 'svg' });
		await page.waitForTimeout(500);

		await page.$eval('button[aria-label="Close"]', button =>
			button.click()
		);
		await page.waitForTimeout(200);

		// click and drag
		const frame = await getEditorFrame(page);
		const resizerBottomRight = await frame.$(
			'.maxi-svg-icon-block .maxi-block__resizer .maxi-resizable__handle-bottomright'
		);
		const boundingBox = await resizerBottomRight.boundingBox();

		const startX = boundingBox.x + boundingBox.width / 2;
		const startY = boundingBox.y + boundingBox.height / 2;

		await page.mouse.move(startX, startY);
		await page.mouse.down();
		// Drag left by 54px (64 → 10) while staying within the iframe (same y)
		await page.mouse.move(startX - 54, startY);
		await page.mouse.up();

		await page.waitForTimeout(300);

		expect(await getAttributes('svg-width-general')).toStrictEqual('10');

		await openSidebarTab(page, 'style', 'height width');

		// reset width
		await page.$eval(
			'.maxi-responsive-tabs-control .maxi-advanced-number-control button.maxi-reset-button',
			button => button.click()
		);

		expect(await getAttributes('svg-width-general')).toStrictEqual('64');
	});
});
