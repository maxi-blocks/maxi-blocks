/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockStyle, openSidebarTab, getAttributes } from '../../utils';

describe('Video options control', () => {
	it('Check video options control', async () => {
		await createNewPost();
		await insertBlock('Video Maxi');

		await openSidebarTab(page, 'style', 'video options');

		// Add start time
		await page.$eval('.maxi-video-options-control__autoplay input', input =>
			input.click()
		);

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

		expect(await getBlockStyle(page)).toMatchSnapshot();
		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
