/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getStyleCardEditor, checkSCResult, copySCToEdit } from '../../utils';

describe('SC svg icon', () => {
	it('Checking svg icon accordion', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'SVG',
		});
		await copySCToEdit(page, `copy - ${Date.now()}`);

		// Global Line Colour
		await page.$eval(
			'.maxi-blocks-sc__type--SVG .maxi-style-cards-control__toggle-line-color-global input',
			button => button.click()
		);

		await page.$$eval(
			'.maxi-color-control__palette .maxi-color-control__palette-container button',
			button => button[4].click()
		);

		// Global Fill Colour
		await page.$eval(
			'.maxi-blocks-sc__type--SVG .maxi-style-cards-control__toggle-fill-color-global input',
			button => button.click()
		);

		await page.$$eval(
			'.maxi-color-control__palette .maxi-color-control__palette-container button',
			button => button[4].click()
		);

		expect(await checkSCResult(page)).toMatchSnapshot();
	});
});
