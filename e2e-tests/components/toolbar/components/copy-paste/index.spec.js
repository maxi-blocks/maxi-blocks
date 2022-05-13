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
	getBlockStyle,
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
		await page.waitForTimeout(150);

		// select copy/paste
		await page.$eval(
			'.components-popover__content .maxi-copypaste__copy-selector button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy Style
		await page.$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button.click()
		);
		await page.waitForTimeout(150);
		await insertBlock('Text Maxi');

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy/paste
		await page.$eval(
			'.components-popover__content .maxi-copypaste__copy-selector button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy Style
		await page.$$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button[1].click()
		);
		await page.waitForTimeout(150);

		const expectPosition = {
			'position-top-general': 56,
			'position-bottom-general': 56,
			'position-left-general': 56,
			'position-right-general': 56,
			'position-unit-general': '%',
		};

		const positionResult = await getAttributes([
			'position-top-general',
			'position-bottom-general',
			'position-left-general',
			'position-right-general',
			'position-unit-general',
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

		const expectMargin = {
			'border-bottom-left-radius-general': 44,
			'border-bottom-right-radius-general': 96,
			'border-top-left-radius-general': 56,
			'border-top-right-radius-general': 15,
		};
		const marginResult = await getAttributes([
			'border-bottom-left-radius-general',
			'border-bottom-right-radius-general',
			'border-top-left-radius-general',
			'border-top-right-radius-general',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		// add flex attributes
		const accordionPanel = await openSidebarTab(page, 'advanced', 'flex');

		const wrapSelector = await accordionPanel.$(
			'.maxi-flex-wrap-control select'
		);
		await wrapSelector.select('wrap');

		const directionSelector = await accordionPanel.$(
			'.maxi-flex__direction select'
		);
		await directionSelector.select('row');

		const attributeParent = await getAttributes([
			'flex-direction-general',
			'flex-wrap-general',
		]);

		const expectedParentAttribute = {
			'flex-direction-general': 'row',
			'flex-wrap-general': 'wrap',
		};
		expect(attributeParent).toStrictEqual(expectedParentAttribute);

		// copy style
		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy/paste
		await page.$eval(
			'.components-popover__content .maxi-copypaste__copy-selector button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy Style
		await page.$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// new block
		await insertBlock('Group Maxi');
		await page.waitForTimeout(500);

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy/paste
		await page.$eval(
			'.components-popover__content .maxi-copypaste__copy-selector button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select special paste
		await page.$$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button[2].click()
		);
		await page.waitForTimeout(150);

		// select flex
		await page.$eval(
			'.maxi-settingstab-control .maxi-tabs-content--disable-padding .toolbar-item__copy-paste__popover__item input#flex',
			button => button.click()
		);

		// open advanced
		await page.$eval(
			'.toolbar-item__copy-paste__popover .maxi-tabs-control__button-Settings',
			button => button.click()
		);

		// select border
		await page.$eval(
			'.maxi-settingstab-control .maxi-tabs-content--disable-padding .toolbar-item__copy-paste__popover__item input#border',
			button => button.click()
		);

		await page.$eval(
			'.toolbar-item__copy-paste__popover .toolbar-item__copy-paste__popover__button--special',
			button => button.click()
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Should copy nested blocks', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

		await page.$eval('.maxi-block-inserter button', addBlock =>
			addBlock.click()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('Text Maxi');

		// focus group
		await page.$eval('.maxi-group-block', group => group.focus());

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy/paste
		await page.$eval(
			'.components-popover__content .maxi-copypaste__copy-selector button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy Nested Blocks
		await page.$eval(
			'.components-popover__content .toolbar-item__copy-nested-block__popover__button',
			button => button.click()
		);

		await page.waitForTimeout(150);
		await insertBlock('Group Maxi');

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy/paste
		await page.$eval(
			'.components-popover__content .maxi-copypaste__copy-selector button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select paste nested blocks
		await page.$$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button[4].click()
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
