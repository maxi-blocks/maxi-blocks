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

describe('IconControl', () => {
	it('Check Icon Control', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		const accordionPanel = await openSidebar(page, 'icon');

		await accordionPanel.$eval('.maxi-icon-control button', addIcon =>
			addIcon.click()
		);

		// select icon
		await page.waitForSelector('.maxi-library-modal');
		const modal = await page.$('.maxi-library-modal');
		await page.waitForSelector('.ais-SearchBox-input');
		const modalSearcher = await modal.$('.ais-SearchBox-input');
		await modalSearcher.focus();
		await page.keyboard.type('Sword');
		await page.waitForTimeout(1000);
		await page.waitForSelector('.maxi-cloud-masonry-card__button');
		await modal.$eval('.maxi-cloud-masonry-card__button', button =>
			button.click()
		);

		const icon = await getBlockAttributes();
		expect(icon['icon-content']).toMatchSnapshot();

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
		const { 'icon-position': position } = await getBlockAttributes();

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

		// expects
		const expectBorder = 'dashed';
		const borderAttributes = await getBlockAttributes();
		const border = borderAttributes['icon-border-style-general'];

		expect(border).toStrictEqual(expectBorder);
	});
});
