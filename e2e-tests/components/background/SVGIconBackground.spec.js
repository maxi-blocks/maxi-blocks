/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	getEditedPostContent,
	modalMock,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Icon background', () => {
	it('Check Icon background', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Icon Maxi');

		await modalMock(page, { type: 'svg' });

		// Close model opened automatically by the block
		await page.waitForSelector(
			'.components-modal__content .components-modal__header button'
		);
		await page.$eval(
			'.components-modal__content .components-modal__header button',
			svg => svg.click()
		);

		await updateAllBlockUniqueIds(page);

		// normal state
		const accordion = await openSidebarTab(
			page,
			'style',
			'icon background'
		);

		await page.$eval('.maxi-tabs-control__button-color', button =>
			button.click()
		);

		await accordion.$$eval(
			'.maxi-color-control__palette .maxi-color-control__palette-container button',
			button => button[5].click()
		);

		// hover state
		expect(
			await getAttributes('svg-background-palette-color-xl')
		).toStrictEqual(6);

		await page.$eval('.maxi-tabs-control__button-none', button =>
			button.click()
		);

		await accordion.$eval('.maxi-tabs-control__button-hover', button =>
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
			await getAttributes('svg-background-palette-color-xl-hover')
		).toStrictEqual(7);
		expect(await getEditedPostContent(page)).toMatchSnapshot();

		await accordion.$eval(
			'.maxi-tab-content--selected .maxi-background-status-hover input',
			input => input.click()
		);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
	});
});
