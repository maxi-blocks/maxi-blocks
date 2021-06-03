/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	setBrowserViewport,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openSidebar } from '../../utils';

describe('background displayer control', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebar(page, 'background');
	});
	// background color
	it('Checks Color background settings', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .components-base-control__field input',
			select => select[1].click()
		);
		await accordionPanel.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			select => select.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('FAFA03');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(1000);

		const colorAttributes = await getBlockAttributes();
		const result = colorAttributes['background-color'];
		const expectedColor = 'rgba(250,250,3,1)';

		expect(result).toStrictEqual(expectedColor);
	});

	// it('Checks Image background settings');

	// background video
	it('Checks background video', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .components-base-control__field input',
			select => select[3].click()
		);

		const inputs = await accordionPanel.$$(
			'.maxi-background-control__video .components-base-control__field input'
		);

		const [insertUrl, startTime, endTime] = inputs;
		const VideoUrl = 'https://youtu.be/hM7Eh0gGNKA';

		// insert URL
		await insertUrl.focus();
		await page.keyboard.type(VideoUrl);
		await page.keyboard.press('Enter');

		// start Time
		await startTime.focus();
		await page.keyboard.type('1');
		await page.keyboard.press('Enter');

		// end time
		await endTime.focus();
		await page.keyboard.type('3');
		await page.keyboard.press('Enter');

		const expectVideo = await getBlockAttributes();

		expect(expectVideo['background-video-mediaURL']).toStrictEqual(
			VideoUrl
		);

		await accordionPanel.$$eval(
			'.maxi-background-control__video .maxi-fancy-radio-control label', /// //////////////////////
			select => {
				select[2].click(); // loop
				select[5].click(); // Play on mobile
			}
		);
		const expectAttribute = await getBlockAttributes();
		const backgroundSettings = 'video';

		expect(expectAttribute['background-active-media']).toStrictEqual(
			backgroundSettings
		);
	});
	// Gradient background
	it('Checks Gradient background settings', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await setBrowserViewport('large');

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .components-base-control__field input',
			select => select[4].click()
		);

		const { x, y } = await page.$eval(
			'.maxi-background-control .components-custom-gradient-picker__gradient-bar',
			gradientBar => {
				const { x, y, width, height } =
					gradientBar.getBoundingClientRect();

				const xPos = x + width / 2;
				const yPos = y + height / 2;

				return { x: xPos, y: yPos };
			}
		);

		await page.mouse.click(x, y, { delay: 1000 });
		await page.waitForSelector(
			'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover'
		);

		// Revisar
		await page.$eval(
			'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover .components-color-picker__inputs-fields input',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('24a319');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(1000);

		const expectGradient =
			'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(36,163,25) 49%,rgb(155,81,224) 100%)';
		const expectAttribute = await getBlockAttributes();

		expect(expectAttribute['background-gradient']).toStrictEqual(
			expectGradient
		);
	});
	// shape background
	it('Checks Shape background settings', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .components-base-control__field input',
			select => select[5].click()
		);

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-svg-defaults button',
			click => click[1].click()
		);
		const expectShape =
			'<svg xml:space="preserve" viewBox="0 0 36.1 36.1" version="1.1" y="0" x="0" xmlns="http://www.w3.org/2000/svg" data-item="group-maxi-12__svg"><g><path d="M24.5 7.8c-2.1-1.3-4.4-2.2-6.9-2.8-2.4-.6-4.8-.9-7.1-.7-2.4.1-4.4.7-6 1.6-1.8 1-3 2.4-3.7 4.1-.3.8-.4 1.7-.2 2.6.1.7.4 1.5.9 2.4.3.5.8 1.4 1.5 2.4.6 1 1 1.8 1.2 2.5.2.7.3 1.6.3 2.7 0 .6-.1 1.6-.1 2.9 0 1.1.2 2.1.5 2.8.4 1 1.1 1.8 2.1 2.4 1.2.8 2.4 1.1 3.7 1.1.9 0 2-.3 3.5-.8 1.8-.6 3-1 3.7-1.1 1.5-.3 2.9-.3 4.4.1 3.2.8 5.7 1.1 7.5.9 2.5-.2 4.2-1.2 5.1-3.1.7-1.3.9-2.8.7-4.6-.2-1.7-.8-3.6-1.7-5.5-1-2-2.2-3.8-3.8-5.5-1.7-1.8-3.6-3.2-5.6-4.4z" fill=""></path></g></svg>';
		const attributes = await getBlockAttributes();

		expect(
			attributes['background-svg-SVGElement']
				.replace(/(\r\n|\n|\r)/g, '')
				.replace(/\s/g, '')
		).toEqual(expectShape.replace(/(\r\n|\n|\r)/g, '').replace(/\s/g, ''));
	});
	// it('Checks Layers background settings');
});
