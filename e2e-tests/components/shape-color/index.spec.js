/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('ShapeColor', () => {
	it('Checking the shape color', async () => {
		await createNewPost();
		await insertBlock('Shape Maxi');

		/* const shapeSelector = */ await page.$$eval(
			'.components-modal__screen-overlay .components-modal__content .maxi-cloud-container .ais-InfiniteHits-list button',
			button => button[1].click()
		);
		// await page.waitForTimeout(500);
		// await shapeSelector[0].click();

		const expectForm = await getBlockAttributes();
		expect(expectForm.shapeSVGData).toMatchSnapshot();

		/* const accordionPanel = await openSidebar(page, 'shape');

		// select form
		await accordionPanel.$$eval(
			'.maxi-library-modal__action-section button',
			click => click[1].click()
		);

		const expectForm = await getBlockAttributes();
		expect(expectForm.shapeSVGData).toMatchSnapshot();

		// shape color */
		/* await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-sc-color-palette div',
			colorPalette => colorPalette[3].click()
		);

		const expectedColor = 4;
		const attributes = await getBlockAttributes();
		const shapeColor = attributes['shape-palette-fill-color'];

		expect(shapeColor).toStrictEqual(expectedColor); */
	});
});
