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
import { getStyleCardEditor, receiveSelectedMaxiStyleCard } from '../../utils';

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

	// To ensure we always select the same SC search it by name (hopefully it doesn't change)
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

const copySCtoEdit = async newName => {
	// Click Customize Card button
	await page.$eval('.maxi-style-cards-customise-card-button', button =>
		button.click()
	);

	// Input the new SC name
	await page.$eval('.maxi-style-cards__sc__save > input', input =>
		input.focus()
	);
	await page.keyboard.type(newName);
	await page.$eval(
		'.maxi-style-cards__sc__save > button:nth-child(2)',
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

		await addMoreSC();

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

	it('Can copy a style card to edit it', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'divider',
		});

		await addMoreSC();

		await copySCtoEdit('copy');

		const {
			value: { name: SCName },
		} = await receiveSelectedMaxiStyleCard(page);

		expect(SCName).toContain('Daemon - copy');
	});

	it('Applies SC on all pages', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		await addMoreSC();

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
		await addMoreSC();

		await copySCtoEdit('copy 2');

		const SCToDelete = await page.$eval(
			'.maxi-style-cards__sc__more-sc--select select',
			selector => selector.value
		);

		await page.$eval('.maxi-style-cards__sc__more-sc--delete', button =>
			button.click()
		);

		await page.$eval(
			'.maxi-dialog-box-buttons button:nth-child(2)',
			button => button.click()
		);

		expect(
			Array.from(
				await page.$$eval(
					'.maxi-style-cards__sc__more-sc--select select option',
					options => options.map(option => option.value)
				)
			)
		).not.toContain(SCToDelete);

		// Check if SC is deleted on all pages
		await createNewPost();
		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		expect(
			Array.from(
				await page.$$eval(
					'.maxi-style-cards__sc__more-sc--select select option',
					options => options.map(option => option.value)
				)
			)
		).not.toContain(SCToDelete);
	});

	it('Can export/import style cards', async () => {
		await createNewPost();
		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		await addMoreSC('Wally');

		await copySCtoEdit('copy 3');

		const {
			value: { name },
		} = await receiveSelectedMaxiStyleCard(page);

		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('106D3C');

		await page.$eval('.maxi-style-cards__sc__actions--apply', button =>
			button.click()
		);

		await page.$eval(
			'.maxi-dialog-box-buttons button:nth-child(2)',
			button => button.click()
		);

		// Export
		const fileName = `${name}_exported.txt`;
		const downloadFolder = path.join(__dirname, './SC-downloads');

		await page._client.send('Page.setDownloadBehavior', {
			behavior: 'allow',
			downloadPath: downloadFolder,
		});

		await page.$eval('.maxi-style-cards__sc__ie--export', button =>
			button.click()
		);

		await page.waitForTimeout(150);

		// Import
		await page.$eval('.maxi-style-cards__sc__ie--import', button =>
			button.click()
		);

		const uploader = await page.$('.media-frame input[type=file]');

		uploader.uploadFile(path.join(downloadFolder, fileName));

		await page.waitForTimeout(150);

		await page.$eval(
			'.media-frame-toolbar .media-toolbar-primary button',
			button => button.click()
		);

		// Delete downloadFolder once we don't need it, before assertion to make sure it is deleted in cases when test fails.
		fs.rmSync(downloadFolder, { recursive: true });

		await page.waitForTimeout(150);

		const {
			value: { name: newName },
		} = await receiveSelectedMaxiStyleCard(page);

		expect(newName).toStrictEqual(`${name} exported`);
	});
});
