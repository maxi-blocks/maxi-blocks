/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	addImageToImageMaxi,
	getAttributes,
} from '../../utils';

describe('Image Maxi hover simple actions', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const imageBlock = await page.$('.maxi-image-block');
		await addImageToImageMaxi(page, imageBlock);

		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'advanced', 'interaction builder');

		// Add interaction
		await page.waitForSelector('.maxi-relation-control__button');
		await page.$eval('.maxi-relation-control__button', el => el.click());

		// Add title
		const textControls = await page.$$('.maxi-text-control__input');
		await textControls[1].focus();
		await page.keyboard.type('Hello World!');

		// Add target
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[1].select('image-maxi-1');

		// Add action
		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[2].select('hover');
	});

	it('Alignment', async () => {
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('Alignment');

		await page.$$eval('.maxi-tabs-control', tabs =>
			tabs[2]
				.querySelector(
					'.maxi-tabs-control__button.maxi-tabs-control__button-right'
				)
				.click()
		);
		expect(await getAttributes('relations')).toMatchSnapshot();
	});

	// TODO: shape mask (need)
});
