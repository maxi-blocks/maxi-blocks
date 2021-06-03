/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('position control', () => {
	it('checking the position control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing position');
		const accordionPanel = await openAdvancedSidebar(page, 'position');

		const selectPosition = await accordionPanel.$(
			'.maxi-position-control .maxi-base-control__field select'
		);
		await selectPosition.select('relative');

		const attributes = await getBlockAttributes();
		const position = attributes['position-general'];
		const expectSelectPosition = 'relative';

		expect(position).toStrictEqual(expectSelectPosition);

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
		}
		const expectPosition = {
			'position-bottom-general': 3,
			'position-left-general': 4,
			'position-right-general': 2,
			'position-top-general': 1,
		};

		const pageAttributes = await getBlockAttributes();
		const positionAttributes = (({
			'position-bottom-general': positionBottom,
			'position-left-general': positionLeft,
			'position-right-general': positionRight,
			'position-top-general': positionTop,
		}) => ({
			'position-bottom-general': positionBottom,
			'position-left-general': positionLeft,
			'position-right-general': positionRight,
			'position-top-general': positionTop,
		}))(pageAttributes);

		expect(positionAttributes).toStrictEqual(expectPosition);

		// unit selector
		const unitSelector = await accordionPanel.$(
			'.maxi-axis-control .maxi-axis-control__header .maxi-axis-control__units select'
		);

		await unitSelector.select('%');

		const unitAttributes = await getBlockAttributes();
		const unit = unitAttributes['position-unit-general'];
		const expectUnit = '%';

		expect(unit).toStrictEqual(expectUnit);
	});
});
