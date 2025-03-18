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
		await createNewPost();
		await page.waitForTimeout(1000);
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

		// select copy/paste
		await page.$eval(
			'.components-popover__content .maxi-copypaste__copy-selector button',
			button => button.click()
		);

		// select paste
		await page.$$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button[1].click()
		);

		const expectPosition = {
			'position-top-xl': '56',
			'position-bottom-xl': '56',
			'position-left-xl': '56',
			'position-right-xl': '56',
			'position-top-unit-xl': '%',
			'position-bottom-unit-xl': '%',
			'position-left-unit-xl': '%',
			'position-right-unit-xl': '%',
		};

		const positionResult = await getAttributes([
			'position-top-xl',
			'position-bottom-xl',
			'position-left-xl',
			'position-right-xl',
			'position-top-unit-xl',
			'position-bottom-unit-xl',
			'position-left-unit-xl',
			'position-right-unit-xl',
		]);

		expect(positionResult).toStrictEqual(expectPosition);
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
			'flex-direction-xl': 'row',
			'flex-wrap-xl': 'wrap',
			'border-bottom-left-radius-xl': 44,
			'border-bottom-right-radius-xl': 96,
			'border-top-left-radius-xl': 56,
			'border-top-right-radius-xl': 15,
			'box-shadow-blur-xl': undefined,
			'box-shadow-color-xl': undefined,
			'margin-top-xl': '24',
			'margin-right-xl': '24',
			'margin-bottom-xl': '24',
			'margin-left-xl': '24',
			'margin-top-unit-xl': 'em',
			'margin-right-unit-xl': 'em',
			'margin-bottom-unit-xl': 'em',
			'margin-left-unit-xl': 'em',
			'padding-top-xl': undefined,
			'padding-right-xl': undefined,
			'padding-bottom-xl': undefined,
			'padding-left-xl': undefined,
			'padding-top-unit-xl': undefined,
			'padding-right-unit-xl': undefined,
			'padding-bottom-unit-xl': undefined,
			'padding-left-unit-xl': undefined,
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
			button => button[3].click()
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
