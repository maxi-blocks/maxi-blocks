/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Interactive dependencies
 */
import { getBlockAttributes, openSidebarTab, modalMock } from '../../utils';
// this test will be corrected with the update of the background-control tests
describe('LoaderControl', () => {
	it('Check loader control', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'background'
		);

		// add color layer
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-background-control .maxi-base-control label',
			selectLayers => selectLayers[1].click()
		);

		const selectLayer = await accordionPanel.$(
			'.maxi-tabs-content .maxi-background-control .maxi-loader-control .maxi-base-control__field select'
		);

		const addNewLayer = await accordionPanel.$(
			'.maxi-tabs-content .maxi-background-control .maxi-loader-control button'
		);

		// add layers
		await selectLayer.select('color');
		await addNewLayer.click();

		await selectLayer.select('image');
		await addNewLayer.click();

		await selectLayer.select('video');
		await addNewLayer.click();
		await accordionPanel.$$eval(
			'.maxi-background-layers_options .maxi-background-layer span',
			select => select[12].click()
		);

		await page.$eval(
			'.maxi-background-layer__content .maxi-text-control input',
			select => select.focus()
		);
		await page.keyboard.type('https://youtu.be/hM7Eh0gGNKA');

		await selectLayer.select('gradient');
		await addNewLayer.click();

		debugger;
		await selectLayer.select('shape');
		await addNewLayer.click();
		await accordionPanel.$$eval(
			'.maxi-background-layers_options .maxi-background-layer span',
			select => select[24].click()
		);

		/* await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-library-modal__action-section__buttons button',
			click => click[0].click()
		); */

		await modalMock(page, { type: 'background-layers' });

		const expectBackgroundLayers = await getBlockAttributes();
		const allLayers = expectBackgroundLayers['background-layers'];

		expect(allLayers).toMatchSnapshot();
	});
});
