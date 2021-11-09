/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
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
		const backgroundLayersColor = await getBlockAttributes();
		const colorLayers = backgroundLayersColor['background-layers'];
		expect(colorLayers).toMatchSnapshot();

		await addBackgroundLayer(page, 'image');
		const backgroundLayersImage = await getBlockAttributes();
		const imageLayers = backgroundLayersImage['background-layers'];
		expect(imageLayers).toMatchSnapshot();

		await addBackgroundLayer(page, 'video');
		const backgroundLayersVideo = await getBlockAttributes();
		const videoLayers = backgroundLayersVideo['background-layers'];
		expect(videoLayers).toMatchSnapshot();

		await addBackgroundLayer(page, 'gradient');
		const backgroundLayersGradient = await getBlockAttributes();
		const gradientLayers = backgroundLayersGradient['background-layers'];
		expect(gradientLayers).toMatchSnapshot();

		await addBackgroundLayer(page, 'shape');
		const backgroundLayersShape = await getBlockAttributes();
		const shapeLayers = backgroundLayersShape['background-layers'];
		expect(shapeLayers).toMatchSnapshot();
	});
});
