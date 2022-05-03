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

describe('Svg Background', () => {
	it('Check Svg Background', async () => {
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

		await page.$eval('.maxi-tabs-control__button-color', button =>
			button.click()
		);

		await accordion.$$eval(
			'.maxi-color-control__palette .maxi-color-control__palette-container button',
			button => button[5].click()
		);

		// hover state
		expect(
			await getAttributes('svg-background-palette-color-general')
		).toStrictEqual(6);

		await page.$eval('.maxi-tabs-control__button-none', button =>
			button.click()
		);

		await accordion.$eval('.maxi-tabs-control__button-Hover', button =>
			button.click()
		);

		await accordion.$eval(
			'.maxi-tab-content--selected .maxi-background-status-hover input',
			input => input.click()
		);

		await page.$eval('.maxi-tabs-control__button-color', button =>
			button.click()
		);

		await accordion.$$eval(
			'.maxi-color-control__palette .maxi-color-control__palette-container button',
			button => button[6].click()
		);

		expect(
			await getAttributes('svg-background-palette-color-general-hover')
		).toStrictEqual(7);
		expect(await getEditedPostContent()).toMatchSnapshot();

		await accordion.$eval(
			'.maxi-tab-content--selected .maxi-background-status-hover input',
			input => input.click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
