/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('AxisControl', () => {
	it('Checking the axis control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		const accordionPanel = await openSidebar(page, 'margin padding');
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

			// Resetting values
			const resetButton = await axisControl.$(
				'.maxi-axis-control .maxi-axis-control__header button'
			);

			await resetButton.click();
			const thirdAttributes = await getBlockAttributes();

			Object.keys(expectedAttributes).forEach(key => {
				if (key !== `${instances[i]}-unit-general`)
					expect(thirdAttributes[key]).toBe(undefined);
				else expect(thirdAttributes[key]).toBe('px');
			});
		}

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

		// Padding can't be lower than 0 and sync
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

		// value in general and responsive
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

		expect(responsiveBlockPadding).toStrictEqual(expectResponsivePadding);

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
