/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	openSidebarTab,
	getAttributes,
	editColorControl,
} from '../../utils';

describe('Button Maxi', () => {
	it('Button Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		await page.keyboard.type('Hello', { delay: 100 });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Button Style', async () => {
		await openSidebarTab(page, 'style', 'style shortcut');

		const buttons = await page.$$('.maxi-button-default-styles button');
		await buttons[4].click();

		await expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Button Icon', async () => {
		await openSidebarTab(page, 'style', 'icon');

		// Width spacing
		await page.$$eval(
			'.maxi-tabs-content .maxi-icon-control .maxi-advanced-number-control input',
			select => select[0].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('343');

		//  stroke Width
		await page.$$eval(
			'.maxi-tabs-content .maxi-icon-control .maxi-advanced-number-control input',
			select => select[2].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('2');

		// spacing
		await page.$$eval(
			'.maxi-tabs-content .maxi-icon-control .maxi-advanced-number-control input',
			select => select[4].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('14');

		const attributes = await getAttributes([
			'icon-width-general',
			'icon-stroke-general',
			'icon-spacing-general',
		]);

		const expectedAttributesTwo = {
			'icon-width-general': 343,
			'icon-stroke-general': 2,
			'icon-spacing-general': 14,
		};

		expect(attributes).toStrictEqual(expectedAttributesTwo);

		// icon color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-palette-control'),
			paletteStatus: true,
			colorPalette: 5,
		});

		await page.$$eval(
			'.maxi-icon-styles-control .maxi-tabs-control__full-width button',
			button => button[1].click()
		);

		await editColorControl({
			page,
			instance: await page.$('.maxi-color-palette-control'),
			paletteStatus: true,
			colorPalette: 6,
		});

		expect(await getAttributes('icon-palette-color')).toStrictEqual(5);
		expect(
			await getAttributes('icon-border-palette-color-general')
		).toStrictEqual(6);
	});
});
