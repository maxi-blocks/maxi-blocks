/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setBrowserViewport,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

import {
	checkSCResult,
	getStyleCardEditor,
	receiveSelectedMaxiStyleCard,
} from '../../utils';

import path from 'path';
import fs from 'fs';

/**
 * Searches given title in SC modal, and selects first SC found
 */
const addMoreSC = async (page, title = 'Daemon') => {
	// Open SC modal
	await page.$eval('.maxi-style-cards__sc__more-sc--add-more', button =>
		button.click()
	);

	// To ensure we always select the same SC search it by name(hopefully it doesn't change)
	await page.$eval(
		'.maxi-cloud-container .maxi-cloud-container__sc__sidebar .ais-SearchBox-input',
		input => input.focus()
	);

	await page.keyboard.type(title);

	await page.waitForSelector(
		'.maxi-cloud-container .maxi-cloud-container__sc__content-sc .ais-InfiniteHits-list .ais-InfiniteHits-item button'
	);

	await page.$eval(
		'.maxi-cloud-container .maxi-cloud-container__sc__content-sc .ais-InfiniteHits-list .ais-InfiniteHits-item button',
		button => button.click()
	);
};

describe('SC settings', () => {
	it('Can add style cards from library and switch them with select', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'divider',
		});

		await addMoreSC(page);

		// Check SC name, because key will be different every time
		const {
			value: { name },
		} = await receiveSelectedMaxiStyleCard(page);

		expect(name).toStrictEqual('Daemon');

		// Switch back to maxi default SC
		await page.select(
			'.maxi-style-cards__sc__more-sc--select select',
			'sc_maxi'
		);

		const { key } = await receiveSelectedMaxiStyleCard(page);

		expect(key).toStrictEqual('sc_maxi');
	});

	it('Applies SC on all pages', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		await addMoreSC(page);

		await page.$eval('.maxi-style-cards__sc__actions--apply', button =>
			button.click()
		);

		// Save value of colour on current page
		await page.$$eval(
			'.maxi-accordion-control__item__panel .maxi-style-cards__quick-color-presets .maxi-style-cards__quick-color-presets__box',
			buttons => buttons[3].click()
		);

		const firstColour = await page.$eval(
			'.maxi-style-cards-control__sc__color-4-light input',
			input => input.value
		);

		await createNewPost();
		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		// Get value of colour on new page
		await page.$$eval(
			'.maxi-accordion-control__item__panel .maxi-style-cards__quick-color-presets .maxi-style-cards__quick-color-presets__box',
			buttons => buttons[3].click()
		);

		const secondColour = await page.$eval(
			'.maxi-style-cards-control__sc__color-4-light input',
			input => input.value
		);

		expect(secondColour).toStrictEqual(firstColour);
	});

	it('Can reset SC styles to default', async () => {
		await createNewPost();
		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		// Change colour value
		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('106D3C');

		// Reset value
		await page.$eval('.maxi-style-cards__sc__more-sc--reset', button =>
			button.click()
		);

		// Style cards value should be empty
		expect(await checkSCResult(page)).toMatchObject({});
	});

	it('Can delete style card', async () => {
		await createNewPost();
		await getStyleCardEditor({
			page,
			accordion: 'color',
		});
		await addMoreSC(page);

		const SCToDelete = await page.$eval(
			'.maxi-style-cards__sc__more-sc--select select',
			selector => selector.value
		);

		await page.$eval('.maxi-style-cards__sc__more-sc--delete', button =>
			button.click()
		);

		expect(
			Array.from(
				await page.$$eval(
					'.maxi-style-cards__sc__more-sc--select select option',
					options => options.map(option => option.value)
				)
			)
		).not.toContain(SCToDelete);
	});

	it('Can add custom name for SC', async () => {
		await createNewPost();
		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		await page.$eval('.maxi-style-cards__sc__save input', input =>
			input.focus()
		);

		const customName = 'Custom name :)';

		await page.keyboard.type(customName);

		await page.$eval('.maxi-style-cards__sc__save button', button =>
			button.click()
		);

		const {
			value: { name: SCName },
		} = await receiveSelectedMaxiStyleCard(page);

		expect(SCName).toStrictEqual(customName);
	});

	it('Can export/import style cards', async () => {
		await createNewPost();
		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		// Change name and colour preset, and save
		await page.$eval('.maxi-style-cards__sc__save input', input =>
			input.focus()
		);

		const name = 'Random SC name';

		await page.keyboard.type(name);

		await page.$eval('.maxi-style-cards__sc__save button', button =>
			button.click()
		);

		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('106D3C');

		await page.$eval('.maxi-style-cards__sc__actions--apply', button =>
			button.click()
		);

		// Export
		const fileName = `${name}.txt`;
		const downloadFolder = path.join(__dirname, './SC-downloads');

		await page._client.send('Page.setDownloadBehavior', {
			behavior: 'allow',
			downloadPath: downloadFolder,
		});

		await page.$eval('.maxi-style-cards__sc__ie--export', button =>
			button.click()
		);

		// Switch to default SC
		await page.select(
			'.maxi-style-cards__sc__more-sc--select select',
			'sc_maxi'
		);

		await page.$eval('.maxi-style-cards__sc__actions--apply', button =>
			button.click()
		);

		// Import
		await page.$eval('.maxi-style-cards__sc__ie--import', button =>
			button.click()
		);

		const uploader = await page.$('.media-frame input[type=file]');

		uploader.uploadFile(path.join(downloadFolder, fileName));

		await page.waitForSelector(
			'.media-frame-toolbar .media-toolbar-primary button:not([disabled])'
		);

		await page.$eval(
			'.media-frame-toolbar .media-toolbar-primary button',
			button => button.click()
		);

		await page.waitForTimeout(150);

		const {
			value: { name: newName },
		} = await receiveSelectedMaxiStyleCard(page);

		expect(newName).toStrictEqual(name);

		// Delete download folder
		fs.rmSync(downloadFolder, { recursive: true });
	});
});
