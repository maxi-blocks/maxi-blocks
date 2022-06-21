/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, openSidebarTab, editColorControl } from '../../utils';

describe('Shape divider', () => {
	it('Checking the shape divider', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', select => select.focus());
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'shape divider'
		);

		// top shape divider
		await accordionPanel.$eval(
			'.maxi-shape-divider-control .maxi-toggle-switch.shape-divider-top-status .maxi-base-control__label',
			click => click.click()
		);

		await page.$eval(
			'.maxi-shape-divider-control__shape-selector button',
			button => button.click()
		);

		await page.waitForTimeout(300);

		// select shape
		await page.$eval(
			'.components-popover__content .maxi-shape-divider-control__shape-list .maxi-tabs-control__button-waves-top',
			button => button.click()
		);

		expect(
			await getAttributes('shape-divider-top-shape-style')
		).toStrictEqual('waves-top');

		// top attributes
		await page.$eval('.maxi-opacity-control input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('88');

		expect(await getAttributes('shape-divider-top-opacity')).toStrictEqual(
			0.88
		);

		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-tab-content .maxi-color-palette-control .maxi-color-control__palette'
			),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(
			await getAttributes('shape-divider-top-palette-color')
		).toStrictEqual(5);

		await page.$eval(
			'.maxi-tabs-content .maxi-divider-height input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('70');

		expect(await getAttributes('shape-divider-top-height')).toStrictEqual(
			70
		);

		// bottom shape
		await accordionPanel.$eval(
			'.maxi-shape-divider-control .maxi-tabs-control .maxi-tabs-control__button-Bottom',
			click => click.click()
		);

		await page.$eval(
			'.maxi-shape-divider-control .maxi-tabs-content .shape-divider-bottom-status input',
			button => button.click()
		);

		await page.$eval(
			'.maxi-shape-divider-control__shape-selector button',
			button => button.click()
		);

		await page.waitForTimeout(300);

		// select shape
		await page.$eval(
			'.components-popover__content .maxi-shape-divider-control__shape-list .maxi-tabs-control__button-waves-bottom',
			button => button.click()
		);
		expect(
			await getAttributes('shape-divider-bottom-shape-style')
		).toStrictEqual('waves-bottom');

		// bottom attributes
		await page.$eval('.maxi-opacity-control input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		expect(
			await getAttributes('shape-divider-bottom-opacity')
		).toStrictEqual(0.44);

		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-tab-content .maxi-color-palette-control .maxi-color-control__palette'
			),
			paletteStatus: true,
			colorPalette: 7,
		});

		expect(
			await getAttributes('shape-divider-bottom-palette-color')
		).toStrictEqual(7);

		await page.$$eval(
			'.maxi-tabs-content .maxi-advanced-number-control input',
			input => input[2].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('50');

		expect(
			await getAttributes('shape-divider-bottom-height')
		).toStrictEqual(50);
	});
});
