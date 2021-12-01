/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, openSidebarTab, getBlockStyle } from '../../utils';

describe('ShapeDividerControl', () => {
	it('Checking the shape divider control', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', select => select.focus());
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'shape divider'
		);

		await accordionPanel.$eval(
			'.maxi-shapedividercontrol .maxi-toggle-switch.shape-divider-top-status .maxi-base-control__label',
			click => click.click()
		);

		expect(await getAttributes('shape-divider-top-status')).toStrictEqual(
			true
		);

		// effects
		await accordionPanel.$eval(
			'.maxi-shapedividercontrol .maxi-toggle-switch.shape-divider-top-effects-status .maxi-base-control__label',
			click => click.click()
		);

		expect(
			await getAttributes('shape-divider-top-effects-status')
		).toStrictEqual(true);

		// divider style
		await accordionPanel.$eval(
			'.maxi-dropdown.maxi-shapedividercontrol__shape-selector button',
			modal => modal.click()
		);

		await page.$$eval(
			'.maxi-shapedividercontrol__shape-list button',
			click => click[1].click()
		);

		expect(
			await getAttributes('shape-divider-top-shape-style')
		).toStrictEqual('waves-top');

		// opacity
		await accordionPanel.$eval(
			'.maxi-advanced-number-control input',
			opacity => opacity.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		expect(await getAttributes('shape-divider-top-opacity')).toStrictEqual(
			0.5
		);

		// color
		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-color-control__palette button',
			selectColor => selectColor[3].click()
		);

		expect(
			await getAttributes('shape-divider-palette-top-color')
		).toStrictEqual(4);

		// divider height
		await accordionPanel.$$eval(
			'.maxi-shapedividercontrol .maxi-advanced-number-control input',
			input => input[2].focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('200');

		expect(await getAttributes('shape-divider-top-height')).toStrictEqual(
			200
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
