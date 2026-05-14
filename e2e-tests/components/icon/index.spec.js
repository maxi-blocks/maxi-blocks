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
	dragInFrame,
} from '../../utils';

describe('Svg Icon Maxi default size', () => {
	it('Svg Icon Maxi default size', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Icon Maxi');

		await modalMock(page, { type: 'svg' });
		await page.waitForTimeout(500);

		await page.$eval('button[aria-label="Close"]', button =>
			button.click()
		);
		await page.waitForTimeout(200);

		// Drag the bottom-right handle left by 54px (64 → 10).
		// dragInFrame dispatches mousedown / mousemove / mouseup directly on
		// the iframe's window so re-resizable's listeners receive them.
		const frame = await getEditorFrame(page);

		await dragInFrame(
			page,
			frame,
			'.maxi-svg-icon-block .maxi-block__resizer .maxi-resizable__handle-bottomright',
			-54
		);

		await page.waitForTimeout(300);

		expect(await getAttributes('svg-width-general')).toStrictEqual('10');

		await openSidebarTab(page, 'style', 'height width');

		// Reset width via the sidebar reset button.
		await page.$eval(
			'.maxi-responsive-tabs-control .maxi-advanced-number-control button.maxi-reset-button',
			button => button.click()
		);

		expect(await getAttributes('svg-width-general')).toStrictEqual('64');
	});
});
