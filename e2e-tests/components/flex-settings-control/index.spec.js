/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	editAdvancedNumberControl,
	getAttributes,
	changeResponsive,
	insertMaxiBlock,
} from '../../utils';

describe('FlexSettings', () => {
	it('Checking the flex options', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');
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

		await page.waitForSelector('.maxi-gap-control__row-gap');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__row-gap'),
			newNumber: '55',
			newValue: 'vw',
		});

		await page.waitForSelector('.maxi-gap-control__column-gap');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__column-gap'),
			newNumber: '77',
			newValue: 'em',
		});

		// expect
		const attributeParent = await getAttributes([
			'flex-direction-g',
			'flex-wrap-g',
			'_jc-g',
			'align-content-g',
			'align-items-g',
			'column-gap-g',
			'column-gap-unit-g',
			'row-gap-g',
			'row-gap-unit-g',
		]);

		const expectedParentAttribute = {
			'flex-direction-g': 'row',
			'flex-wrap-g': 'wrap',
			'_jc-g': 'flex-end',
			'align-content-g': 'flex-start',
			'align-items-g': 'flex-end',
			'column-gap-g': 77,
			'column-gap-unit-g': 'em',
			'row-gap-g': 55,
			'row-gap-unit-g': 'vw',
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

		await page.waitForSelector('.maxi-typography-control__order');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__order'),
			newNumber: '4',
		});

		await page.waitForSelector('.maxi-typography-control__flex-grow');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__flex-grow'),
			newNumber: '10',
		});

		await page.waitForSelector('.maxi-typography-control__flex-shrink');
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
			'flex-basis-g',
			'flex-grow-g',
			'flex-shrink-g',
			'order-g',
		]);

		const expectedAttributes = {
			'flex-basis-g': 'max-content',
			'flex-grow-g': 10,
			'flex-shrink-g': 6,
			'order-g': 4,
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

		expect(await getAttributes('flex-basis-g')).toStrictEqual('33');
		expect(await getAttributes('flex-basis-unit-g')).toStrictEqual('%');

		// flex-child responsive
		// check s
		await changeResponsive(page, 's');

		await page.waitForSelector('.maxi-typography-control__order');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__order'),
			newNumber: '2',
		});

		await page.waitForSelector('.maxi-typography-control__flex-grow');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__flex-grow'),
			newNumber: '5',
		});

		await page.waitForSelector('.maxi-typography-control__flex-shrink');
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

		expect(flexBasisM).toStrictEqual('custom');

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
		await insertMaxiBlock(page, 'Group Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'flexbox'
		);

		const flexBoxResponsiveTest = async content => {
			const {
				flexWrap,
				flexDirection,
				justifyContent,
				alignItems,
				alignContent,
				rowGapValue,
				rowGapUnit,
				columnGapValue,
				columnGapUnit,
			} = content;

			await page.$$eval(
				'.maxi-flex-wrap-control .maxi-tabs-control button',
				(button, _flexWrap) => button[_flexWrap].click(),
				flexWrap
			);
			await page.$$eval(
				'.maxi-flex__direction .maxi-tabs-control button',
				(button, _flexDirection) => button[_flexDirection].click(),
				flexDirection
			);
			await page.$$eval(
				'.maxi-flex-align-control__justify-content .maxi-tabs-control button',
				(button, _justifyContent) => button[_justifyContent].click(),
				justifyContent
			);
			await page.$$eval(
				'.maxi-flex-align-control__align-items .maxi-tabs-control button',
				(button, _alignItems) => button[_alignItems].click(),
				alignItems
			);
			await page.$$eval(
				'.maxi-flex__align-content .maxi-tabs-control button',
				(button, _alignContent) => button[_alignContent].click(),
				alignContent
			);
			await editAdvancedNumberControl({
				page,
				instance: await page.$('.maxi-gap-control__row-gap'),
				newNumber: rowGapValue,
				newValue: rowGapUnit,
			});
			await editAdvancedNumberControl({
				page,
				instance: await page.$('.maxi-gap-control__column-gap'),
				newNumber: columnGapValue,
				newValue: columnGapUnit,
			});
		};
		const flexBoxResponsiveExpect = async (content, breakpoint) => {
			const {
				flexWrap,
				flexDirection,
				justifyContent,
				alignItems,
				alignContent,
				rowGapValue,
				rowGapUnit,
				columnGapValue,
				columnGapUnit,
			} = content;

			const attributes = await getAttributes([
				`flex-wrap-${breakpoint}`,
				`flex-direction-${breakpoint}`,
				`_jc-${breakpoint}`,
				`align-items-${breakpoint}`,
				`align-content-${breakpoint}`,
				`row-gap-${breakpoint}`,
				`row-gap-unit-${breakpoint}`,
				`column-gap-${breakpoint}`,
				`column-gap-unit-${breakpoint}`,
			]);

			return (
				attributes[`flex-wrap-${breakpoint}`] === flexWrap &&
				attributes[`flex-direction-${breakpoint}`] === flexDirection &&
				attributes[`_jc-${breakpoint}`] === justifyContent &&
				attributes[`align-items-${breakpoint}`] === alignItems &&
				attributes[`align-content-${breakpoint}`] === alignContent &&
				attributes[`row-gap-${breakpoint}`] === rowGapValue &&
				attributes[`row-gap-unit-${breakpoint}`] === rowGapUnit &&
				attributes[`column-gap-${breakpoint}`] === columnGapValue &&
				attributes[`column-gap-unit-${breakpoint}`] === columnGapUnit
			);
		};
		const flexBoxResponsiveValuesTest = async content => {
			const {
				flexWrap,
				flexDirection,
				justifyContent,
				alignItems,
				alignContent,
				rowGapValue,
				rowGapUnit,
				columnGapValue,
				columnGapUnit,
			} = content;

			const flexWrapSelected = await page.$eval(
				`.maxi-flex-wrap-control .maxi-tabs-control button[aria-label="${flexWrap}"]`,
				button => button.ariaPressed === 'true'
			);
			const flexDirectionSelected = await page.$eval(
				`.maxi-flex__direction .maxi-tabs-control button[aria-label="${flexDirection}"`,
				button => button.ariaPressed === 'true'
			);
			const justifyContentSelected = await page.$eval(
				`.maxi-flex-align-control__justify-content .maxi-tabs-control button[aria-label="${justifyContent}"`,
				button => button.ariaPressed === 'true'
			);
			const alignItemsSelected = await page.$eval(
				`.maxi-flex-align-control__align-items .maxi-tabs-control button[aria-label="${alignItems}"`,
				button => button.ariaPressed === 'true'
			);
			const alignContentSelected = await page.$eval(
				`.maxi-flex__align-content .maxi-tabs-control button[aria-label="${alignContent}"`,
				button => button.ariaPressed === 'true'
			);
			const rowGapSelected = await accordionPanel.$eval(
				'.maxi-gap-control__row-gap input',
				selector => +selector.value
			);
			const rowGapUnitSelected = await accordionPanel.$eval(
				'.maxi-gap-control__row-gap select',
				selector => selector.value
			);
			const columnGapSelected = await accordionPanel.$eval(
				'.maxi-gap-control__column-gap input',
				selector => +selector.value
			);
			const columnGapUnitSelected = await accordionPanel.$eval(
				'.maxi-gap-control__column-gap select',
				selector => selector.value
			);

			return (
				flexWrapSelected &&
				flexDirectionSelected &&
				justifyContentSelected &&
				alignItemsSelected &&
				alignContentSelected &&
				rowGapSelected === rowGapValue &&
				rowGapUnitSelected === rowGapUnit &&
				columnGapSelected === columnGapValue &&
				columnGapUnitSelected === columnGapUnit
			);
		};

		// base
		await flexBoxResponsiveTest({
			flexWrap: 2,
			flexDirection: 1,
			justifyContent: 2,
			alignItems: 2,
			alignContent: 1,
			rowGapValue: '55',
			rowGapUnit: 'vw',
			columnGapValue: '77',
			columnGapUnit: 'em',
		});
		expect(
			await flexBoxResponsiveExpect(
				{
					flexWrap: 'wrap',
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'flex-end',
					alignContent: 'flex-start',
					rowGapValue: 55,
					rowGapUnit: 'vw',
					columnGapValue: 77,
					columnGapUnit: 'em',
				},
				'g'
			)
		).toBe(true);

		// change responsive s
		await changeResponsive(page, 's');
		await flexBoxResponsiveTest({
			flexWrap: 1,
			flexDirection: 2,
			justifyContent: 1,
			alignItems: 1,
			alignContent: 2,
			rowGapValue: '23',
			rowGapUnit: 'em',
			columnGapValue: '34',
			columnGapUnit: 'px',
		});
		expect(
			await flexBoxResponsiveExpect(
				{
					flexWrap: 'nowrap',
					flexDirection: 'column',
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					alignContent: 'flex-end',
					rowGapValue: 23,
					rowGapUnit: 'em',
					columnGapValue: 34,
					columnGapUnit: 'px',
				},
				's'
			)
		).toBe(true);

		// Check xs values are the same than s
		await changeResponsive(page, 'xs');
		expect(
			await flexBoxResponsiveValuesTest({
				flexWrap: 'nowrap',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				alignItems: 'flex-start',
				alignContent: 'flex-end',
				rowGapValue: 23,
				rowGapUnit: 'em',
				columnGapValue: 34,
				columnGapUnit: 'px',
			})
		).toBe(true);

		// change responsive m
		await changeResponsive(page, 'm');
		expect(
			await flexBoxResponsiveValuesTest({
				flexWrap: 'wrap',
				flexDirection: 'row',
				justifyContent: 'flex-end',
				alignItems: 'flex-end',
				alignContent: 'flex-start',
				rowGapValue: 55,
				rowGapUnit: 'vw',
				columnGapValue: 77,
				columnGapUnit: 'em',
			})
		).toBe(true);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
