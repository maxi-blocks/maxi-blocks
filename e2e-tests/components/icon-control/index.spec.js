/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebarTab, modalMock } from '../../utils';

describe('IconControl', () => {
	it('Check Icon Control', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'style', 'icon');

		// select icon
		await modalMock(page, { type: 'button-icon' });

		expect(await getEditedPostContent()).toMatchSnapshot();

		// width, stroke width
		const inputs = await page.$$(
			'.maxi-advanced-number-control .maxi-base-control__field input'
		);

		// width
		await inputs[0].click();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('40');

		const widthAttributes = await getBlockAttributes();
		const width = widthAttributes['icon-width-general'];

		expect(width).toStrictEqual(340);

		// stroke width
		await inputs[2].click();
		await page.keyboard.type('5');

		const strokeAttributes = await getBlockAttributes();
		const stroke = strokeAttributes['icon-stroke-general'];

		expect(stroke).toStrictEqual(5);

		// icon spacing
		await inputs[4].click();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('66');

		const spacingAttributes = await getBlockAttributes();
		const spacing = spacingAttributes['icon-spacing-general'];

		expect(spacing).toStrictEqual(66);

		// icon position
		const label = await accordionPanel.$$(
			'.maxi-button-group-control .maxi-button-group-control__option label'
		);

		await label[1].click();
		const { 'icon-position': position } = await getBlockAttributes();

		expect(position).toStrictEqual('right');

		// Icon Border
		await label[3].click();

		await page.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[2].click()
		);

		// expects
		const expectBorder = 'dashed';
		const borderAttributes = await getBlockAttributes();
		const border = borderAttributes['icon-border-style-general'];

		expect(border).toStrictEqual(expectBorder);
	});
});
