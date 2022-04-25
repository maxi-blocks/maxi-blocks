/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	editAdvancedNumberControl,
	getAttributes,
	changeResponsive,
} from '../../utils';

describe('FlexSettings', () => {
	it('Checking the flex options', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebarTab(page, 'advanced', 'flex');

		const wrapSelector = await accordionPanel.$('.maxi-flex__wrap select');
		await wrapSelector.select('wrap');

		const directionSelector = await accordionPanel.$(
			'.maxi-flex__direction select'
		);
		await directionSelector.select('row');

		const justifyContentSelector = await accordionPanel.$(
			'.maxi-flex__justify-content select'
		);
		await justifyContentSelector.select('flex-end');

		const alignItemSelector = await accordionPanel.$(
			'.maxi-flex__align-items select'
		);
		await alignItemSelector.select('flex-end');

		const alignContentSelector = await accordionPanel.$(
			'.maxi-flex__align-content select'
		);
		await alignContentSelector.select('flex-start');

		const flowSelector = await accordionPanel.$('.maxi-flex__flow select');
		await flowSelector.select('wrap');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__row-gap'),
			newNumber: '55',
			newValue: 'vw',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__column-gap'),
			newNumber: '77',
			newValue: 'em',
		});

		// expect
		const attributeParent = await getAttributes([
			'flex-direction-general',
			'flex-flow-general',
			'flex-wrap-general',
			'justify-content-general',
			'align-content-general',
			'align-items-general',
			'column-gap-general',
			'column-gap-unit-general',
			'row-gap-general',
			'row-gap-unit-general',
		]);

		const expectedParentAttribute = {
			'flex-direction-general': 'row',
			'flex-flow-general': 'wrap',
			'flex-wrap-general': 'wrap',
			'justify-content-general': 'flex-end',
			'align-content-general': 'flex-start',
			'align-items-general': 'flex-end',
			'column-gap-general': 77,
			'column-gap-unit-general': 'em',
			'row-gap-general': 55,
			'row-gap-unit-general': 'vw',
		};
		expect(attributeParent).toStrictEqual(expectedParentAttribute);

		// check warning box
		await accordionPanel.$$eval(
			'.maxi-settingstab-control_has-border-left-right button',
			button => button[1].click()
		);

		const warningBox = await accordionPanel.$eval(
			'.maxi-warning-box',
			content => content.innerHTML
		);
		expect(warningBox).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();

		// flex-child
		await page.$$eval('.block-editor-inserter button', addBlock =>
			addBlock[1].click()
		);

		await page.keyboard.type('Text Maxi');

		await page.$eval(
			'.block-editor-inserter__panel-content .block-editor-block-types-list__list-item button',
			button => button.click()
		);

		await accordionPanel.$$eval(
			'.maxi-settingstab-control_has-border-left-right button',
			button => button[1].click()
		);
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__order'),
			newNumber: '4',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__flex-grow'),
			newNumber: '10',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__flex-shrink'),
			newNumber: '6',
		});
		await page.waitForTimeout(100);

		const flexBasisSelector = await page.$(
			'.maxi-typography-control__flex-basis select'
		);
		await page.waitForTimeout(100);

		await flexBasisSelector.select('max-content');

		// expect
		const attributeResult = await getAttributes([
			'flex-basis-general',
			'flex-grow-general',
			'flex-shrink-general',
			'order-general',
		]);

		const expectedAttributes = {
			'flex-basis-general': 'max-content',
			'flex-grow-general': 10,
			'flex-shrink-general': 6,
			'order-general': 4,
		};

		expect(attributeResult).toStrictEqual(expectedAttributes);

		// expect custom flex-basis
		const flexBasisCustomSelector = await page.$(
			'.maxi-typography-control__flex-basis select'
		);
		await flexBasisCustomSelector.select('custom');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-typography-control__custom-flex-basis'
			),
			newNumber: '33',
			newValue: '%',
		});

		expect(await getAttributes('flex-basis-general')).toStrictEqual('33');
		expect(await getAttributes('flex-basis-unit-general')).toStrictEqual(
			'%'
		);

		// flex-child responsive
		// check s
		await changeResponsive(page, 's');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__order'),
			newNumber: '2',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__flex-grow'),
			newNumber: '5',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__flex-shrink'),
			newNumber: '4',
		});

		await page.waitForTimeout(100);

		const flexBasisSelectorS = await page.$(
			'.maxi-typography-control__flex-basis select'
		);
		await page.waitForTimeout(100);

		await flexBasisSelectorS.select('fit-content');

		const attributeResultS = await getAttributes([
			'flex-basis-s',
			'flex-grow-s',
			'flex-shrink-s',
			'order-s',
		]);

		const expectedAttributesS = {
			'flex-basis-s': 'fit-content',
			'flex-grow-s': 5,
			'flex-shrink-s': 4,
			'order-s': 2,
		};
		expect(attributeResultS).toStrictEqual(expectedAttributesS);

		// check xs
		await changeResponsive(page, 'xs');
		const flexShrinkXS = await page.$eval(
			'.maxi-typography-control__flex-shrink input',
			input => input.value
		);

		expect(flexShrinkXS).toStrictEqual('4');

		const flexGrowXS = await page.$eval(
			'.maxi-typography-control__flex-grow input',
			input => input.value
		);

		expect(flexGrowXS).toStrictEqual('5');

		const orderXS = await page.$eval(
			'.maxi-typography-control__order input',
			input => input.value
		);

		expect(orderXS).toStrictEqual('2');

		const flexBasisXS = await page.$eval(
			'.maxi-typography-control__flex-basis select',
			input => input.value
		);

		expect(flexBasisXS).toStrictEqual('fit-content');

		// check m
		await changeResponsive(page, 'm');

		const flexShrinkM = await page.$eval(
			'.maxi-typography-control__flex-shrink input',
			input => input.value
		);

		expect(flexShrinkM).toStrictEqual('6');

		const flexGrowM = await page.$eval(
			'.maxi-typography-control__flex-grow input',
			input => input.value
		);

		expect(flexGrowM).toStrictEqual('10');

		const orderM = await page.$eval(
			'.maxi-typography-control__order input',
			input => input.value
		);

		expect(orderM).toStrictEqual('4');

		await page.waitForTimeout(100);

		const flexBasisM = await page.$eval(
			'.maxi-typography-control__flex-basis select',
			input => input.value
		);

		expect(flexBasisM).toStrictEqual('');

		// warning box
		const warningBoxFlex = await accordionPanel.$eval(
			'.maxi-warning-box',
			content => content.innerHTML
		);
		expect(warningBoxFlex).toMatchSnapshot();
	});
	it('Checking the flex options responsive', async () => {
		// this openSidebar is required
		await openSidebarTab(page, 'advanced', 'overflow');
		await changeResponsive(page, 'base');
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebarTab(page, 'advanced', 'flex');

		// base
		const wrapSelector = await accordionPanel.$('.maxi-flex__wrap select');
		await wrapSelector.select('wrap');

		const directionSelector = await accordionPanel.$(
			'.maxi-flex__direction select'
		);
		await directionSelector.select('row');

		const justifyContentSelector = await accordionPanel.$(
			'.maxi-flex__justify-content select'
		);
		await justifyContentSelector.select('flex-end');

		const alignItemSelector = await accordionPanel.$(
			'.maxi-flex__align-items select'
		);
		await alignItemSelector.select('flex-end');

		const alignContentSelector = await accordionPanel.$(
			'.maxi-flex__align-content select'
		);
		await alignContentSelector.select('flex-start');

		const flowSelector = await accordionPanel.$('.maxi-flex__flow select');
		await flowSelector.select('wrap');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__row-gap'),
			newNumber: '55',
			newValue: 'vw',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__column-gap'),
			newNumber: '77',
			newValue: 'em',
		});

		// change responsive s
		await changeResponsive(page, 's');

		const wrapSelectorS = await accordionPanel.$('.maxi-flex__wrap select');
		await wrapSelectorS.select('nowrap');

		const directionSelectorS = await accordionPanel.$(
			'.maxi-flex__direction select'
		);
		await directionSelectorS.select('column');

		const justifyContentSelectorS = await accordionPanel.$(
			'.maxi-flex__justify-content select'
		);
		await justifyContentSelectorS.select('flex-start');

		const alignItemSelectorS = await accordionPanel.$(
			'.maxi-flex__align-items select'
		);
		await alignItemSelectorS.select('flex-start');

		const alignContentSelectorS = await accordionPanel.$(
			'.maxi-flex__align-content select'
		);
		await alignContentSelectorS.select('flex-end');

		const flowSelectorS = await accordionPanel.$('.maxi-flex__flow select');
		await flowSelectorS.select('column');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__row-gap'),
			newNumber: '23',
			newValue: 'em',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__column-gap'),
			newNumber: '34',
			newValue: 'px',
		});

		const attributeParentS = await getAttributes([
			'flex-direction-s',
			'flex-flow-s',
			'flex-wrap-s',
			'justify-content-s',
			'align-content-s',
			'align-items-s',
			'column-gap-s',
			'column-gap-unit-s',
			'row-gap-s',
			'row-gap-unit-s',
		]);

		const expectedParentAttributeS = {
			'flex-direction-s': 'column',
			'flex-flow-s': 'column',
			'flex-wrap-s': 'nowrap',
			'justify-content-s': 'flex-start',
			'align-content-s': 'flex-end',
			'align-items-s': 'flex-start',
			'column-gap-s': 34,
			'column-gap-unit-s': 'px',
			'row-gap-s': 23,
			'row-gap-unit-s': 'em',
		};
		expect(attributeParentS).toStrictEqual(expectedParentAttributeS);

		// change responsive xs
		await changeResponsive(page, 'xs');

		const wrapSelectorXS = await accordionPanel.$eval(
			'.maxi-flex__wrap select',
			selector => selector.value
		);
		expect(wrapSelectorXS).toStrictEqual('nowrap');

		const directionSelectorXS = await accordionPanel.$eval(
			'.maxi-flex__direction select',
			selector => selector.value
		);
		expect(directionSelectorXS).toStrictEqual('column');

		const justifyContentSelectorXS = await accordionPanel.$eval(
			'.maxi-flex__justify-content select',
			selector => selector.value
		);
		expect(justifyContentSelectorXS).toStrictEqual('flex-start');

		const alignItemSelectorXS = await accordionPanel.$eval(
			'.maxi-flex__align-items select',
			selector => selector.value
		);
		expect(alignItemSelectorXS).toStrictEqual('flex-start');

		const alignContentSelectorXS = await accordionPanel.$eval(
			'.maxi-flex__align-content select',
			selector => selector.value
		);
		expect(alignContentSelectorXS).toStrictEqual('flex-end');

		const flowSelectorXS = await accordionPanel.$eval(
			'.maxi-flex__flow select',
			selector => selector.value
		);
		expect(flowSelectorXS).toStrictEqual('column');

		const rowGapXS = await accordionPanel.$eval(
			'.maxi-typography-control__row-gap input',
			selector => selector.value
		);
		expect(rowGapXS).toStrictEqual('23');

		const rowGapSelectorXS = await accordionPanel.$eval(
			'.maxi-typography-control__row-gap select',
			selector => selector.value
		);
		expect(rowGapSelectorXS).toStrictEqual('em');

		const columnGapXS = await accordionPanel.$eval(
			'.maxi-typography-control__column-gap input',
			selector => selector.value
		);
		expect(columnGapXS).toStrictEqual('34');

		const columnGapSelectorXS = await accordionPanel.$eval(
			'.maxi-typography-control__column-gap select',
			selector => selector.value
		);
		expect(columnGapSelectorXS).toStrictEqual('px');

		// change responsive m
		await changeResponsive(page, 'm');

		const wrapSelectorM = await accordionPanel.$eval(
			'.maxi-flex__wrap select',
			selector => selector.value
		);
		expect(wrapSelectorM).toStrictEqual('wrap');

		const directionSelectorM = await accordionPanel.$eval(
			'.maxi-flex__direction select',
			selector => selector.value
		);
		expect(directionSelectorM).toStrictEqual('row');

		const justifyContentSelectorM = await accordionPanel.$eval(
			'.maxi-flex__justify-content select',
			selector => selector.value
		);
		expect(justifyContentSelectorM).toStrictEqual('flex-end');

		const alignItemSelectorM = await accordionPanel.$eval(
			'.maxi-flex__align-items select',
			selector => selector.value
		);
		expect(alignItemSelectorM).toStrictEqual('flex-end');

		const alignContentSelectorM = await accordionPanel.$eval(
			'.maxi-flex__align-content select',
			selector => selector.value
		);
		expect(alignContentSelectorM).toStrictEqual('flex-start');

		const flowSelectorM = await accordionPanel.$eval(
			'.maxi-flex__flow select',
			selector => selector.value
		);
		expect(flowSelectorM).toStrictEqual('wrap');

		const rowGapM = await accordionPanel.$eval(
			'.maxi-typography-control__row-gap input',
			selector => selector.value
		);
		expect(rowGapM).toStrictEqual('55');
		const rowGapSelectorM = await accordionPanel.$eval(
			'.maxi-typography-control__row-gap select',
			selector => selector.value
		);
		expect(rowGapSelectorM).toStrictEqual('vw');

		const columnGapM = await accordionPanel.$eval(
			'.maxi-typography-control__column-gap input',
			selector => selector.value
		);
		expect(columnGapM).toStrictEqual('77');

		const columnGapSelectorM = await accordionPanel.$eval(
			'.maxi-typography-control__column-gap select',
			selector => selector.value
		);
		expect(columnGapSelectorM).toStrictEqual('em');
	});
});
