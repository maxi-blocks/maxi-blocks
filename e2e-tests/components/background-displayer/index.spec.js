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
import { getBlockAttributes, openSidebar } from '../../utils';

describe('BackgroundControl', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
	});
	it('Check Background Color', async () => {
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-background-control .maxi-base-control__field label',
			select => select[5].click()
		);

		const backgroundColor = await page.$eval(
			'.maxi-background-displayer',
			expect => expect.innerHTML
		);

		expect(backgroundColor).toMatchSnapshot();
	});

	it('Check Background Image', async () => {
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
			select => select[2].click()
		);

		const backgroundImage = await page.$eval(
			'.maxi-background-displayer',
			expect => expect.innerHTML
		);

		expect(backgroundImage).toMatchSnapshot();
	});

	it('Check Background Video', async () => {
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
			select => select[3].click()
		);

		// insert URL
		const VideoUrl = 'https://youtu.be/hM7Eh0gGNKA';

		await accordionPanel.$eval(
			'.maxi-tabs-content .maxi-background-control__video .maxi-text-control input',
			url => url.focus()
		);
		await page.keyboard.type(VideoUrl);
		await page.keyboard.press('Enter');

		const inputs = await accordionPanel.$$(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-advanced-number-control .maxi-base-control__field input'
		);

		// start Time
		await inputs[2].focus();
		await page.keyboard.type('1');
		await page.keyboard.press('Enter');

		// end time
		await inputs[4].focus();
		await page.keyboard.type('3');
		await page.keyboard.press('Enter');

		await accordionPanel.$$eval(
			'.maxi-background-control__video .maxi-fancy-radio-control label',
			select => {
				select[2].click(); // loop
				select[5].click(); // Play on mobile
			}
		);

		const backgroundVideo = await page.$eval(
			'.maxi-background-displayer',
			expect => expect.innerHTML
		);

		expect(backgroundVideo).toMatchSnapshot();
	});
	it('Check Background Gradient', async () => {
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
			select => select[4].click()
		);

		const backgroundGradient = await page.$eval(
			'.maxi-background-displayer',
			expect => expect.innerHTML
		);

		expect(backgroundGradient).toMatchSnapshot();
	});
	it('Check BackgroundShape', async () => {
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
			select => select[5].click()
		);

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-svg-defaults button',
			click => click[1].click()
		);

		const backgroundShape = await page.$eval(
			'.maxi-background-displayer',
			expect => expect.innerHTML
		);

		expect(backgroundShape).toMatchSnapshot();
	});
	it('Check Background Layers', async () => {
		const accordionPanel = await openSidebar(page, 'background');

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

		// add all layers
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

		await selectLayer.select('shape');
		await addNewLayer.click();
		await accordionPanel.$$eval(
			'.maxi-background-layers_options .maxi-background-layer span',
			select => select[50].click()
		);

		await accordionPanel.$$eval('.maxi-svg-defaults button', select =>
			select[2].click()
		);

		const displayerLayers = await page.$eval(
			'.maxi-background-displayer',
			expect => expect.innerHTML
		);

		expect(displayerLayers).toMatchSnapshot();
	});
});
