/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Interactive dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	addBackgroundLayer,
} from '../../utils';
// this test will be corrected with the update of the background-control tests
describe('LoaderControl', () => {
	it('Check loader control', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');
		await addBackgroundLayer(page, 'color');

		// change color
		await page.$$eval(
			'.maxi-background-layer__content .maxi-sc-color-palette__box',
			colorPalette => colorPalette[4].click()
		);
		// opacity
		await page.$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('45');
		// clip-path
		await page.$eval(
			'.maxi-clip-path-control .maxi-toggle-switch__toggle input',
			input => input.click()
		);
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[3].click()
		);

		const expectBackgroundLayers = await getBlockAttributes();
		const allLayers = expectBackgroundLayers['background-layers'];

		expect(allLayers).toMatchSnapshot();
	});
});
