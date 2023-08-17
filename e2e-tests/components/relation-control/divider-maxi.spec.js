/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyWithModifier,
	selectBlockByClientId,
	saveDraft,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	editColorControl,
	getAttributes,
	openPreviewPage,
	insertMaxiBlock,
} from '../../utils';

describe('Divider Maxi hover simple actions', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');

		// Add native paragraph block
		await selectBlockByClientId(
			await page.$eval('.maxi-divider-block', el =>
				el.getAttribute('data-block')
			)
		);
		await page.keyboard.press('Enter');

		await insertMaxiBlock(page, 'Button Maxi');
		await openSidebarTab(page, 'advanced', 'interaction builder');

		// Add interaction
		await page.waitForSelector('.maxi-relation-control__button');
		await page.$eval('.maxi-relation-control__button', el => el.click());

		// Add title
		const textControls = await page.$$('.maxi-text-control__input');
		await textControls[1].focus();
		await page.keyboard.type('Hello World!');
		await page.waitForTimeout(150);

		// Add target
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[1].select('divider-maxi-4se8ef1z-u');

		// Add action
		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[2].select('hover');
	});

	const checkFrontend = async () => {
		await saveDraft();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		await previewPage.waitForSelector(
			'#button-maxi-4se8ef1z-u .maxi-button-block__button'
		);
		await previewPage.hover(
			'#button-maxi-4se8ef1z-u .maxi-button-block__button'
		);
		await previewPage.waitForTimeout(100);

		await previewPage.waitForSelector(
			'#relations--divider-maxi-4se8ef1z-u-styles'
		);
		const stylesCSS = await previewPage.$eval(
			'#relations--divider-maxi-4se8ef1z-u-styles',
			el => el.textContent
		);
		expect(stylesCSS).toMatchSnapshot();

		await previewPage.waitForSelector(
			'#relations--divider-maxi-4se8ef1z-u-in-transitions'
		);
		const inTransitionsCSS = await previewPage.$eval(
			'#relations--divider-maxi-4se8ef1z-u-in-transitions',
			el => el.textContent
		);
		expect(inTransitionsCSS).toMatchSnapshot();

		await previewPage.mouse.move(0, 0);

		await previewPage.waitForSelector(
			'#relations--divider-maxi-4se8ef1z-u-out-transitions'
		);
		const outTransitionsCSS = await previewPage.$eval(
			'#relations--divider-maxi-4se8ef1z-u-out-transitions',
			el => el.textContent
		);
		expect(outTransitionsCSS).toMatchSnapshot();
	};

	it('Divider shadow', async () => {
		// Select setting
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('dbs');

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

		// Shadow horizontal offset
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[1].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22');

		// Shadow vertical offset
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[2].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('33');

		// Shadow blur
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[3].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		// Shadow spread
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[4].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('55');

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});

	it('Line settings', async () => {
		// Select setting
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('dls');

		// Select second default
		await page.$$eval('.maxi-default-styles-control__button', buttons =>
			buttons[2].click()
		);

		// Line color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 50,
		});

		// Line size
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[1].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('11');

		// Line weight
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[2].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22');

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});
});
