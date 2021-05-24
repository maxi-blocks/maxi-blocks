/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import openSidebar from '../../utils/openSidebar';
import { getBlockAttributes } from '../../utils';

describe('border control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the border control', async () => {
		await insertBlock('Text Maxi');
		const borderAccordion = await openSidebar(page, 'border');
		await borderAccordion.$$(
			'.maxi-border-control .maxi-default-styles-control button'
			// button => button.click()
		);

		const expectAttributes = ['solid', 'dashed', 'dotted', undefined];

		for (let i = 0; i < borderAccordion.length; i++) {
			const borderStyle = await borderAccordion[i !== 3 ? i + 1 : 0];

			await borderStyle.click();
			const attributes = await getBlockAttributes();

			expect(attributes['border-style-general']).toStrictEqual(
				expectAttributes[i]
			);
		}

		const borderType = await borderAccordion.$(
			'.components-base-control.maxi-border-control__type .components-select-control__input'
		);
		await borderType.select('groove');
		const expectBorderType = 'groove';
		const firstAttributes = await getBlockAttributes();

		expect(firstAttributes['border-style-general']).toStrictEqual(
			expectBorderType
		);

		// color

		await page.$$eval('.maxi-color-control__color input', select =>
			select[1].focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('FAFA03');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(1000);

		const expectedColorResult = 'rgba(250,250,3,1)';

		const colorAttributes = await getBlockAttributes();

		expect(colorAttributes['border-color-general']).toStrictEqual(
			expectedColorResult
		);
		/*	
		// axis panel
		const axisControls = await accordionPanel.$$(
			'.maxi-tabs-content .maxi-border-control .maxi-axis-control'
		);

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
				'border-bottom-left-radius-general': 4,
				'border-bottom-right-radius-general': 3,
				'border-bottom-width-general': 3,
				'border-left-width-general': 4,
				'border-right-width-general': 2,
				'border-top-left-radius-general': 1,
				'border-top-right-radius-general': 2,
				'border-top-width-general': 1,
				'border-unit-radius-general': '%',
				'border-unit-radius-general-hover': '%',
			};

			Object.entries(expectedAttributes).forEach(([key, value]) => {
				expect(firstAttributes[key].toString()).toBe(value);
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
			}); */
		// }
	});
});
