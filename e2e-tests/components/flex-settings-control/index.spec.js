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
	updateAllBlockUniqueIds,
} from '../../utils';

describe('FlexSettings', () => {
	it('Checking the flex options', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');

		await updateAllBlockUniqueIds(page);

		let accordionPanel = await openSidebarTab(page, 'advanced', 'flexbox');

		// Flex wrap to wrap reverse
		await page.$$eval(
			'.maxi-flex-wrap-control .maxi-tabs-control button',
			buttons => buttons[2].click()
		);

		// Flex direction to column
		await page.$$eval(
			'.maxi-flex__direction .maxi-tabs-control button',
			button => button[1].click()
		);

		// Justify content to center
		await page.$$eval(
			'.maxi-flex-align-control__justify-content .maxi-tabs-control button',
			button => button[2].click()
		);

		// Align items to flex-end
		await page.$$eval(
			'.maxi-flex-align-control__align-items .maxi-tabs-control button',
			button => button[2].click()
		);

		// Align content to flex-end
		await page.$$eval(
			'.maxi-flex__align-content .maxi-tabs-control button',
			button => button[1].click()
		);

		// Row gap to 55vw
		await page.waitForSelector('.maxi-gap-control__row-gap');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__row-gap'),
			newNumber: '55',
			newValue: 'vw',
		});

		await page.waitForTimeout(500);

		// Column gap to 77em
		await page.waitForSelector('.maxi-gap-control__column-gap');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-gap-control__column-gap'),
			newNumber: '77',
			newValue: 'em',
		});

		await page.waitForTimeout(500);

		// expect
		const attributeParent = await getAttributes([
			'flex-direction-xl',
			'flex-wrap-xl',
			'justify-content-xl',
			'align-content-xl',
			'align-items-xl',
			'column-gap-xl',
			'column-gap-unit-xl',
			'row-gap-xl',
			'row-gap-unit-xl',
		]);

		const expectedParentAttribute = {
			'flex-direction-xl': 'column',
			'flex-wrap-xl': 'wrap-reverse',
			'justify-content-xl': 'center',
			'align-content-xl': 'flex-end',
			'align-items-xl': 'flex-end',
			'column-gap-xl': 77,
			'column-gap-unit-xl': 'em',
			'row-gap-xl': 55,
			'row-gap-unit-xl': 'vw',
		};
		expect(attributeParent).toStrictEqual(expectedParentAttribute);

		// check warning box
		await accordionPanel.$eval(
			'.maxi-settingstab-control_has-border-left-right .maxi-tabs-control__button-flex-child',
			button => button.click()
		);

		await accordionPanel.waitForSelector('.maxi-warning-box');
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

		await page.keyboard.type('Text Maxi', { delay: 350 });

		await page.$eval(
			'.block-editor-inserter__panel-content .block-editor-block-types-list__list-item button',
			button => button.click()
		);

		await page.waitForTimeout(100);

		await updateAllBlockUniqueIds(page);

		accordionPanel = await openSidebarTab(page, 'advanced', 'flexbox');

		await accordionPanel.$eval(
			'.maxi-settingstab-control_has-border-left-right .maxi-tabs-control__button-flex-child',
			button => button.click()
		);

		// Change order to 4
		await page.waitForSelector('.maxi-flex-settings-control__order');
		await editAdvancedNumberControl({
			page,
			instance: await accordionPanel.$(
				'.maxi-flex-settings-control__order'
			),
			newNumber: '4',
		});

		await page.waitForSelector('.maxi-flex-settings-control__flex-grow');
		await editAdvancedNumberControl({
			page,
			instance: await accordionPanel.$(
				'.maxi-flex-settings-control__flex-grow'
			),
			newNumber: '10',
		});

		await page.waitForSelector('.maxi-flex-settings-control__flex-shrink');
		await editAdvancedNumberControl({
			page,
			instance: await accordionPanel.$(
				'.maxi-flex-settings-control__flex-shrink'
			),
			newNumber: '6',
		});
		await page.waitForTimeout(100);

		const flexBasisSelector = await page.$(
			'.maxi-flex-settings-control__flex-basis .maxi-select-control__input'
		);
		await page.waitForTimeout(100);

		await flexBasisSelector.select('max-content');

		// expect
		const attributeResult = await getAttributes([
			'flex-basis-xl',
			'flex-grow-xl',
			'flex-shrink-xl',
			'order-xl',
		]);

		const expectedAttributes = {
			'flex-basis-xl': 'max-content',
			'flex-grow-xl': 10,
			'flex-shrink-xl': 6,
			'order-xl': 4,
		};

		expect(attributeResult).toStrictEqual(expectedAttributes);

		// expect custom flex-basis
		const flexBasisCustomSelector = await page.$(
			'.maxi-flex-settings-control__flex-basis .maxi-select-control__input'
		);
		await flexBasisCustomSelector.select('custom');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-flex-settings-control__custom-flex-basis'
			),
			newNumber: '33',
			newValue: '%',
		});

		await page.waitForTimeout(500);

		expect(await getAttributes('flex-basis-xl')).toStrictEqual('33');
		expect(await getAttributes('flex-basis-unit-xl')).toStrictEqual('%');

		// flex-child responsive
		// check s
		await changeResponsive(page, 's');

		await page.waitForSelector('.maxi-flex-settings-control__order');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-flex-settings-control__order'),
			newNumber: '2',
		});

		await page.waitForSelector('.maxi-flex-settings-control__flex-grow');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-flex-settings-control__flex-grow'),
			newNumber: '5',
		});

		await page.waitForSelector('.maxi-flex-settings-control__flex-shrink');
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-flex-settings-control__flex-shrink'),
			newNumber: '4',
		});

		await page.waitForTimeout(100);

		const flexBasisSelectorS = await page.$(
			'.maxi-flex-settings-control__flex-basis .maxi-select-control__input'
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
		await page.waitForSelector(
			'.maxi-flex-settings-control__flex-shrink input'
		);
		const flexShrinkXS = await page.$eval(
			'.maxi-flex-settings-control__flex-shrink input',
			input => input.value
		);

		expect(flexShrinkXS).toStrictEqual('4');

		const flexGrowXS = await page.$eval(
			'.maxi-flex-settings-control__flex-grow input',
			input => input.value
		);

		expect(flexGrowXS).toStrictEqual('5');

		const orderXS = await page.$eval(
			'.maxi-flex-settings-control__order input',
			input => input.value
		);

		expect(orderXS).toStrictEqual('2');

		const flexBasisXS = await page.$eval(
			'.maxi-flex-settings-control__flex-basis .maxi-select-control__input',
			input => input.value
		);

		expect(flexBasisXS).toStrictEqual('fit-content');

		// check m
		await changeResponsive(page, 'm');

		await page.waitForSelector(
			'.maxi-flex-settings-control__flex-shrink input'
		);
		const flexShrinkM = await page.$eval(
			'.maxi-flex-settings-control__flex-shrink input',
			input => input.value
		);

		expect(flexShrinkM).toStrictEqual('6');

		const flexGrowM = await page.$eval(
			'.maxi-flex-settings-control__flex-grow input',
			input => input.value
		);

		expect(flexGrowM).toStrictEqual('10');

		const orderM = await page.$eval(
			'.maxi-flex-settings-control__order input',
			input => input.value
		);

		expect(orderM).toStrictEqual('4');

		await page.waitForTimeout(100);

		const flexBasisM = await page.$eval(
			'.maxi-flex-settings-control__flex-basis .maxi-select-control__input',
			input => input.value
		);

		expect(flexBasisM).toStrictEqual('custom');

		// warning box
		await accordionPanel.$eval(
			'.maxi-settingstab-control_has-border-left-right .maxi-tabs-control__button-flex-parent',
			button => button.click()
		);

		await accordionPanel.waitForSelector('.maxi-warning-box');
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

		await updateAllBlockUniqueIds(page);

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
			await page.waitForTimeout(500);

			await editAdvancedNumberControl({
				page,
				instance: await page.$('.maxi-gap-control__column-gap'),
				newNumber: columnGapValue,
				newValue: columnGapUnit,
			});
			await page.waitForTimeout(500);
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
				`justify-content-${breakpoint}`,
				`align-items-${breakpoint}`,
				`align-content-${breakpoint}`,
				`row-gap-${breakpoint}`,
				`row-gap-unit-${breakpoint}`,
				`column-gap-${breakpoint}`,
				`column-gap-unit-${breakpoint}`,
			]);

			let result = true;

			if (attributes[`flex-wrap-${breakpoint}`] !== flexWrap) {
				console.error(
					`flex-wrap-${breakpoint}`,
					attributes[`flex-wrap-${breakpoint}`]
				);

				result = false;
			}
			if (attributes[`flex-direction-${breakpoint}`] !== flexDirection) {
				console.error(
					`flex-direction-${breakpoint}`,
					attributes[`flex-direction-${breakpoint}`]
				);

				result = false;
			}
			if (
				attributes[`justify-content-${breakpoint}`] !== justifyContent
			) {
				console.error(
					`justify-content-${breakpoint}`,
					attributes[`justify-content-${breakpoint}`]
				);

				result = false;
			}
			if (attributes[`align-items-${breakpoint}`] !== alignItems) {
				console.error(
					`align-items-${breakpoint}`,
					attributes[`align-items-${breakpoint}`]
				);

				result = false;
			}
			if (attributes[`align-content-${breakpoint}`] !== alignContent) {
				console.error(
					`align-content-${breakpoint}`,
					attributes[`align-content-${breakpoint}`]
				);

				result = false;
			}
			if (attributes[`row-gap-${breakpoint}`] !== rowGapValue) {
				console.error(
					`row-gap-${breakpoint}`,
					attributes[`row-gap-${breakpoint}`]
				);

				result = false;
			}
			if (attributes[`row-gap-unit-${breakpoint}`] !== rowGapUnit) {
				console.error(
					`row-gap-unit-${breakpoint}`,
					attributes[`row-gap-unit-${breakpoint}`]
				);

				result = false;
			}
			if (attributes[`column-gap-${breakpoint}`] !== columnGapValue) {
				console.error(
					`column-gap-${breakpoint}`,
					attributes[`column-gap-${breakpoint}`]
				);

				result = false;
			}
			if (attributes[`column-gap-unit-${breakpoint}`] !== columnGapUnit) {
				console.error(
					`column-gap-unit-${breakpoint}`,
					attributes[`column-gap-unit-${breakpoint}`]
				);

				result = false;
			}

			return result;
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

			let result = true;

			if (!flexWrapSelected) {
				console.error('flexWrap', flexWrapSelected);

				result = false;
			}
			if (!flexDirectionSelected) {
				console.error('flexDirection', flexDirectionSelected);

				result = false;
			}
			if (!justifyContentSelected) {
				console.error('justifyContent', justifyContentSelected);

				result = false;
			}
			if (!alignItemsSelected) {
				console.error('alignItems', alignItemsSelected);

				result = false;
			}
			if (!alignContentSelected) {
				console.error('alignContent', alignContentSelected);

				result = false;
			}
			if (rowGapSelected !== rowGapValue) {
				console.error('rowGap', rowGapValue);

				result = false;
			}
			if (rowGapUnitSelected !== rowGapUnit) {
				console.error('rowGapUnit', rowGapUnit);

				result = false;
			}
			if (columnGapSelected !== columnGapValue) {
				console.error('columnGap', columnGapValue);

				result = false;
			}
			if (columnGapUnitSelected !== columnGapUnit) {
				console.error('columnGapUnit', columnGapUnit);

				result = false;
			}

			return result;
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
					flexWrap: 'wrap-reverse',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'flex-end',
					alignContent: 'flex-end',
					rowGapValue: 55,
					rowGapUnit: 'vw',
					columnGapValue: 77,
					columnGapUnit: 'em',
				},
				'general'
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
		await page.waitForTimeout(500);

		expect(
			await flexBoxResponsiveExpect(
				{
					flexWrap: 'wrap',
					flexDirection: 'row-reverse',
					justifyContent: 'flex-end',
					alignItems: 'flex-start',
					alignContent: 'center',
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
		await page.waitForTimeout(500);

		expect(
			await flexBoxResponsiveValuesTest({
				flexWrap: 'wrap',
				flexDirection: 'row-reverse',
				justifyContent: 'flex-end',
				alignItems: 'flex-start',
				alignContent: 'center',
				rowGapValue: 23,
				rowGapUnit: 'em',
				columnGapValue: 34,
				columnGapUnit: 'px',
			})
		).toBe(true);

		// change responsive m
		await changeResponsive(page, 'm');
		await page.waitForTimeout(500);

		expect(
			await flexBoxResponsiveValuesTest({
				flexWrap: 'wrap-reverse',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'flex-end',
				alignContent: 'flex-end',
				rowGapValue: 55,
				rowGapUnit: 'vw',
				columnGapValue: 77,
				columnGapUnit: 'em',
			})
		).toBe(true);

		await updateAllBlockUniqueIds(page);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
