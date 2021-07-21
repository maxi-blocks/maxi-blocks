/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('Dropdown', () => {
	it('Check dropdown', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		const accordionPanel = await openSidebar(page, 'icon');

		await accordionPanel.$eval('.maxi-icon-control button', addIcon =>
			addIcon.click()
		);

		await page.waitForTimeout(500);
		await page.$$eval(
			'.components-modal__screen-overlay .components-modal__content .maxi-cloud-container .ais-InfiniteHits-list button',
			button => button[0].click()
		);

		const BlockAttributes = await getBlockAttributes();
		const icon = BlockAttributes['icon-content'];

		expect(icon).toMatchSnapshot();

		// size, spacing
		const inputs = await accordionPanel.$$(
			'.maxi-advanced-number-control .maxi-base-control__field input'
		);

		// size
		await inputs[0].click();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('40');

		const expectSize = 40;
		const sizeAttributes = await getBlockAttributes();
		const size = sizeAttributes['icon-size'];

		expect(size).toStrictEqual(expectSize);

		// spacing
		await inputs[2].click();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('10');

		const expectSpacing = 10;
		const spacingAttributes = await getBlockAttributes();
		const spacing = spacingAttributes['icon-spacing'];

		expect(spacing).toStrictEqual(expectSpacing);

		// icon position
		const label = await accordionPanel.$$(
			'.maxi-fancy-radio-control .maxi-radio-control__option label'
		);

		await label[1].click();
		const expectPosition = 'left';
		const positionAttributes = await getBlockAttributes();
		const position = positionAttributes['icon-position'];

		expect(position).toStrictEqual(expectPosition);

		// Icon Color
		await label[2];
		const paletteColor = await accordionPanel.$$(
			'.maxi-color-palette-control .maxi-base-control__field .maxi-sc-color-palette div'
		);

		await paletteColor[3].click();
		const expectColor = 4;
		const colorAttributes = await getBlockAttributes();
		const color = colorAttributes['icon-palette-color'];

		expect(color).toStrictEqual(expectColor);

		// Icon Border
		await label[5].click();

		await accordionPanel.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[2].click()
		);

		await paletteColor[4].click();

		// expects
		const expectBorder = 'dashed';
		const borderAttributes = await getBlockAttributes();
		const border = borderAttributes['icon-border-style-general'];

		expect(border).toStrictEqual(expectBorder);

		const expectBorderColor = 5;
		const borderColorAttributes = await getBlockAttributes();
		const borderColor =
			borderColorAttributes['icon-border-palette-color-general'];

		expect(borderColor).toStrictEqual(expectBorderColor);
	});
});
