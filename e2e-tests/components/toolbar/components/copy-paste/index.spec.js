/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	editAxisControl,
	getAttributes,
} from '../../../../utils';

describe('CopyPaste from Toolbar', () => {
	it('Should copy and paste bulk styles', async () => {
		await createNewPost();
		await page.waitForTimeout(1000);
		await insertBlock('Text Maxi');

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

		await insertBlock('Text Maxi');

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
	});
	it('Should copy and paste styles with special paste', async () => {
		await insertBlock('Group Maxi');

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

		// add flex attributes
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'flexbox'
		);

		const wrapSelector = await accordionPanel.$(
			'.maxi-flex-wrap-control select'
		);
		await wrapSelector.select('wrap');

		const directionSelector = await accordionPanel.$(
			'.maxi-flex__direction select'
		);
		await directionSelector.select('row');

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
		await insertBlock('Group Maxi');
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
		// open advanced
		await page.$eval(
			'.components-popover__content .maxi-tabs-control__button-Advanced',
			button => button.click()
		);

		// select flex
		await page.$eval(
			'.maxi-settingstab-control .maxi-tabs-content--disable-padding .toolbar-item__copy-paste__popover__item input#flex',
			button => button.click()
		);

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
		};
		const attributesResult = await getAttributes([
			'flex-direction-general',
			'flex-wrap-general',
			'border-bottom-left-radius-general',
			'border-bottom-right-radius-general',
			'border-top-left-radius-general',
			'border-top-right-radius-general',
			'box-shadow-blur-general',
			'box-shadow-color-general',
		]);

		expect(attributesResult).toStrictEqual(expectAttributes);
	});

	it('Should copy nested blocks', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$$eval('.maxi-row-block__template button', button =>
			button[0].click()
		);

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
			'.edit-post-editor__list-view-panel-content .block-editor-list-view-leaf .block-editor-list-view-block__contents-container button',
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

		await insertBlock('Container Maxi');

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
