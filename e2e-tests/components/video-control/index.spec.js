/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	openSidebarTab,
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Video maxi control', () => {
	it('Check video maxi control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Video Maxi');
		await updateAllBlockUniqueIds(page);

		// Needs time to load the YT/Vimeo API
		await page.waitForTimeout(1000);

		const accordionPanel = await openSidebarTab(page, 'style', 'video');

		// Change start time
		await accordionPanel.$eval('.maxi-video-start-time input', input =>
			input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('31', { delay: 350 });

		expect(await getAttributes('startTime')).toStrictEqual('31');

		// End time - must be >= start time (31), so we append '0' to make '310'
		await page.$eval('.maxi-video-end-time input', input => input.focus());

		await page.keyboard.press('End');

		await page.keyboard.type('10', { delay: 350 });

		expect(await getAttributes('endTime')).toStrictEqual('310');

		// Change aspect ratio
		const ratioSelector = await page.$('.maxi-video-control__ratio select');

		await ratioSelector.select('ar23');
		expect(await getAttributes('videoRatio')).toStrictEqual('ar23');

		// Change type
		await accordionPanel.$eval(
			'.maxi-video-control__player-type .maxi-tabs-control__button-popup',
			button => button.click()
		);
		expect(await getAttributes('playerType')).toStrictEqual('popup');

		// Change url
		await accordionPanel.$eval('.maxi-text-control input', input =>
			input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('https://youtu.be/mkggXE5e2yk', {
			delay: 350,
		});
		await page.waitForTimeout(150);

		expect(await getAttributes('url')).toStrictEqual(
			'https://youtu.be/mkggXE5e2yk'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
