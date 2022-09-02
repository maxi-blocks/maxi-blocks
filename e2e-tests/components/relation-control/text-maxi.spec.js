/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	editColorControl,
	getAttributes,
	addTypographyOptions,
	addTypographyStyle,
	openPreviewPage,
} from '../../utils';

describe('Text Maxi hover simple actions', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		await page.keyboard.type('Testing IB');

		await insertBlock('Button Maxi');

		await openSidebarTab(page, 'advanced', 'interaction builder');

		await page.waitForSelector('.maxi-relation-control__button');
		await page.$eval('.maxi-relation-control__button', el => el.click());

		const textControls = await page.$$('.maxi-text-control__input');
		await textControls[1].focus();

		await page.keyboard.type('Test');

		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[1].select('text-maxi-1');

		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[2].select('hover');
	});

	const checkFrontend = async () => {
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		await previewPage.waitForSelector(
			'#button-maxi-1 .maxi-button-block__button'
		);
		await previewPage.hover('#button-maxi-1 .maxi-button-block__button');
		await previewPage.waitForTimeout(150);

		await previewPage.waitForSelector('#maxi-blocks-interaction-css');
		const interactionCSS = await previewPage.$eval(
			'#maxi-blocks-interaction-css',
			el => el.textContent
		);

		expect(interactionCSS).toMatchSnapshot();
	};

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

		await page.waitForTimeout(200);

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});

	it('Typography', async () => {
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('Typography');

		await page.$eval(
			'.maxi-typography-control .maxi-typography-control__font-family',
			input => input.click()
		);
		await page.keyboard.type('montserrat');
		await page.keyboard.press('Enter');

		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 50,
		});

		await addTypographyOptions({
			page,
			instance: await page.$('.maxi-typography-control'),
			size: 11,
			lineHeight: 22,
			letterSpacing: 33,
		});

		await addTypographyStyle({
			page,
			instance: await page.$('.maxi-typography-control'),
			decoration: 'overline',
			weight: 800,
			transform: 'capitalize',
			style: 'italic',
			orientation: 'mixed',
			indent: 11,
		});

		await page.waitForTimeout(200);

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});
});
