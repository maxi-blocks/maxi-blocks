import { addImageToLibrary } from './addImageToLibrary';

const addImageToImageMaxi = async (page, instance) => {
	await addImageToLibrary(page);

	// Select the block
	await instance.click();

	// Click the "Add image" button
	await page.waitForSelector('.maxi-image-block__settings__upload-button');
	await page.click('.maxi-image-block__settings__upload-button');

	// There's an error with one WP dependency that causes the media library to
	// not load. This is a workaround.
	try {
		// Set 'Media Library' tab
		await page.waitForSelector('#menu-item-browse');
		await page.click('#menu-item-browse');
	} catch (error) {
		await page.keyboard.press('Escape');
		await page.waitForTimeout(500);

		await page.waitForSelector(
			'.maxi-image-block__settings__upload-button'
		);
		await page.click('.maxi-image-block__settings__upload-button');

		// Set 'Media Library' tab
		await page.waitForSelector('#menu-item-browse');
		await page.click('#menu-item-browse');
	}

	// Select the image
	await page.waitForSelector('.thumbnail');
	await page.click('.thumbnail');

	await page.click('.media-button-select');
};

export default addImageToImageMaxi;
