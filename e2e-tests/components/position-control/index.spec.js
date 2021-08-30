/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openAdvancedSidebar,
	changeResponsive,
} from '../../utils';

describe('PositionControl', () => {
	it('Checking the position control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
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
		const inputs = await accordionPanel.$$(
			'.maxi-axis-control .maxi-axis-control__content .maxi-axis-control__content__item__input'
		);

		/* eslint-disable no-await-in-loop */
		for (let j = 0; j < inputs.length; j += 1) {
			const input = inputs[j];

			await input.focus();
			await page.keyboard.press((j + 1).toString());
		}
		const expectPosition = {
			'position-top-general': 1,
			'position-bottom-general': 2,
			'position-left-general': 3,
			'position-right-general': 4,
		};

		const pageAttributes = await getBlockAttributes();
		const positionAttributes = (({
			'position-top-general': positionTop,
			'position-bottom-general': positionBottom,
			'position-left-general': positionLeft,
			'position-right-general': positionRight,
		}) => ({
			'position-top-general': positionTop,
			'position-bottom-general': positionBottom,
			'position-left-general': positionLeft,
			'position-right-general': positionRight,
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

	it('Check Responsive position control', async () => {
		await changeResponsive(page, 's');
		await page.$eval('.maxi-text-block', block => block.focus());

		const positionSelector = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			button => button.selectedOptions[0].innerHTML
		);

		expect(positionSelector).toStrictEqual('Relative');

		// responsive S
		const accordionPanel = await openAdvancedSidebar(page, 'position');
		await changeResponsive(page, 's');

		const selector = await accordionPanel.$(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input '
		);
		await selector.select('absolute');

		const responsiveSOption = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			selectedStyle => selectedStyle.selectedOptions[0].innerHTML
		);

		expect(responsiveSOption).toStrictEqual('Absolute');

		const positionAttributes = await getBlockAttributes();
		const positionSAttribute = positionAttributes['position-s'];
		expect(positionSAttribute).toStrictEqual('absolute');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			selectedStyle => selectedStyle.selectedOptions[0].innerHTML
		);

		expect(responsiveXsOption).toStrictEqual('Absolute');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			selectedStyle => selectedStyle.selectedOptions[0].innerHTML
		);

		expect(responsiveMOption).toStrictEqual('Relative');
	});
});
