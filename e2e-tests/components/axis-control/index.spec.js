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

		const syncButton = await page.$(
			'.maxi-axis-control__top-part .maxi-axis-control__content__item__sync button'
		);

		await syncButton.click();
		const paddingInputs = await page.$$(
			'.maxi-axis-control .maxi-axis-control__content__item__top input'
		);

		await paddingInputs[1].focus();
		await page.keyboard.press('5');

		const padding = 5;
		const attributes = await getBlockAttributes();
		const attribute = attributes['padding-bottom-general'];

		expect(attribute).toStrictEqual(padding);

		await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__middle-part button',
			button => button[1].click()
		);

		await paddingInputs[1].focus();
		await page.keyboard.press('Backspace');
		await page.keyboard.press('7');

		const expectChanges = {
			'padding-bottom-general': 7,
			'padding-left-general': 7,
			'padding-right-general': 7,
			'padding-top-general': 7,
		};

		const blockAttributes = await getBlockAttributes();

		const blockPadding = (({
			'padding-bottom-general': paddingBottom,
			'padding-left-general': paddingLeft,
			'padding-right-general': paddingRight,
			'padding-top-general': paddingTop,
		}) => ({
			'padding-bottom-general': paddingBottom,
			'padding-left-general': paddingLeft,
			'padding-right-general': paddingRight,
			'padding-top-general': paddingTop,
		}))(blockAttributes);

		expect(blockPadding).toStrictEqual(expectChanges);

		const pressedTrue = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__middle-part',
			expectHtml => expectHtml[1].innerHTML
		);

		expect(pressedTrue).toMatchSnapshot();

		await syncButton.click();

		const pressedFalse = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-axis-control__middle-part',
			expectHtml => expectHtml[1].innerHTML
		);

		expect(pressedFalse).toMatchSnapshot();
	});
});
