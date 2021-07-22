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

describe('ShapeColor', () => {
	it('Checking the shape color', async () => {
		await createNewPost();
		await insertBlock('Shape Maxi');

		// searcher
		await page.$eval(
			'.components-modal__screen-overlay .components-modal__content .maxi-cloud-container .ais-SearchBox input',
			searcher => searcher.focus()
		);
		await page.keyboard.type('Anchor');

		await page.$eval(
			'.components-modal__screen-overlay .components-modal__content .maxi-cloud-container .ais-SearchBox button',
			searcherButton => searcherButton.click()
		);

		// select Shape
		await page.waitForTimeout(500);
		await page.$$eval(
			'.components-modal__screen-overlay .components-modal__content .maxi-cloud-container .ais-InfiniteHits-list button',
			button => button[0].click()
		);

		const expectForm = await getBlockAttributes();
		expect(expectForm.shapeSVGElement).toMatchSnapshot();

		// shape palette color
		const accordionPanel = await openSidebar(page, 'shape');
		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-sc-color-palette div',
			colorPalette => colorPalette[3].click()
		);

		const expectedColor = 4;
		const attributes = await getBlockAttributes();
		const shapeColor = attributes['shape-palette-fill-color'];

		expect(shapeColor).toStrictEqual(expectedColor);

		// shape custom color
		await accordionPanel.$$eval(
			'.maxi-sc-color-palette__custom label',
			customColor => customColor[1].click()
		);

		await accordionPanel.$eval('.maxi-color-control__color input', input =>
			input.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('0F0A09');

		await page.waitForTimeout(500);
		const expectedCustomColor = 'rgba(15,10,9,1)';
		const shapeAttributes = await getBlockAttributes();
		const shapeCustomColor = shapeAttributes['shape-fill-color'];

		expect(shapeCustomColor).toStrictEqual(expectedCustomColor);

		// Color Status
		const expectedColorStatus = false;
		const statusAttributes = await getBlockAttributes();
		const shapeColorStatus =
			statusAttributes['shape-palette-fill-color-status'];

		expect(shapeColorStatus).toStrictEqual(expectedColorStatus);
	});
});
