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
			await syncSelector[0].click();
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
	});
});
