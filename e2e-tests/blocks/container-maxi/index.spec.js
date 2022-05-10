/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	addCustomCSS,
	openSidebarTab,
	addBackgroundLayer,
} from '../../utils';

describe('Container Maxi', () => {
	it('Container Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Container Maxi Custom CSS', async () => {
		await addBackgroundLayer(page, 'color');
		await addBackgroundLayer(page, 'color');

		const accordionTab = await openSidebarTab(
			page,
			'advanced',
			'custom css'
		);

		const customCssSelector = await accordionTab.$(
			'.maxi-typography-control__text-options-tabs .maxi-custom-css-control__category select'
		);
		await customCssSelector.select('background');

		// check first background

		await accordionTab.$eval(
			'.maxi-additional__css-background_color_1 textarea',
			input => input.focus()
		);

		await page.keyboard.type('background: red');

		// check second background
		await accordionTab.$eval(
			'.maxi-additional__css-background_color_2 textarea',
			input => input.focus()
		);

		await page.keyboard.type('background: blue');

		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
