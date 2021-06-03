/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openSidebar } from '../../utils';

describe('background displayer video', () => {
	it('Checks background video', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
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

		const expectAttribute = await getBlockAttributes();
		const expectVideo = expectAttribute['background-video-mediaURL'];

		expect(expectVideo).toStrictEqual(VideoUrl);

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
		const expectMediaAttribute = await getBlockAttributes();
		const expectMedia = expectMediaAttribute['background-active-media'];

		expect(expectMedia).toStrictEqual(backgroundSettings);
	});
});
