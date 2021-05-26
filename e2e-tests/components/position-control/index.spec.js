/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('position control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the position control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing position');
		const accordionPanel = await openAdvancedSidebar(page, 'position');
		debugger;
		// position selector
		const selectPosition = await accordionPanel.$(
			'.components-position-control .components-base-control__field .components-select-control__input select'
		);
		await selectPosition.$$('option');
		await selectPosition.select('relative');

		const expectSelectPosition = 'relative';
		const attributes = await getBlockAttributes();

		expect(attributes['position-general']).toStrictEqual(
			expectSelectPosition
		);
		// Set value to inputs
		const positionAxis = await accordionPanel.$(
			'.maxi-axis-control .maxi-axis-control__content'
		);
		const inputs = await positionAxis.$$(
			'.maxi-axis-control__content__item__input'
		);

		for (let j = 0; j < inputs.length; j++) {
			const input = inputs[j];

			await input.focus();
			await page.keyboard.press((j + 1).toString());

			const expectPosition = {
				'position-bottom-general': 3,
				'position-left-general': 4,
				'position-right-general': 2,
				'position-top-general': 1,
				// 'position-unit-general': '%',
			};

			const positionAttributes = await getBlockAttributes();

			expect(positionAttributes).toStrictEqual(expectPosition);
		}
		// unit selector
		const unitSelector = await accordionPanel.$(
			'.components-base-control.maxi-axis-control__header .maxi-axis-control__units select'
		);

		const unitOptions = await unitSelector.$$('options');
		await unitSelector.select('%');

		const firstAttributes = await getBlockAttributes();
	});
});
