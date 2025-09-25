/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	editAxisControl,
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../../../utils';

describe('CopyPaste from Toolbar', () => {
	it('Should copy and paste bulk styles', async () => {
		// Mock console.error to ignore clipboard errors
		const consoleErrorSpy = jest.spyOn(console, 'error');
		consoleErrorSpy.mockImplementation(() => {});

		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit text maxi
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'position'
		);
		const selectPosition = await accordionPanel.$(
			'.maxi-position-control .maxi-base-control__field select'
		);
		await selectPosition.select('relative');

		await editAxisControl({
			page,
			instance: await page.$('.maxi-position-control .maxi-axis-control'),
			syncOption: 'all',
			values: '56',
			unit: '%',
		});

		await page.waitForTimeout(350);

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);

		// Wait for popover to be visible
		await page.waitForSelector(
			'.components-popover__content .toolbar-item__copy-paste__popover'
		);

		// select copy style
		await page.$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button.click()
		);

		await insertMaxiBlock(page, 'Text Maxi');

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);

		// Wait for popover to be visible
		await page.waitForSelector(
			'.components-popover__content .toolbar-item__copy-paste__popover'
		);
		await page.waitForTimeout(1000);

		// select paste
		await page.$$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button[1].click()
		);

		const expectPosition = {
			'position-top-general': '56',
			'position-bottom-general': '56',
			'position-left-general': '56',
			'position-right-general': '56',
			'position-top-unit-general': '%',
			'position-bottom-unit-general': '%',
			'position-left-unit-general': '%',
			'position-right-unit-general': '%',
		};

		const positionResult = await getAttributes([
			'position-top-general',
			'position-bottom-general',
			'position-left-general',
			'position-right-general',
			'position-top-unit-general',
			'position-bottom-unit-general',
			'position-left-unit-general',
			'position-right-unit-general',
		]);

		expect(positionResult).toStrictEqual(expectPosition);

		// Restore console.error
		consoleErrorSpy.mockRestore();
	});
	it('Should copy and paste styles with special paste', async () => {
		await insertMaxiBlock(page, 'Group Maxi');

		await updateAllBlockUniqueIds(page);

		// add border attributes
		const borderAccordion = await openSidebarTab(page, 'style', 'border');

		const axisControlInstance = await borderAccordion.$(
			'.maxi-axis-control__border'
		);

		await editAxisControl({
			page,
			instance: axisControlInstance,
			syncOption: 'none',
			values: ['56', '15', '96', '44'],
			unit: '%',
		});

		// add margin/padding attributes
		const marginAccordion = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		await editAxisControl({
			page,
			instance: await marginAccordion.$(
				'.maxi-axis-control .maxi-axis-control__content__item__margin'
			),
			values: '24',
			unit: 'em',
		});

		await editAxisControl({
			page,
			instance: await marginAccordion.$(
				'.maxi-axis-control .maxi-axis-control__content__item__padding'
			),
			values: '27',
			unit: 'px',
		});

		// add flex attributes
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'flexbox'
		);

		await accordionPanel.$eval(
			'.maxi-flex-wrap-control .maxi-tabs-control button[aria-label="wrap"]',
			button => button.click()
		);
		await accordionPanel.$eval(
			'.maxi-flex__direction .maxi-tabs-control button[aria-label="row"]',
			button => button.click()
		);

		// add box shadow (these attributes should not appear in the second group maxi)
		const boxShadowAccordion = await openSidebarTab(
			page,
			'style',
			'box shadow'
		);

		await boxShadowAccordion.$$eval('.maxi-shadow-control button', click =>
			click[1].click()
		);

		// copy style
		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);

		// select copy style
		await page.$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button.click()
		);

		// new block
		await insertMaxiBlock(page, 'Group Maxi');
		await updateAllBlockUniqueIds(page);
		await page.waitForTimeout(500);

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);

		// select special paste
		await page.$$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button[2].click()
		);

		// select border
		await page.$eval(
			'.maxi-settingstab-control .maxi-tabs-content--disable-padding .toolbar-item__copy-paste__popover__item input#border',
			button => button.click()
		);

		// open margin/padding group
		await page.$$eval(
			'.maxi-settingstab-control .maxi-tabs-content--disable-padding .toolbar-item__copy-paste__popover__item__group',
			buttons => buttons[buttons.length - 1].click()
		);

		// select only margin
		await page.$eval(
			'.maxi-settingstab-control .maxi-tabs-content--disable-padding .toolbar-item__copy-paste__popover__item[data-copy_paste_group="margin-padding"] input#margin',
			button => button.click()
		);

		// open advanced
		await page.$eval(
			'.components-popover__content .maxi-tabs-control__button-advanced',
			button => button.click()
		);

		// select flex
		await page.$eval(
			'.maxi-settingstab-control .maxi-tabs-content--disable-padding .toolbar-item__copy-paste__popover__item input#flexbox',
			button => button.click()
		);

		// open settings
		await page.$eval(
			'.components-popover__content .maxi-tabs-control__button-settings',
			button => button.click()
		);

		// check if the border group checkbox is checked after switching between tabs
		const borderCheckboxChecked = await page.$eval(
			'.maxi-settingstab-control .maxi-tabs-content--disable-padding .toolbar-item__copy-paste__popover__item input#border',
			button => button.checked
		);

		expect(borderCheckboxChecked).toBeTruthy();

		await page.$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover__button--special',
			button => button.click()
		);

		// check attributes
		const expectAttributes = {
			'flex-direction-general': 'row',
			'flex-wrap-general': 'wrap',
			'border-bottom-left-radius-general': 44,
			'border-bottom-right-radius-general': 96,
			'border-top-left-radius-general': 56,
			'border-top-right-radius-general': 15,
			'box-shadow-blur-general': 0,
			'box-shadow-color-general': undefined,
			'margin-top-general': '24',
			'margin-right-general': '24',
			'margin-bottom-general': '24',
			'margin-left-general': '24',
			'margin-top-unit-general': 'em',
			'margin-right-unit-general': 'em',
			'margin-bottom-unit-general': 'em',
			'margin-left-unit-general': 'em',
			'padding-top-general': undefined,
			'padding-right-general': undefined,
			'padding-bottom-general': undefined,
			'padding-left-general': undefined,
			'padding-top-unit-general': 'px',
			'padding-right-unit-general': 'px',
			'padding-bottom-unit-general': 'px',
			'padding-left-unit-general': 'px',
		};
		const attributesResult = await getAttributes(
			Object.keys(expectAttributes)
		);

		expect(attributesResult).toStrictEqual(expectAttributes);
	});

	it('Should copy nested blocks', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		await updateAllBlockUniqueIds(page);

		await page.waitForSelector('.maxi-row-block__template button');
		await page.waitForTimeout(100);
		await page.$$eval('.maxi-row-block__template button', button =>
			button[0].click()
		);
		await page.waitForSelector('.maxi-column-block');

		// Select column
		await page.$eval('.maxi-column-block', column => column.focus());

		// Open appender on Column Maxi
		await page.$eval(
			'.maxi-column-block .block-editor-button-block-appender',
			button => button.click()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('Text Maxi', { delay: 350 });

		await page.$eval(
			'.editor-block-list-item-maxi-blocks-text-maxi',
			button => button.click()
		);

		// focus container
		await page.$eval(
			'.edit-post-header__toolbar .edit-post-header-toolbar__left .edit-post-header-toolbar__document-overview-toggle',
			toolbar => toolbar.click()
		);

		await page.$eval(
			'.edit-post-editor__list-view-panel-content .block-editor-list-view-leaf .block-editor-list-view-block__contents-container .components-button',
			column => column.click()
		);

		await updateAllBlockUniqueIds(page);
		await page.waitForTimeout(500);

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);

		// select copy nested blocks
		await page.$eval(
			'.components-popover__content .toolbar-item__copy-nested-block__popover__button',
			button => button.click()
		);

		await insertMaxiBlock(page, 'Container Maxi');

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);

		// select paste nested blocks
		await page.$$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button[6].click()
		);
		await page.waitForTimeout(1500);
		await updateAllBlockUniqueIds(page);

		const allBlockNames = await page.evaluate(() => {
			// Recursive function to get block names
			const getBlockNames = blocks => {
				let names = [];
				blocks.forEach(block => {
					// Add the name of the current block
					names.push(block.name);
					// Recursively add the names of any inner blocks
					const innerBlockNames = getBlockNames(
						wp.data
							.select('core/block-editor')
							.getBlocks(block.clientId)
					);
					names = names.concat(innerBlockNames);
				});
				return names;
			};

			// Get all top-level blocks
			const topLevelBlocks = wp.data
				.select('core/block-editor')
				.getBlocks();

			// Recursively get all block names
			return getBlockNames(topLevelBlocks);
		});

		expect(allBlockNames.length).toBe(8);

		expect(allBlockNames[allBlockNames.length - 1]).toBe(
			'maxi-blocks/text-maxi'
		);
	});
});
