/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	setBrowserViewport,
	// pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openSidebar } from '../../utils';

describe('gradient control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the gradient control', async () => {
		await setBrowserViewport('large');

		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .components-base-control__field input',
			select => select[4].click()
		);

		const { x, y } = await page.$eval(
			'.maxi-background-control .components-custom-gradient-picker__gradient-bar',
			gradientBar => {
				const {
					x,
					y,
					width,
					height,
				} = gradientBar.getBoundingClientRect();

				const xPos = x + width / 2;
				const yPos = y + height / 2;

				return { x: xPos, y: yPos };
			}
		);

		await page.mouse.click(x, y, { delay: 1000 });
		await page.waitForSelector(
			'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover'
		);
		const colorPickerPopover = await page.$(
			'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover'
		);

		await colorPickerPopover.$eval(
			'.components-color-picker__inputs-fields input',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('24a319');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(1000);
		const expectGradient =
			'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(36,163,25) 49%,rgb(155,81,224) 100%)';

		const expectAttribute = await getBlockAttributes();

		expect(expectAttribute['background-gradient']).toStrictEqual(
			expectGradient
		);
	});
});
