/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Interactive dependencies
 */
import {
	modalMock,
	openSidebarTab,
	addBackgroundLayer,
	getBlockStyle,
} from '../../utils';

describe('Svg fill control', () => {
	it('Check svg fill Control', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');

		await addBackgroundLayer(page, 'shape');
		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		await accordion.$$eval(
			'.maxi-tabs-control--disable-padding button',
			button => button[0].click()
		);

		await modalMock(page, { type: 'bg-shape', isBGLayers: true });
		await page.$eval('.maxi-background-layer__arrow', display =>
			display.click()
		);

		// opacity
		const opacityInput = await page.$$(
			'.maxi-color-control .maxi-advanced-number-control input'
		);

		await opacityInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('77');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
