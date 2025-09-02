/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyWithModifier,
	saveDraft,
} from '@wordpress/e2e-test-utils';

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

describe('Button Maxi hover simple actions', () => {
	const addInteraction = async () => {
		// Add interaction
		await page.waitForSelector('.maxi-relation-control__button');
		await page.$eval('.maxi-relation-control__button', el => el.click());

		// Add title
		await page.waitForTimeout(500);
		const textControls = await page.$$('.maxi-text-control__input');
		await textControls[1].focus();
		await page.keyboard.type('Hello World!', { delay: 350 });
		await page.waitForTimeout(150);

		// Add target
		let selectControls = await page.$$('.maxi-select-control__input');

		await selectControls[1].select('button-maxi-1se8ef1z-u');

		// Add action
		await page.waitForTimeout(500);
		selectControls = await page.$$('.maxi-select-control__input');

		await selectControls[2].select('hover');
	};

	beforeEach(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');

		await page.evaluate(() => {
			// Get the client ID of the currently selected block
			const clientId = wp.data
				.select('core/block-editor')
				.getSelectedBlockClientId();

			// Check if a block is selected
			if (clientId) {
				// Set the new uniqueID value
				const newValue = 'button-maxi-1se8ef1z-u';

				// Update the block's uniqueID attribute
				wp.data
					.dispatch('core/block-editor')
					.updateBlockAttributes(clientId, { uniqueID: newValue });
			}
		});

		// Add icon
		await openSidebarTab(page, 'style', 'quick styles');
		await page.$$eval('.maxi-default-styles-control__button', buttons =>
			buttons[3].click()
		);

		await insertMaxiBlock(page, 'Button Maxi');

		await page.evaluate(() => {
			// Get the client ID of the currently selected block
			const clientId = wp.data
				.select('core/block-editor')
				.getSelectedBlockClientId();

			// Check if a block is selected
			if (clientId) {
				// Set the new uniqueID value
				const newValue = 'button-maxi-2se8ef1z-u';

				// Update the block's uniqueID attribute
				wp.data
					.dispatch('core/block-editor')
					.updateBlockAttributes(clientId, { uniqueID: newValue });
			}
		});

		await openSidebarTab(page, 'advanced', 'interaction builder');

		await addInteraction();
	});

	const checkFrontend = async () => {
		await saveDraft();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		await previewPage.waitForSelector(
			'#button-maxi-2se8ef1z-u .maxi-button-block__button'
		);
		await previewPage.hover(
			'#button-maxi-2se8ef1z-u .maxi-button-block__button'
		);

		await previewPage.waitForSelector(
			'#relations--button-maxi-1se8ef1z-u-styles'
		);
		const stylesCSS = await previewPage.$eval(
			'#relations--button-maxi-1se8ef1z-u-styles',
			el => el.textContent
		);
		expect(stylesCSS).toMatchSnapshot();

		await previewPage.waitForSelector(
			'#relations--button-maxi-1se8ef1z-u-in-transitions'
		);
		const inTransitionsCSS = await previewPage.$eval(
			'#relations--button-maxi-1se8ef1z-u-in-transitions',
			el => el.textContent
		);
		expect(inTransitionsCSS).toMatchSnapshot();

		await previewPage.mouse.move(0, 0);

		await previewPage.waitForSelector(
			'#relations--button-maxi-1se8ef1z-u-out-transitions'
		);
		const outTransitionsCSS = await previewPage.$eval(
			'#relations--button-maxi-1se8ef1z-u-out-transitions',
			el => el.textContent
		);
		expect(outTransitionsCSS).toMatchSnapshot();
	};

	it('Button icon', async () => {
		// Select setting
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('bi');

		// Width
		await page.waitForTimeout(350);

		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[0].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('11', { delay: 350 });

		// console.log('after width');

		const ANCs = await page.$$(
			'.maxi-advanced-number-control .maxi-select-control__input'
		);
		await ANCs[0].select('%');

		// Stroke width
		await page.waitForTimeout(350);
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[1].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22', { delay: 350 });

		// console.log('before spacing');

		// Spacing
		await page.waitForTimeout(350);
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[2].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('33', { delay: 350 });

		// console.log('before Icon stroke color');

		// Icon stroke color
		let colorControls = await page.$$('.maxi-color-control');
		await editColorControl({
			page,
			instance: await colorControls[0],
			paletteStatus: true,
			colorPalette: 8,
			opacity: 50,
		});

		await page.waitForTimeout(300);

		// Icon background color
		colorControls = await page.$$('.maxi-color-control');
		await editColorControl({
			page,
			instance: await colorControls[1],
			paletteStatus: true,
			colorPalette: 5,
			opacity: 75,
		});

		await page.waitForTimeout(300);

		// console.log('before Icon padding');

		// Icon padding
		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[5].select('%');

		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[5].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44', { delay: 350 });

		// console.log('before toMatchSnapshot');

		expect(await getAttributes('relations')).toMatchSnapshot();

		// console.log('before checkFrontend');

		await checkFrontend();
	});

	it('Button typography', async () => {
		// Select setting
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('bty');

		// Change font family
		await page.$eval(
			'.maxi-typography-control .maxi-typography-control__font-family',
			input => input.click()
		);
		await page.keyboard.type('Montserrat', { delay: 350 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		// Change font color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 50,
		});

		await page.$eval(
			'.maxi-typography-control__advanced-toggle button.maxi-typography-control-button',
			click => click.click()
		);

		await page.waitForTimeout(200);

		await addTypographyOptions({
			page,
			instance: await page.$('.maxi-typography-control'),
			size: 24,
			lineHeight: 60,
			letterSpacing: 15,
		});

		await addTypographyStyle({
			page,
			instance: await page.$('.maxi-typography-control'),
			weight: 800,
			transform: 'capitalize',
			style: 'italic',
			decoration: 'underline',
			orientation: 'sideways',
			direction: 'rtl',
			indent: 20,
		});

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});

	it('Button border', async () => {
		// Select setting
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('bb');

		// Select first default
		await page.$$eval('.maxi-default-styles-control__button', buttons =>
			buttons[1].click()
		);

		// Border color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 50,
		});

		// Border width
		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[5].select('%');

		// Border radius
		await page.waitForTimeout(500);

		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[2].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('11', { delay: 350 });
		await page.waitForTimeout(500);

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});

	it('Button background', async () => {
		// Select setting
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('bbg');
		await page.waitForTimeout(350);

		// Background color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 50,
		});

		await page.waitForTimeout(350);

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});

	it('Button shadow', async () => {
		// Select setting
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('bbs');

		// Select first default
		await page.$$eval('.maxi-default-styles-control__button', buttons =>
			buttons[1].click()
		);

		// Shadow color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 11,
		});

		await page.waitForTimeout(500);

		// Shadow horizontal offset
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[1].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22', { delay: 350 });

		await page.waitForTimeout(500);

		// Shadow vertical offset
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[2].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('33', { delay: 350 });

		await page.waitForTimeout(500);

		// Shadow blur
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[3].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44', { delay: 350 });

		await page.waitForTimeout(500);

		// Shadow spread
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[4].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('55', { delay: 350 });

		await page.waitForTimeout(500);

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});

	it('Button margin/padding', async () => {
		// Select setting
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('bmp');

		await page.waitForTimeout(350);

		// Margin
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[0].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('1', { delay: 350 });

		await page.waitForTimeout(350);

		// Padding
		await page.$$eval('.maxi-tabs-control', tabs =>
			tabs[5]
				.querySelector(
					'.maxi-tabs-control__button.maxi-tabs-control__button-all'
				)
				.click()
		);

		await page.waitForTimeout(350);

		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[1].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('2', { delay: 350 });

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});

	it('Button background and shadow', async () => {
		// Select setting
		const backgroundSelectControls = await page.$$(
			'.maxi-select-control__input'
		);
		await backgroundSelectControls[3].select('bbg');
		await page.waitForTimeout(350);

		// Background color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 50,
		});
		await page.waitForTimeout(350);

		await addInteraction();

		// Select setting
		const shadowSelectControls = await page.$$(
			'.maxi-select-control__input'
		);
		await shadowSelectControls[3].select('bbs');
		await page.waitForTimeout(350);

		// Select first default
		await page.$$eval('.maxi-default-styles-control__button', buttons =>
			buttons[1].click()
		);

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});
});
