/**
 * WordPress dependencies
 */
import { expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import { test } from '../../utils';

test.describe('Style Cards', () => {
	test('shows hex labels for unnamed custom colours', async ({
		admin,
		page,
	}) => {
		await admin.createNewPost();

		await page
			.locator(
				'.edit-post-header .edit-post-header__toolbar .maxi-toolbar-layout button'
			)
			.click();
		await page.locator('#maxi-button__style-cards').click();

		await page.locator('.maxi-style-cards-customise-card-button').click();
		await page
			.locator('.maxi-style-cards__sc__save > input')
			.fill(`Playwright custom colour ${Date.now()}`);
		await page
			.locator('.maxi-style-cards__sc__save > button:nth-child(2)')
			.click();

		await page
			.locator(
				'.maxi-blocks-sc__type--custom-color-presets .maxi-accordion-control__item__button'
			)
			.click();
		await page
			.locator('.maxi-style-cards__custom-color-presets__add-button')
			.click();

		const customColor = page.locator(
			'.maxi-style-cards__custom-color-presets__box'
		);
		const hexLabel = await customColor.getAttribute('title');

		expect(hexLabel).toMatch(/^#[0-9A-F]{6}$/);
		await expect(
			customColor.locator(
				'.maxi-style-cards__custom-color-presets__remove-button'
			)
		).toHaveAttribute('title', `Remove ${hexLabel}`);
	});
});
