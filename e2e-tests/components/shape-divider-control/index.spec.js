/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyTimes } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	getBlockStyle,
	editAdvancedNumberControl,
	insertMaxiBlock,
} from '../../utils';

describe('ShapeDividerControl', () => {
	it('Checking the shape divider control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');
		await page.$eval('.maxi-container-block', select => select.focus());
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'shape divider'
		);

		await accordionPanel.$eval(
			'.maxi-shape-divider-control .maxi-toggle-switch.shape-divider-top-status .maxi-base-control__label',
			click => click.click()
		);

		expect(await getAttributes('shape-divider-top-status')).toStrictEqual(
			true
		);

		// effects
		await accordionPanel.$eval(
			'.maxi-shape-divider-control .maxi-toggle-switch.shape-divider-top-effects-status .maxi-base-control__label',
			click => click.click()
		);

		expect(
			await getAttributes('shape-divider-top-effects-status')
		).toStrictEqual(true);

		// divider style
		await accordionPanel.$eval(
			'.maxi-dropdown.maxi-shape-divider-control__shape-selector button',
			modal => modal.click()
		);

		await page.$$eval(
			'.maxi-shape-divider-control__shape-list button',
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

		expect(
			await getAttributes('shape-divider-top-opacity-g')
		).toStrictEqual(0.5);

		// color
		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-color-control__palette button',
			selectColor => selectColor[3].click()
		);

		expect(await getAttributes('shape-divider-top_pc-g')).toStrictEqual(4);

		// divider height
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-shape-divider-control .maxi-shape-divider-control__height'
			),
			newNumber: '200',
		});

		expect(await getAttributes('shape-divider-top-height-g')).toStrictEqual(
			200
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
