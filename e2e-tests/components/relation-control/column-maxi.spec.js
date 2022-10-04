/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
	selectBlockByClientId,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, openPreviewPage, getAttributes } from '../../utils';

describe('Column Maxi hover simple actions', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

		// Select one column
		await page.$$eval(
			'.maxi-row-block__template .maxi-row-block__template__button',
			rowButtons => rowButtons[0].click()
		);

		// Add native paragraph block
		await selectBlockByClientId(
			await page.$eval('.maxi-container-block', el =>
				el.getAttribute('data-block')
			)
		);
		await page.keyboard.press('Enter');

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
		await selectControls[1].select('column-maxi-1');

		// Add action
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
		await previewPage.waitForTimeout(100);

		await previewPage.waitForSelector('#relations--column-maxi-1-styles');
		const stylesCSS = await previewPage.$eval(
			'#relations--column-maxi-1-styles',
			el => el.textContent
		);
		expect(stylesCSS).toMatchSnapshot();

		await previewPage.waitForSelector(
			'#relations--column-maxi-1-transitions'
		);
		const transitionsCSS = await previewPage.$eval(
			'#relations--column-maxi-1-transitions',
			el => el.textContent
		);
		expect(transitionsCSS).toMatchSnapshot();
	};

	it('Column size', async () => {
		// Select setting
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('Column settings');

		// Column size
		await page.waitForSelector(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value'
		);
		await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			el => el.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('50');

		// Vertical align
		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[4].select('space-between');

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});
});
