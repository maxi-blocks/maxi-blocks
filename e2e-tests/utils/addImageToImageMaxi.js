import { addImageToLibrary } from './addImageToLibrary';
import getEditorFrame from './getEditorFrame';

const addImageToImageMaxi = async (page, instance) => {
	await addImageToLibrary(page);

	// Select the block
	await instance.click();

	const frame = await getEditorFrame(page);

	// Click the "Add image" button
	await frame.waitForSelector('.maxi-image-block__settings__upload-button');
	await frame.click('.maxi-image-block__settings__upload-button');

	// There's an error with one WP dependency that causes the media library to
	// not load. This is a workaround.
	try {
		// Set 'Media Library' tab
		await page.waitForSelector('#menu-item-browse');
		await page.click('#menu-item-browse');
	} catch (error) {
		await page.keyboard.press('Escape');
		await page.waitForTimeout(500);

		await frame.waitForSelector(
			'.maxi-image-block__settings__upload-button'
		);
		await frame.click('.maxi-image-block__settings__upload-button');

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
