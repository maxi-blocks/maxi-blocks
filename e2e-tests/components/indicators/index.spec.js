/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('indicators', () => {
	it('checking the indicators', async () => {
		await createNewPost();
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
		}
	});
});
