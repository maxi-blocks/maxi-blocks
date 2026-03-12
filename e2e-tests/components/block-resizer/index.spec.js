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
	dragInFrame,
} from '../../utils';

describe('BlockResizer', () => {
	it('Checking the block resizer', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Number Counter Maxi');
		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(page, 'style', 'number');

		const blockBaseWith = await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-number-counter-control__width input',
			selector => selector.value
		);
		expect(blockBaseWith).toStrictEqual('250');
		await page.waitForTimeout(300);

		// Drag the bottom-right handle left by 170px (250 → 80).
		// dragInFrame dispatches mousedown / mousemove / mouseup directly on
		// the iframe's window so re-resizable's listeners receive them.
		const frame = await getEditorFrame(page);

		await dragInFrame(
			page,
			frame,
			'.maxi-number-counter-block .maxi-resizable__handle-wrapper .maxi-resizable__handle-bottomright',
			-170
		);

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
