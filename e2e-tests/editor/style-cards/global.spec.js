/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setBrowserViewport,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	copySCToEdit,
	getStyleCardEditor,
	receiveSelectedMaxiStyleCard,
} from '../../utils';

/**
 * External dependencies
 */
import path from 'path';
import fs from 'fs';

/**
 * Searches given title in SC modal, and selects first SC found
 */
const addMoreSC = async (title = 'Daemon') => {
	// Open SC modal
	await page.$eval('.maxi-style-cards__sc__more-sc--add-more', button =>
		button.click()
	);

	await page.waitForTimeout(1000);

	// To ensure we always select the same SC search it by name (hopefully it doesn't change)
	await page.$eval(
		'.maxi-cloud-container .maxi-cloud-container__sc__sidebar .ais-SearchBox-input',
		input => input.focus()
	);

	await page.waitForTimeout(500);
	await page.keyboard.type(title);
	await page.waitForTimeout(500);

	await page.waitForSelector(
		'.maxi-cloud-container .maxi-cloud-container__sc__content-sc .ais-InfiniteHits-list .ais-InfiniteHits-item button'
	);
	await page.$eval(
		'.maxi-cloud-container .maxi-cloud-container__sc__content-sc .ais-InfiniteHits-list .ais-InfiniteHits-item button',
		button => button.click()
	);
	await page.waitForTimeout(500);
};

const switchSC = async (title = 'Template: Daemon') => {
	await page.$eval('.maxi-style-cards__sc__more-sc--select input', input =>
		input.focus()
	);

	await page.keyboard.type(title);
	await page.keyboard.press('Enter');
	await page.waitForTimeout(100);
};

describe('SC settings', () => {
	beforeAll(async () => {
		// Ensures clean SC
		await createNewPost();
		await page.evaluate(() =>
			wp.data.dispatch('maxiBlocks/style-cards').resetSC()
		);
	});

	afterAll(async () => {
		// let's reset the SCs for all other tests
		await page.evaluate(() => {
			wp.data.dispatch('maxiBlocks/style-cards').resetSC();
		});
	});

	it('Can copy a style card to edit it', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'divider',
		});

		await addMoreSC();
		const newName = `copy ${new Date().getTime()}`;
		await copySCToEdit(page, newName);

		const {
			value: { name: SCName },
		} = await receiveSelectedMaxiStyleCard(page);

		expect(SCName).toContain(`Daemon - ${newName}`);
	});

	it('Can add style cards from library and switch them with select', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'divider',
		});

		await addMoreSC();

		await page.waitForTimeout(350);

		// Check SC name, because key will be different every time
		const {
			value: { name },
		} = await receiveSelectedMaxiStyleCard(page);

		expect(name).toStrictEqual('Daemon');

		// Switch back to maxi default SC
		await switchSC('Maxi');

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

		await switchSC();

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

	it('Can delete style card', async () => {
		await createNewPost();
		await getStyleCardEditor({
			page,
			accordion: 'color',
		});
		await switchSC();

		await copySCToEdit(page, `copy 2 ${new Date().getTime()}`);

		await page.$eval('.maxi-style-cards__sc__more-sc--delete', button =>
			button.click()
		);

		await page.waitForSelector(
			'.maxi-dialog-box__buttons button:nth-child(2)'
		);
		await page.$eval(
			'.maxi-dialog-box__buttons button:nth-child(2)',
			button => button.click()
		);

		await page.$eval(
			'.maxi-style-cards__sc__more-sc--select input',
			input => input.focus()
		);

		await page.keyboard.type('Daemon - copy 2', { delay: 350 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		const { key } = await receiveSelectedMaxiStyleCard(page);

		expect(key).toStrictEqual('sc_maxi');
	});

	it('Can export/import style cards', async () => {
		await createNewPost();
		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		await switchSC();

		await copySCToEdit(page, `copy 3 ${new Date().getTime()}`);

		const {
			value: { name },
		} = await receiveSelectedMaxiStyleCard(page);

		await page.waitForSelector(
			'.maxi-color-control .maxi-color-control__color input'
		);
		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('106D3C', { delay: 350 });

		await page.waitForSelector('.maxi-style-cards__sc__actions--apply');
		await page.$eval('.maxi-style-cards__sc__actions--apply', button =>
			button.click()
		);

		await page.waitForSelector(
			'.maxi-dialog-box__buttons button:nth-child(2)'
		);
		await page.$eval(
			'.maxi-dialog-box__buttons button:nth-child(2)',
			button => button.click()
		);

		// Export
		const fileName = `${name}_exported.txt`;
		const downloadFolder = path.join(__dirname, './SC-downloads');

		await page._client.send('Page.setDownloadBehavior', {
			behavior: 'allow',
			downloadPath: downloadFolder,
		});

		await page.waitForSelector('.maxi-style-cards__sc__ie--export');
		await page.$eval('.maxi-style-cards__sc__ie--export', button =>
			button.click()
		);

		await page.waitForTimeout(150);

		// Import
		await page.waitForSelector('.maxi-style-cards__sc__ie--import');
		await page.$eval('.maxi-style-cards__sc__ie--import', button =>
			button.click()
		);

		const uploader = await page.$('.media-frame input[type=file]');

		uploader.uploadFile(path.join(downloadFolder, fileName));

		await page.waitForTimeout(150);

		await page.waitForSelector(
			'.media-frame-toolbar .media-toolbar-primary button:not([disabled])'
		);
		await page.$eval(
			'.media-frame-toolbar .media-toolbar-primary button',
			button => button.click()
		);

		// Delete downloadFolder once we don't need it, before assertion to make sure it is deleted in cases when test fails.
		fs.rmSync(downloadFolder, { recursive: true });

		await page.waitForTimeout(500);

		const {
			value: { name: newName },
		} = await receiveSelectedMaxiStyleCard(page);

		await page.waitForSelector(
			'.maxi-style-cards__sc__more-sc--delete:not([disabled])'
		);
		await page.$eval('.maxi-style-cards__sc__more-sc--delete', button =>
			button.click()
		);

		await page.waitForSelector(
			'.maxi-dialog-box__buttons button:nth-child(2)'
		);
		await page.$eval(
			'.maxi-dialog-box__buttons button:nth-child(2)',
			button => button.click()
		);

		// let's reset the SCs for all other tests
		await page.evaluate(() => {
			wp.data.dispatch('maxiBlocks/style-cards').resetSC();
		});

		expect(newName).toStrictEqual(`${name} exported`);
	});
});
