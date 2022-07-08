/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockStyle, openSidebarTab, getAttributes } from '../../utils';

describe('Video maxi control', () => {
	it('Check video maxi control', async () => {
		await createNewPost();
		await insertBlock('Video Maxi');

		const accordionPanel = await openSidebarTab(page, 'style', 'video');

		// Change start time
		await page.$eval('.maxi-video-start-time input', input =>
			input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('31');

		expect(await getAttributes('startTime')).toStrictEqual('31');

		// End time
		await page.$eval('.maxi-video-end-time input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22');

		expect(await getAttributes('endTime')).toStrictEqual('22');

		// Change aspect ratio
		const ratioSelector = await page.$('.maxi-video-control__ratio select');

		await ratioSelector.select('ar23');
		expect(await getAttributes('videoRatio')).toStrictEqual('ar23');

		// Change type
		const videoType = await accordionPanel.$(
			'.maxi-accordion-control__item .maxi-accordion-control__item__panel .maxi-base-control select'
		);

		await videoType.select('popup');

		expect(await getAttributes('playerType')).toStrictEqual('popup');

		// Change url
		await accordionPanel.$eval('.maxi-text-control input', input =>
			input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('https://youtu.be/mkggXE5e2yk');

		expect(await getAttributes('url')).toStrictEqual(
			'https://youtu.be/mkggXE5e2yk'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
