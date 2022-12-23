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
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'flexbox'
		);

		await page.$$eval(
			'.maxi-flex-wrap-control .maxi-tabs-control button',
			buttons => buttons[2].click()
		);

		await page.$$eval(
			'.maxi-flex__direction .maxi-tabs-control button',
			button => button[1].click()
		);

		await page.$$eval(
			'.maxi-flex-align-control__justify-content .maxi-tabs-control button',
			button => button[2].click()
		);

		await page.$$eval(
			'.maxi-flex-align-control__align-items .maxi-tabs-control button',
			button => button[2].click()
		);

		await page.$$eval(
			'.maxi-flex__align-content .maxi-tabs-control button',
			button => button[1].click()
		);

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__row-gap'),
			newNumber: '55',
			newValue: 'vw',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__column-gap'),
			newNumber: '77',
			newValue: 'em',
		});

		// expect
		const attributeParent = await getAttributes([
			'flex-direction-general',
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
		await accordionPanel.$eval(
			'.maxi-settingstab-control_has-border-left-right .maxi-tabs-control__button-flex-child',
			button => button.click()
		);

		const warningBox = await accordionPanel.$eval(
			'.maxi-warning-box',
			content => content.innerHTML
		);
		expect(warningBox).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();

		// flex-child

		await page.$$eval('.block-editor-inserter button', addBlock =>
			addBlock[0].click()
		);

		await page.keyboard.type('Text Maxi');

		await page.$eval(
			'.block-editor-inserter__panel-content .block-editor-block-types-list__list-item button',
			button => button.click()
		);

		await accordionPanel.$eval(
			'.maxi-settingstab-control_has-border-left-right .maxi-tabs-control__button-flex-child',
			button => button.click()
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
			'.maxi-typography-control__flex-basis .maxi-select-control__input'
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
			'.maxi-typography-control__flex-basis .maxi-select-control__input'
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
			'.maxi-typography-control__flex-basis .maxi-select-control__input'
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
			'.maxi-typography-control__flex-basis .maxi-select-control__input',
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
			'.maxi-typography-control__flex-basis .maxi-select-control__input',
			input => input.value
		);

		expect(flexBasisM).toStrictEqual('');

		// warning box
		const warningBoxFlex = await accordionPanel.$eval(
			'.maxi-warning-box',
			content => content.innerHTML
		);
		expect(warningBoxFlex).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Checking the flex options responsive', async () => {
		// this openSidebar is required
		await openSidebarTab(page, 'advanced', 'overflow');
		await changeResponsive(page, 'base');
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'flexbox'
		);

		// base

		await page.$$eval(
			'.maxi-flex-wrap-control .maxi-tabs-control button',
			button => button[2].click()
		);

		await page.$$eval(
			'.maxi-flex__direction .maxi-tabs-control button',
			button => button[1].click()
		);

		await page.$$eval(
			'.maxi-flex-align-control__justify-content .maxi-tabs-control button',
			button => button[2].click()
		);

		await page.$$eval(
			'.maxi-flex-align-control__align-items .maxi-tabs-control button',
			button => button[2].click()
		);

		await page.$$eval(
			'.maxi-flex__align-content .maxi-tabs-control button',
			button => button[1].click()
		);

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__row-gap'),
			newNumber: '55',
			newValue: 'vw',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__column-gap'),
			newNumber: '77',
			newValue: 'em',
		});

		// change responsive s
		await changeResponsive(page, 's');

		await page.$$eval(
			'.maxi-flex-wrap-control .maxi-tabs-control button',
			button => button[1].click()
		);

		await page.$$eval(
			'.maxi-flex__direction .maxi-tabs-control button',
			button => button[2].click()
		);

		await page.$$eval(
			'.maxi-flex-align-control__justify-content .maxi-tabs-control button',
			button => button[1].click()
		);

		await page.$$eval(
			'.maxi-flex-align-control__align-items .maxi-tabs-control button',
			button => button[1].click()
		);

		await page.$$eval(
			'.maxi-flex__align-content  .maxi-tabs-control button',
			button => button[2].click()
		);

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__row-gap'),
			newNumber: '23',
			newValue: 'em',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__column-gap'),
			newNumber: '34',
			newValue: 'px',
		});

		const attributeParentS = await getAttributes([
			'flex-direction-s',
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

		expect(await getAttributes('flex-wrap-s')).toStrictEqual('nowrap');

		expect(await getAttributes('flex-direction-s')).toStrictEqual('column');

		expect(await getAttributes('justify-content-s')).toStrictEqual(
			'flex-start'
		);

		expect(await getAttributes('align-items-s')).toStrictEqual(
			'flex-start'
		);

		expect(await getAttributes('align-content-s')).toStrictEqual(
			'flex-end'
		);

		const rowGapXS = await accordionPanel.$eval(
			'.maxi-gap-control__row-gap input',
			selector => selector.value
		);
		expect(rowGapXS).toStrictEqual('23');

		const rowGapSelectorXS = await accordionPanel.$eval(
			'.maxi-gap-control__row-gap select',
			selector => selector.value
		);
		expect(rowGapSelectorXS).toStrictEqual('em');

		const columnGapXS = await accordionPanel.$eval(
			'.maxi-gap-control__column-gap input',
			selector => selector.value
		);
		expect(columnGapXS).toStrictEqual('34');

		const columnGapSelectorXS = await accordionPanel.$eval(
			'.maxi-gap-control__column-gap select',
			selector => selector.value
		);
		expect(columnGapSelectorXS).toStrictEqual('px');

		// change responsive m
		await changeResponsive(page, 'm');

		expect(await getAttributes('flex-wrap-m')).toStrictEqual('wrap');

		expect(await getAttributes('flex-direction-m')).toStrictEqual('row');

		expect(await getAttributes('justify-content-m')).toStrictEqual(
			'flex-end'
		);

		expect(await getAttributes('align-items-m')).toStrictEqual('flex-end');

		expect(await getAttributes('align-content-m')).toStrictEqual(
			'flex-start'
		);

		const rowGapM = await accordionPanel.$eval(
			'.maxi-gap-control__row-gap input',
			selector => selector.value
		);
		expect(rowGapM).toStrictEqual('55');
		const rowGapSelectorM = await accordionPanel.$eval(
			'.maxi-gap-control__row-gap select',
			selector => selector.value
		);
		expect(rowGapSelectorM).toStrictEqual('vw');

		const columnGapM = await accordionPanel.$eval(
			'.maxi-gap-control__column-gap input',
			selector => selector.value
		);
		expect(columnGapM).toStrictEqual('77');

		const columnGapSelectorM = await accordionPanel.$eval(
			'.maxi-gap-control__column-gap select',
			selector => selector.value
		);
		expect(columnGapSelectorM).toStrictEqual('em');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
