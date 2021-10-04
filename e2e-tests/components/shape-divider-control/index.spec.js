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
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('ShapeDividerControl', () => {
	it('Checking the shape divider control', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', select => select.focus());
		const accordionPanel = await openAdvancedSidebar(page, 'shape divider');

		await accordionPanel.$eval(
			'.maxi-shapedividercontrol .maxi-toggle-switch.shape-divider-top-status .maxi-base-control__label',
			click => click.click()
		);

		const expectedTopStatus = true;
		const attributes = await getBlockAttributes();
		const shapeTopStatus = attributes['shape-divider-top-status'];

		expect(shapeTopStatus).toStrictEqual(expectedTopStatus);

		// effects
		await accordionPanel.$eval(
			'.maxi-shapedividercontrol .maxi-toggle-switch.shape-divider-top-effects-status .maxi-base-control__label',
			click => click.click()
		);

		const expectedTopEffectStatus = true;
		const shapeAttributes = await getBlockAttributes();
		const effectTopStatus =
			shapeAttributes['shape-divider-top-effects-status'];

		expect(effectTopStatus).toStrictEqual(expectedTopEffectStatus);

		// divider style
		await accordionPanel.$eval(
			'.maxi-dropdown.maxi-shapedividercontrol__shape-selector div',
			modal => modal.click()
		);

		await page.$$eval(
			'.maxi-shapedividercontrol__shape-list label',
			click => click[1].click()
		);

		const shapeStyle = 'waves-top';
		const shapeStyleAttribute = await getBlockAttributes();
		const style = shapeStyleAttribute['shape-divider-top-shape-style'];

		expect(style).toStrictEqual(shapeStyle);

		// opacity
		await accordionPanel.$eval(
			'.maxi-advanced-number-control input',
			opacity => opacity.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		const expectedOpacity = 0.5;
		const shapeOpacityAttribute = await getBlockAttributes();
		const shapeOpacity = shapeOpacityAttribute['shape-divider-top-opacity'];

		expect(shapeOpacity).toStrictEqual(expectedOpacity);

		// color
		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-sc-color-palette div',
			selectColor => selectColor[3].click()
		);

		const expectedShapeColor = 4;
		const shapeColorAttribute = await getBlockAttributes();
		const shapeColor =
			shapeColorAttribute['shape-divider-palette-top-color'];

		expect(shapeColor).toStrictEqual(expectedShapeColor);

		// divider height
		await accordionPanel.$$eval(
			'.maxi-shapedividercontrol .maxi-advanced-number-control input',
			input => input[2].focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('200');

		const expectedTopHeight = 200;
		const shapeHeightAttribute = await getBlockAttributes();
		const shapeTopHeight = shapeHeightAttribute['shape-divider-top-height'];

		expect(shapeTopHeight).toStrictEqual(expectedTopHeight);
	});
});
