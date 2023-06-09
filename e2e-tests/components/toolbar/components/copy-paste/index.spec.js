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
} from '../../../../utils';

describe('CopyPaste from Toolbar', () => {
	it('Should copy and paste bulk styles', async () => {
		await createNewPost();
		await page.waitForTimeout(1000);
		await insertMaxiBlock(page, 'Text Maxi');

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit text maxi
		const accordionPanel = await openSidebarTab(page, 'advanced', '_pos');
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
			'position.t-g': '56',
			'position.b-g': '56',
			'position-left-g': '56',
			'position-right-g': '56',
			'position.t-unit-g': '%',
			'position.b-unit-g': '%',
			'position-left-unit-g': '%',
			'position-right-unit-g': '%',
		};

		const positionResult = await getAttributes([
			'position.t-g',
			'position.b-g',
			'position-left-g',
			'position-right-g',
			'position.t-unit-g',
			'position.b-unit-g',
			'position-left-unit-g',
			'position-right-unit-g',
		]);

		expect(positionResult).toStrictEqual(expectPosition);
	});
	it('Should copy and paste styles with special paste', async () => {
		await insertMaxiBlock(page, 'Group Maxi');

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
			'flex-direction-g': 'row',
			'flex-wrap-g': 'wrap',
			'bo.ra.bl-g': 44,
			'bo.ra.br-g': 96,
			'bo.ra.tl-g': 56,
			'bo.ra.tr-g': 15,
			'bs_blu-g': 0,
			'bs_cc-g': undefined,
			'_m.t-g': '24',
			'_m.r-g': '24',
			'_m.b-g': '24',
			'_m.l-g': '24',
			'_m.t-unit-g': 'em',
			'_m.r-unit-g': 'em',
			'_m.b-unit-g': 'em',
			'_m.l-unit-g': 'em',
			'_p.t-g': undefined,
			'padding-right-g': undefined,
			'_p.b-g': undefined,
			'padding-left-g': undefined,
			'_p.t-unit-g': 'px',
			'padding-right-unit-g': 'px',
			'_p.b-unit-g': 'px',
			'padding-left-unit-g': 'px',
		};
		const attributesResult = await getAttributes(
			Object.keys(expectAttributes)
		);

		expect(attributesResult).toStrictEqual(expectAttributes);
	});

	it('Should copy nested blocks', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');
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
		await page.keyboard.type('Text Maxi');

		await page.$eval(
			'.editor-block-list-item-maxi-blocks-text-maxi',
			button => button.click()
		);

		// focus container
		await page.$eval(
			'.edit-post-header__toolbar .edit-post-header-toolbar__left .edit-post-header-toolbar__list-view-toggle',
			toolbar => toolbar.click()
		);

		await page.$eval(
			'.edit-post-editor__list-view-panel-content .block-editor-list-view-leaf .block-editor-list-view-block__contents-container .components-button',
			column => column.click()
		);
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

		// focus on Text Maxi
		await page.$$eval('.maxi-text-block', blocks =>
			wp.data
				.dispatch('core/block-editor')
				.selectBlock(
					blocks[blocks.length - 1].getAttribute('data-block')
				)
		);

		// check text maxi exist
		const innerBlocksNum = await page.evaluate(
			() =>
				wp.data
					.select('core/block-editor')
					.getBlockParents(
						wp.data
							.select('core/block-editor')
							.getSelectedBlockClientId()
					).length
		);

		expect(innerBlocksNum).toBe(4);
	});
});
