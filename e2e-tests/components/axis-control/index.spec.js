/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar, changeResponsive } from '../../utils';

describe('AxisControl', () => {
	it.only('Checking AxisControl', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		const accordionPanel = await openSidebar(page, 'padding margin');
		const axisControls = await accordionPanel.$$('.maxi-axis-control');
		const instances = ['padding', 'margin'];

		/* eslint-disable no-await-in-loop */
		for (let i = 0; i < axisControls.length; i += 1) {
			const axisControl = await axisControls[i];
			const inputs = await axisControl.$$(
				'.maxi-axis-control__content__item__input'
			);

			// Set value to inputs
			for (let j = 0; j < inputs.length; j += 1) {
				const input = inputs[j];
				await input.focus();
				await page.keyboard.press((j + 1).toString());
			}

			// Change unit selector
			const unitSelector = await axisControl.$(
				'.maxi-axis-control__units select'
			);

			await unitSelector.$$('options');
			await unitSelector.select('%');
			const firstAttributes = await getBlockAttributes();
			const expectedAttributes = {
				[`${instances[i]}-top-general`]: '1',
				[`${instances[i]}-bottom-general`]: '2',
				[`${instances[i]}-left-general`]: '3',
				[`${instances[i]}-right-general`]: '4',
				[`${instances[i]}-unit-general`]: '%',
			};
			Object.entries(expectedAttributes).forEach(([key, value]) => {
				expect(firstAttributes[key].toString()).toBe(value);
			});

			// Synchronizing inputs
			const syncSelector = await axisControl.$$(
				'.maxi-axis-control__content__item__sync button'
			);
			await syncSelector[1].click();

			const topInputs = inputs[0];
			await topInputs.focus();

			await page.keyboard.press('ArrowUp');

			const secondAttributes = await getBlockAttributes();
			Object.keys(expectedAttributes).forEach(key => {
				if (key !== `${instances[i]}-unit-general`)
					expect(secondAttributes[key].toString()).toBe('2');
			});
		}
	});
	it.only('Checking responsive AxisControl', async () => {
		// responsiveS
		await changeResponsive(page, 's');
		const accordionPanel = await openSidebar(page, 'padding margin');
		const axisControls = await accordionPanel.$$(
			'.maxi-axis-control .maxi-axis-control__top-part input'
		);
		const unitSelector = await accordionPanel.$$(
			'.maxi-axis-control .maxi-axis-control__units select'
		);

		await axisControls[2].focus();
		await page.keyboard.type('33', { delay: 100 });

		await unitSelector[1].select('px');

		const expectSResponsiveMargin = {
			'margin-bottom-s': '33',
			'margin-left-s': '33',
			'margin-right-s': '33',
			'margin-top-s': '33',
			'margin-unit-s': 'px',
		};

		const responsiveSMarginAttributes = await getBlockAttributes();

		const responsiveSBlockMargin = (({
			'margin-bottom-s': marginBottom,
			'margin-left-s': marginLeft,
			'margin-right-s': marginRight,
			'margin-top-s': marginTop,
			'margin-unit-s': marginUnit,
		}) => ({
			'margin-bottom-s': marginBottom,
			'margin-left-s': marginLeft,
			'margin-right-s': marginRight,
			'margin-top-s': marginTop,
			'margin-unit-s': marginUnit,
		}))(responsiveSMarginAttributes);

		expect(responsiveSBlockMargin).toStrictEqual(expectSResponsiveMargin);

		// responsive xs
		await changeResponsive(page, 'xs');

		const marginXs = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__top-part input',
			button => button[2].placeholder
		);
		expect(marginXs).toStrictEqual('33');

		const unitXsSelector = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__units select',
			button => button[1].value
		);
		expect(unitXsSelector).toStrictEqual('px');
		// responsive m
		await changeResponsive(page, 'm');

		const marginM = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__top-part input',
			button => button[2].placeholder
		);
		expect(marginM).toStrictEqual('2');

		const unitMSelector = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__units select',
			button => button[1].value
		);
		expect(unitMSelector).toStrictEqual('%');
	});

	it.only('Check responsive reset values', async () => {
		await changeResponsive(page, 'base');
		const accordionPanel = await openSidebar(page, 'padding margin');

		// Base value
		const marginGeneral = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__top-part input',
			button => button[2].value
		);
		expect(marginGeneral).toStrictEqual('2');

		// expect value
		await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__header button',
			button => button[1].click()
		);

		const deletedMarginGeneral = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__top-part input',
			button => button[2].value
		);
		expect(deletedMarginGeneral).toStrictEqual('');

		// responsive s
		await changeResponsive(page, 's');

		const marginS = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__top-part input',
			button => button[2].value
		);
		expect(marginS).toStrictEqual('33');

		// responsive xs
		await changeResponsive(page, 'xs');

		const marginXs = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__top-part input',
			button => button[2].placeholder
		);
		expect(marginXs).toStrictEqual('33');

		// responsive m
		await changeResponsive(page, 'm');

		const marginM = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__top-part input',
			button => button[2].value
		);
		expect(marginM).toStrictEqual('');
	});
	it.only('CheckBox', async () => {
		debugger;
		await changeResponsive(page, 'base');
		const accordionPanel = await openSidebar(page, 'padding margin');
		const axisControls = await accordionPanel.$$('.maxi-axis-control');

		const marginControl = axisControls[1];
		const checkBoxes = await marginControl.$$(
			'.maxi-axis-control__content__item .maxi-axis-control__content__item__checkbox input'
		);

		for (const checkBox of checkBoxes) {
			await checkBox.click();
		}
		const marginKeys = [
			'margin-top-general',
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
		];

		const fourthAttributes = await getBlockAttributes();

		const areAllAuto = marginKeys.every(key => {
			return fourthAttributes[key] === 'auto';
		});

		expect(areAllAuto).toStrictEqual(true);
	});

	it.only('Responsive CheckBox', async () => {
		await changeResponsive(page, 's');
		const accordionPanel = await openSidebar(page, 'padding margin');
		const checkBox = await accordionPanel.$$(
			'.maxi-axis-control__content__item .maxi-axis-control__content__item__checkbox input'
		);
		const axisControls = await accordionPanel.$$(
			'.maxi-axis-control .maxi-axis-control__top-part input'
		);

		const marginS = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__top-part input',
			button => button[2].value
		);
		expect(marginS).toStrictEqual('33');

		await checkBox[1].click();

		const marginBottomAuto = await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__top-part input',
			button => button[4].placeholder
		);

		expect(marginBottomAuto).toStrictEqual('auto'); /// /////////////////
	});
	it('Padding cannot be less than 0 and sync', async () => {
		const syncButton = await page.$$(
			'.maxi-axis-control__disable-auto .maxi-axis-control__middle-part button'
		);
		const topInput = await page.$$(
			'.maxi-axis-control .maxi-axis-control__content__item__top input'
		);

		await syncButton[1].click();
		await topInput[1].focus();

		await page.keyboard.type('-5');

		const expectChanges = 0;
		const attributes = await getBlockAttributes();
		const styleAttributes = attributes['padding-bottom-general'];

		expect(styleAttributes).toStrictEqual(expectChanges);
	});

	it('Sync responsive buttons', async () => {
		const syncButtonTop = await page.$(
			'.maxi-axis-control__top-part .maxi-axis-control__content__item__sync button'
		);

		const syncButtonBottom = await page.$(
			'.maxi-axis-control__bottom-part .maxi-axis-control__content__item__sync button'
		);

		const syncButtonMiddle = await page.$$(
			'.maxi-axis-control__disable-auto .maxi-axis-control__middle-part button'
		);

		// Pressed-top and Pressed-bottom true
		await syncButtonTop.click();
		await syncButtonBottom.click();

		const pressedTop = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__content__item__sync',
			expectHtml => expectHtml[1].innerHTML
		);

		const pressedBottom = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__content__item__sync',
			expectHtml => expectHtml[3].innerHTML
		);

		expect(pressedTop).toMatchSnapshot();
		expect(pressedBottom).toMatchSnapshot();

		// Pressed-top and Pressed-bottom False Pressed-middle True
		await syncButtonMiddle[1].click();

		const pressedMiddleTrue = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__content__item__sync',
			expectHtml => expectHtml[2].innerHTML
		);

		const pressedTopFalse = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__content__item__sync',
			expectHtml => expectHtml[1].innerHTML
		);

		const pressedBottomFalse = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__content__item__sync',
			expectHtml => expectHtml[3].innerHTML
		);

		expect(pressedTopFalse).toMatchSnapshot();
		expect(pressedBottomFalse).toMatchSnapshot();
		expect(pressedMiddleTrue).toMatchSnapshot();

		// Pressed-top True Pressed-middle False
		await syncButtonTop.click();

		const pressedMiddleFalse = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__content__item__sync',
			expectHtml => expectHtml[2].innerHTML
		);

		const pressedTopTrue = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__content__item__sync',
			expectHtml => expectHtml[1].innerHTML
		);

		expect(pressedMiddleFalse).toMatchSnapshot();
		expect(pressedTopTrue).toMatchSnapshot();

		// Pressed-bottom True Pressed-middle False
		await syncButtonMiddle[1].click();
		await syncButtonBottom.click();

		const pressedMiddle = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__content__item__sync',
			expectHtml => expectHtml[2].innerHTML
		);

		const pressedBottomTrue = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__content__item__sync',
			expectHtml => expectHtml[3].innerHTML
		);

		expect(pressedMiddle).toMatchSnapshot();
		expect(pressedBottomTrue).toMatchSnapshot();
	});
});
/* // value in general and responsive
		// set value

		await topInput[1].focus();

		await page.keyboard.press('Backspace');
		await page.keyboard.type('13');

		// responsive
		await page.$eval(
			'.edit-post-header .edit-post-header__toolbar .maxi-toolbar-layout__button',
			button => button.click()
		);

		await page.$$eval('.maxi-responsive-selector button', button =>
			button[2].click()
		);

		// set responsive value
		await topInput[1].focus();

		await page.keyboard.type('0');

		const expectResponsivePadding = {
			'padding-bottom-xl': 0,
			'padding-left-xl': 0,
			'padding-right-xl': 0,
			'padding-top-xl': 0,
		};

		const responsivePaddingAttributes = await getBlockAttributes();

		const responsiveBlockPadding = (({
			'padding-bottom-xl': paddingBottom,
			'padding-left-xl': paddingLeft,
			'padding-right-xl': paddingRight,
			'padding-top-xl': paddingTop,
		}) => ({
			'padding-bottom-xl': paddingBottom,
			'padding-left-xl': paddingLeft,
			'padding-right-xl': paddingRight,
			'padding-top-xl': paddingTop,
		}))(responsivePaddingAttributes);

		expect(responsiveBlockPadding).toStrictEqual(expectResponsivePadding); */
