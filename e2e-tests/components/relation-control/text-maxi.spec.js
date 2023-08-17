/**
 * WordPress dependencies
 */
import { createNewPost, saveDraft } from '@wordpress/e2e-test-utils';

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
	insertMaxiBlock,
} from '../../utils';

describe('Text Maxi hover simple actions', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await page.keyboard.type('Testing IB');

		await insertMaxiBlock(page, 'Button Maxi');

		await openSidebarTab(page, 'advanced', 'interaction builder');

		await page.waitForSelector('.maxi-relation-control__button');
		await page.$eval('.maxi-relation-control__button', el => el.click());

		const textControls = await page.$$('.maxi-text-control__input');
		await textControls[1].focus();

		await page.keyboard.type('Test');
		await page.waitForTimeout(150);

		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[1].select('text-maxi-4se8ef1z-u');

		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[2].select('hover');
	});

	const checkFrontend = async (disableTransition = false) => {
		await saveDraft();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		// Not sure why, but needs to be reloaded 🤷
		await previewPage.reload();
		await previewPage.waitForSelector('.entry-content');

		await previewPage.waitForSelector(
			'#button-maxi-4se8ef1z-u .maxi-button-block__button'
		);
		await previewPage.hover(
			'#button-maxi-4se8ef1z-u .maxi-button-block__button'
		);

		await previewPage.waitForSelector(
			'#relations--text-maxi-4se8ef1z-u-styles'
		);
		const stylesCSS = await previewPage.$eval(
			'#relations--text-maxi-4se8ef1z-u-styles',
			el => el.textContent
		);
		expect(stylesCSS).toMatchSnapshot();

		if (!disableTransition) {
			await previewPage.waitForSelector(
				'#relations--text-maxi-4se8ef1z-u-in-transitions'
			);
			const inTransitionsCSS = await previewPage.$eval(
				'#relations--text-maxi-4se8ef1z-u-in-transitions',
				el => el.textContent
			);
			expect(inTransitionsCSS).toMatchSnapshot();

			await previewPage.mouse.move(0, 0);

			await previewPage.waitForSelector(
				'#relations--text-maxi-4se8ef1z-u-out-transitions'
			);
			const outTransitionsCSS = await previewPage.$eval(
				'#relations--text-maxi-4se8ef1z-u-out-transitions',
				el => el.textContent
			);
			expect(outTransitionsCSS).toMatchSnapshot();
		}
	};

	it('Alignment', async () => {
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('a');

		await page.$eval(
			'.maxi-alignment-control .maxi-tabs-control__button.maxi-tabs-control__button-right',
			button => button.click()
		);

		await page.waitForTimeout(200);

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend(true);
	});

	// Needs #3767 to be fixed
	it.skip('Typography', async () => {
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('ty');

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

		await page.waitForTimeout(1000);

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});
});
