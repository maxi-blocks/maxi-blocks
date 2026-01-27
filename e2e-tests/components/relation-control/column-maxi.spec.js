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
	openPreviewPage,
	getAttributes,
	insertMaxiBlock,
} from '../../utils';

describe('Column Maxi hover simple actions', () => {
	beforeEach(async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');

		await page.waitForTimeout(200);

		// Select one column
		await page.$$eval(
			'.maxi-row-block__template .maxi-row-block__template__button',
			rowButtons => rowButtons[0].click()
		);

		await page.waitForTimeout(200);

		await page.waitForSelector('.maxi-column-block');
		await page.evaluate(() => {
			// Get the client ID of the currently selected block
			const selectedBlockClientId = wp.data
				.select('core/block-editor')
				.getSelectedBlockClientId();

			// Check if a block is selected
			if (selectedBlockClientId) {
				// Get all inner blocks of the selected block
				const innerBlocks = wp.data
					.select('core/block-editor')
					.getBlocks(selectedBlockClientId);

				// Check if there are any inner blocks
				if (innerBlocks && innerBlocks.length > 0) {
					// Get the client ID of the first inner block
					const firstInnerBlockClientId = innerBlocks[0].clientId;

					// Set the new uniqueID value
					const newValue = 'column-maxi-1se8ef1z-u';

					// Update the first inner block's uniqueID attribute
					wp.data
						.dispatch('core/block-editor')
						.updateBlockAttributes(firstInnerBlockClientId, {
							uniqueID: newValue,
						});
				}
			}
		});

		await page.waitForTimeout(200);

		// Add native paragraph block
		await selectBlockByClientId(
			await page.$eval('.maxi-container-block', el =>
				el.getAttribute('data-block')
			)
		);
		await page.keyboard.press('Enter');

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
		await openSidebarTab(page, 'advanced', 'interaction builder');

		// Add interaction
		await page.waitForSelector('.maxi-relation-control__button');
		await page.$eval('.maxi-relation-control__button', el => el.click());

		// Add title
		const textControls = await page.$$('.maxi-text-control__input');
		await textControls[1].focus();
		await page.keyboard.type('Hello World!', { delay: 350 });
		await page.waitForTimeout(150);

		// Add target
		await page.waitForSelector('.maxi-block-select-control__trigger');
		await page.click('.maxi-block-select-control__trigger');
		await page.waitForSelector('.maxi-block-select-control__dropdown');
		await page.click(
			'.maxi-block-select-control__options li[value="column-maxi-1se8ef1z-u"]'
		);
		await page.waitForTimeout(200);

		// Add action
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[1].select('hover');
		await page.waitForTimeout(200);
	});

	const checkFrontend = async () => {
		await saveDraft();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		await previewPage.waitForSelector(
			'#button-maxi-1se8ef1z-u .maxi-button-block__button'
		);
		await previewPage.hover(
			'#button-maxi-1se8ef1z-u .maxi-button-block__button'
		);
		await previewPage.waitForTimeout(100);

		await previewPage.waitForSelector(
			'#relations--column-maxi-1se8ef1z-u-styles'
		);
		const stylesCSS = await previewPage.$eval(
			'#relations--column-maxi-1se8ef1z-u-styles',
			el => el.textContent
		);
		expect(stylesCSS).toMatchSnapshot();

		await previewPage.waitForSelector(
			'#relations--column-maxi-1se8ef1z-u-in-transitions'
		);
		const inTransitionsCSS = await previewPage.$eval(
			'#relations--column-maxi-1se8ef1z-u-in-transitions',
			el => el.textContent
		);
		expect(inTransitionsCSS).toMatchSnapshot();

		await previewPage.mouse.move(0, 0);

		await previewPage.waitForSelector(
			'#relations--column-maxi-1se8ef1z-u-out-transitions'
		);
		const outTransitionsCSS = await previewPage.$eval(
			'#relations--column-maxi-1se8ef1z-u-out-transitions',
			el => el.textContent
		);
		expect(outTransitionsCSS).toMatchSnapshot();
	};

	it('Column size', async () => {
		// Select setting
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[2].select('cs');
		await page.waitForTimeout(200);

		// Click on "On hover" tab
		const tabs = await page.$$(
			'.maxi-relation-control__interaction-tabs .maxi-tabs-control__button'
		);
		await tabs[1].click();
		await page.waitForTimeout(200);

		// Column size
		await page.waitForSelector(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value'
		);
		await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			el => el.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('50', { delay: 350 });

		// Vertical align
		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('space-between');

		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend();
	});
});
