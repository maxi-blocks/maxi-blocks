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

describe('background displayer video', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('Checks background video', async () => {
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .components-base-control__field input',
			select => select[3].click()
		);

		const inputs = await accordionPanel.$$(
			'.maxi-background-control__video .components-base-control__field input'
		);

		const insertUrl = await inputs[0];
		const startTime = await inputs[1];
		const endTime = await inputs[2];

		// insert URL
		await insertUrl.focus();
		await page.keyboard.type('https://youtu.be/hM7Eh0gGNKA');
		await page.keyboard.press('Enter');

		// start Time
		await startTime.focus();
		await page.keyboard.type('1');
		await page.keyboard.press('Enter');

		// end time
		await endTime.focus();
		await page.keyboard.type('3');
		await page.keyboard.press('Enter');

		const VideoUrl = 'https://youtu.be/hM7Eh0gGNKA';
		const expectVideo = await getBlockAttributes();

		expect(expectVideo['background-video-mediaURL']).toStrictEqual(
			VideoUrl
		);

		// loop
		await accordionPanel.$$eval(
			'.maxi-background-control__video .maxi-fancy-radio-control label',
			select => select[2].click()
		);
		// Play on mobile
		await accordionPanel.$$eval(
			'.maxi-background-control__video .maxi-fancy-radio-control label',
			select => select[5].click()
		);

		const backgroundSettings = 'video';
		const expectAttribute = await getBlockAttributes();

		expect(expectAttribute['background-active-media']).toStrictEqual(
			backgroundSettings
		);
	});
});
