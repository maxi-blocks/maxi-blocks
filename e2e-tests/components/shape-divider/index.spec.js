/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	editColorControl,
	addResponsiveTest,
	changeResponsive,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Shape divider', () => {
	it('Checking the shape divider', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);
		await page.$eval('.maxi-container-block', select => select.focus());
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'shape divider'
		);

		await page.waitForTimeout(300);

		// Top shape divider
		await accordionPanel.$eval(
			'.maxi-shape-divider-control .maxi-toggle-switch.shape-divider-top-status .maxi-base-control__label',
			click => click.click()
		);

		await page.waitForTimeout(300);

		await page.$eval(
			'.maxi-shape-divider-control__shape-selector button',
			button => button.click()
		);

		await page.waitForTimeout(300);

		// Select shape
		await page.$eval(
			'.components-popover__content .maxi-shape-divider-control__shape-list .maxi-tabs-control__button-waves-top',
			button => button.click()
		);

		await page.waitForTimeout(300);

		expect(
			await getAttributes('shape-divider-top-shape-style')
		).toStrictEqual('waves-top');

		// Top attributes
		await page.$eval('.maxi-opacity-control input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('88', { delay: 350 });

		expect(
			await getAttributes('shape-divider-top-opacity-xl')
		).toStrictEqual(0.88);

		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-tab-content .maxi-color-palette-control .maxi-color-control__palette'
			),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(
			await getAttributes('shape-divider-top-palette-color-xl')
		).toStrictEqual(5);

		await page.waitForTimeout(500);

		await page.$eval(
			'.maxi-tabs-content .maxi-shape-divider-control__height input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('70', { delay: 350 });

		expect(
			await getAttributes('shape-divider-top-height-xl')
		).toStrictEqual(70);

		// Bottom shape
		await accordionPanel.$eval(
			'.maxi-shape-divider-control .maxi-tabs-control .maxi-tabs-control__button-bottom',
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

		// Select shape
		await page.$eval(
			'.components-popover__content .maxi-shape-divider-control__shape-list .maxi-tabs-control__button-waves-bottom',
			button => button.click()
		);
		expect(
			await getAttributes('shape-divider-bottom-shape-style')
		).toStrictEqual('waves-bottom');

		// Bottom attributes
		await page.$eval('.maxi-opacity-control input', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44', { delay: 350 });

		expect(
			await getAttributes('shape-divider-bottom-opacity-xl')
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
			await getAttributes('shape-divider-bottom-palette-color-xl')
		).toStrictEqual(7);

		// Divider height
		await page.$eval(
			'.maxi-tabs-content .maxi-shape-divider-control__height input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('254', { delay: 350 });

		expect(
			await getAttributes('shape-divider-bottom-height-xl')
		).toStrictEqual(254);
	});
	it('Checking the shape divider responsive', async () => {
		// responsive bottom
		// Bottom height responsive
		const responsiveBottomHeight = await addResponsiveTest({
			page,
			instance:
				'.maxi-tabs-content .maxi-shape-divider-control__height input',
			needFocus: true,
			baseExpect: '254',
			xsExpect: '231',
			newValue: '231',
		});
		expect(responsiveBottomHeight).toBeTruthy();

		// Bottom opacity responsive
		const responsiveBottomHeightOpacity = await addResponsiveTest({
			page,
			instance: '.maxi-opacity-control input',
			needFocus: true,
			baseExpect: '44',
			xsExpect: '66',
			newValue: '66',
		});
		expect(responsiveBottomHeightOpacity).toBeTruthy();

		// Bottom color responsive
		await changeResponsive(page, 's');
		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-tab-content .maxi-color-palette-control .maxi-color-control__palette'
			),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(
			await getAttributes('shape-divider-bottom-palette-color-s')
		).toStrictEqual(5);
		// Change xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-tab-content .maxi-color-palette-control .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('5');

		// Change m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-tab-content .maxi-color-palette-control .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('7');

		// Top attributes responsive
		// Change base
		await changeResponsive(page, 'base');

		// Change top
		await page.$eval(
			'.maxi-shape-divider-control .maxi-tabs-control .maxi-tabs-control__button-top',
			click => click.click()
		);

		const responsiveTopHeight = await addResponsiveTest({
			page,
			instance:
				'.maxi-tabs-content .maxi-shape-divider-control__height input',
			needFocus: true,
			baseExpect: '70',
			xsExpect: '45',
			newValue: '45',
		});
		expect(responsiveTopHeight).toBeTruthy();

		// Bottom opacity responsive
		const responsiveTopHeightOpacity = await addResponsiveTest({
			page,
			instance: '.maxi-opacity-control input',
			needFocus: true,
			baseExpect: '88',
			xsExpect: '24',
			newValue: '24',
		});
		expect(responsiveTopHeightOpacity).toBeTruthy();

		// Top color responsive
		await changeResponsive(page, 's');
		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-tab-content .maxi-color-palette-control .maxi-color-control__palette'
			),
			paletteStatus: true,
			colorPalette: 2,
		});

		expect(
			await getAttributes('shape-divider-top-palette-color-s')
		).toStrictEqual(2);
		// Change xs
		await changeResponsive(page, 'xs');

		const xsColorSelectedTop = await page.$eval(
			'.maxi-tab-content .maxi-color-palette-control .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelectedTop).toStrictEqual('2');

		// Change m
		await changeResponsive(page, 'm');

		const mColorSelectedTop = await page.$eval(
			'.maxi-tab-content .maxi-color-palette-control .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelectedTop).toStrictEqual('5');
	});
});
