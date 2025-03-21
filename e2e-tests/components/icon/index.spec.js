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
} from '../../utils';

describe('Svg Icon Maxi default size', () => {
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
		const resizerBottomRight = await page.$(
			'.maxi-svg-icon-block .maxi-block__resizer .maxi-resizable__handle-bottomright'
		);
		const boundingBox = await resizerBottomRight.boundingBox();

		await page.mouse.move(
			boundingBox.x + boundingBox.width / 2,
			boundingBox.y + boundingBox.height / 2
		);
		await page.mouse.down();
		await page.mouse.move(60, 4);
		await page.mouse.up();

		await page.waitForTimeout(300);

		expect(await getAttributes('svg-width-xl')).toStrictEqual('10');

		await openSidebarTab(page, 'style', 'height width');

		// reset width
		await page.$eval(
			'.maxi-responsive-tabs-control .maxi-advanced-number-control button',
			button => button.click()
		);

		expect(await getAttributes('svg-width-xl')).toStrictEqual('64');
	});
});
