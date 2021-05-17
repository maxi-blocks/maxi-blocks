/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	// getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

describe('axis control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the axis control', async () => {
		await insertBlock('Text Maxi');

		const accordionPanel = await openSidebar(page, 'padding margin');

		const axisControls = await accordionPanel.$$('.maxi-axis-control');

		const instances = ['padding', 'margin'];

		for (let i = 0; i < axisControls.length; i++) {
			const axisControl = await axisControls[i];

			const inputs = await axisControl.$$(
				'.maxi-axis-control__content__item__input'
			);

			// Set value to inputs
			for (let j = 0; j < inputs.length; j++) {
				const input = inputs[j];

				await input.focus();
				await page.keyboard.press((j + 1).toString());
			}

			// Change unit selector
			const unitSelector = await axisControl.$(
				'.maxi-axis-control__units select'
			);
			const unitOptions = await unitSelector.$$('options');
			await unitSelector.select('%');

			const firstAttributes = await getBlockAttributes();

			const expectedAttributes = {
				[`${instances[i]}-bottom-general`]: '3',
				[`${instances[i]}-left-general`]: '4',
				[`${instances[i]}-right-general`]: '2',
				[`${instances[i]}-top-general`]: '1',
				[`${instances[i]}-unit-general`]: '%',
			};

			Object.entries(expectedAttributes).forEach(([key, value]) => {
				expect(firstAttributes[key].toString()).toBe(value);
			});

			// Synchronizing inputs
			const syncSelector = await axisControl.$(
				'.maxi-axis-control__content__item button'
			);
			await syncSelector.click();

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
				'.components-base-control__field button'
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
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
			'margin-top-general',
		];

		debugger;
		const fourthAttributes = await getBlockAttributes();

		const areAllAuto = marginKeys.every(key => {
			return fourthAttributes[key] === 'auto';
		});

		expect(areAllAuto).toStrictEqual(true);
	});
});
