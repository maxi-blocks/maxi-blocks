/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyTimes } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes } from '../../utils';

describe('StyleCards', () => {
	it.only('Check link', async () => {
		await createNewPost();
		debugger;
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[3].click()
		);
		const linkAccordion = await page.$('.maxi-blocks-sc__type--link');
		const linkButtons = await page.$$(
			'.maxi-blocks-sc__type--link .maxi-fancy-radio-control .maxi-radio-control__option label'
		);

		// Use Global Link Colour
		await linkButtons[0].click();

		await linkAccordion.$eval('.maxi-color-control__color input', input =>
			input.click()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Use Global Link Hover Colour

		// Use Global Link Active Colour

		// Use Global Link Visited Colour

		expect(className).toStrictEqual(additionalClass);
	});
	it('Check style cards', async () => {
		await createNewPost();

		// Style Card Editor
		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);
		await page.$$eval(
			'.maxi-responsive-selector .action-buttons__button',
			button => button[1].click()
		);
		const styleCard = await page.$('.components-popover__content');

		const styleCardAccordion = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);

		// Quick Pick Colour Presets
		await styleCardAccordion[0].click();

		await styleCard.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Button
		debugger;
		await styleCardAccordion[1].click();

		await styleCard.$eval(
			'.maxi-typography-control .maxi-font-family-selector span',
			input => input.click()
		);
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');

		// size
		await styleCard.$$eval(
			'.maxi-blocks-sc__type--button .maxi-base-control__field input',
			select => select[2].focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('10');

		// line-height
		await styleCard.$$eval(
			'.maxi-blocks-sc__type--button .maxi-base-control__field input',
			select => select[4].focus()
		);
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('4');

		// letter-spacing
		await styleCard.$$eval(
			'.maxi-blocks-sc__type--button .maxi-base-control__field input',
			select => select[6].focus()
		);
		await page.keyboard.type('10');

		// Paragraph

		// Link

		// Headings

		// Hover
		await styleCardAccordion[5].click();
		await styleCard.$eval(
			'.maxi-blocks-sc__type--hover .maxi-radio-control__option label',
			button => button.click()
		);

		await styleCard.$$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input[1].focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('320AC9');

		await styleCard.$eval(
			'.maxi-blocks-sc__type--hover .maxi-advanced-number-control input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		// SVG Icon
		await styleCardAccordion[6].click();

		// Use Global SVG Icon Colour
		await styleCard.$eval(
			'.maxi-blocks-sc__type--icon .maxi-radio-control__option label',
			button => button.click()
		);

		await styleCard.$$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input[2].focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('320AC9');

		await styleCard.$eval(
			'.maxi-blocks-sc__type--icon .maxi-advanced-number-control input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		await styleCard.$$eval(
			'.maxi-blocks-sc__type--icon .maxi-radio-control__option label',
			button => button[1].click()
		);

		// Use Global Fill Colour
		await styleCard.$$eval(
			'.maxi-blocks-sc__type--icon .maxi-radio-control__option label',
			button => button[2].click()
		);

		await styleCard.$$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input[6].focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('320AC9');

		await styleCard.$eval(
			'.maxi-blocks-sc__type--icon .maxi-advanced-number-control input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		// Divider
		await styleCardAccordion[7].click();
		await styleCard.$eval(
			'.maxi-blocks-sc__type--divider .maxi-radio-control__option label',
			button => button.click()
		);

		await styleCard.$$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input[2].focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('320AC9');

		await styleCard.$eval(
			'.maxi-blocks-sc__type--divider .maxi-advanced-number-control input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		expect(className).toStrictEqual(additionalClass);
	});
});
