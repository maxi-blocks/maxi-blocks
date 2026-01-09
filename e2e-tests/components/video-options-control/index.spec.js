/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	getEditedPostContent,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Video options control', () => {
	it('Check video options control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Video Maxi');
		await updateAllBlockUniqueIds(page);

		await openSidebarTab(page, 'style', 'video options');

		await page.waitForTimeout(300);

		// Add autoplay
		await page.$eval('.maxi-video-options-control__autoplay input', input =>
			input.click()
		);

		await page.waitForTimeout(300);

		expect(await getAttributes('isAutoplay')).toBeTruthy();

		// Add mute
		await page.$eval('.maxi-video-options-control__mute input', input =>
			input.click()
		);

		expect(await getAttributes('isMuted')).toBeTruthy();

		// Add Loop
		await page.$eval('.maxi-video-options-control__loop input', input =>
			input.click()
		);

		expect(await getAttributes('isLoop')).toBeTruthy();

		// Change player control
		await page.$eval(
			'.maxi-video-options-control__player-controls input',
			input => input.click()
		);

		expect(await getAttributes('showPlayerControls')).toStrictEqual(false);

		// Wait for iframe title to be set (YouTube iframe loads asynchronously)
		// Increase timeout for CI environments where network/resources are slower
		await page.waitForFunction(
			() => {
				const iframe = document.querySelector(
					'.maxi-video-block__video-player'
				);
				return (
					iframe && iframe.getAttribute('title') === 'video player'
				);
			},
			{ timeout: 15000 }
		);

		// Check video content
		const videoContent = await page.$eval(
			'.maxi-video-block__video-container',
			block => block.innerHTML
		);

		expect(videoContent).toMatchSnapshot();
		expect(await getEditedPostContent(page)).toMatchSnapshot();
	});
});
