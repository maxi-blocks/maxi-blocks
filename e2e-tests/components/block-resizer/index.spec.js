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

describe('BlockResizer', () => {
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
		const resizerBottomRight = await page.$(
			'.maxi-number-counter-block .maxi-resizable__handle-wrapper .maxi-resizable__handle-bottomright'
		);
		const boundingBox = await resizerBottomRight.boundingBox();

		await page.mouse.move(
			boundingBox.x + boundingBox.width / 2,
			boundingBox.y + boundingBox.height / 2
		);
		await page.mouse.down();
		await page.mouse.move(126, 19);
		await page.mouse.up();

		await page.waitForTimeout(300);

		const blockWidth = await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-number-counter-control__width input',
			selector => selector.value
		);
		expect(blockWidth).toStrictEqual('80');

		expect(await getAttributes('number-counter-width-xl')).toStrictEqual(
			'80'
		);
	});
});
