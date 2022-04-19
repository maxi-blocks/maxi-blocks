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
import { modalMock, openSidebarTab, getAttributes } from '../../utils';

describe('Svg Color', () => {
	it('Check Svg Color', async () => {
		await createNewPost();
		await insertBlock('SVG Icon Maxi');
		await modalMock(page, { type: 'svg' });

		// Close model opened automatically by the block
		await page.waitForSelector(
			'.components-modal__content .components-modal__header button'
		);
		await page.$eval(
			'.components-modal__content .components-modal__header button',
			svg => svg.click()
		);

		// normal state
		const accordion = await openSidebarTab(page, 'style', 'svg background');

		const backgroundButtons = await page.$$(
			'.maxi-background-control__simple .maxi-tabs-control__full-width button'
		);
		await backgroundButtons[1].click();

		await accordion.$$eval(
			'.maxi-color-control__palette .maxi-color-control__palette-container button',
			button => button[5].click()
		);

		// hover state
		expect(
			await getAttributes('svg-background-palette-color-general')
		).toStrictEqual(6);

		await backgroundButtons[0].click();

		await accordion.$$eval(
			'.maxi-accordion-control__item__panel--disable-padding .maxi-tabs-control button',
			button => button[1].click()
		);

		await accordion.$eval(
			'.maxi-tab-content--selected .maxi-background-status-hover input',
			input => input.click()
		);

		await page.$$eval(
			'.maxi-background-control__simple .maxi-tabs-control__full-width button',
			button => button[1].click()
		);

		await accordion.$$eval(
			'.maxi-color-control__palette .maxi-color-control__palette-container button',
			button => button[6].click()
		);

		expect(
			await getAttributes('svg-background-palette-color-general-hover')
		).toStrictEqual(7);

		await page.$$eval(
			'.maxi-background-control__simple .maxi-tabs-control__full-width button',
			button => button[0].click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
