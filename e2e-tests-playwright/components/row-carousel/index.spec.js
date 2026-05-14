/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import { openSidebarTab, test } from '../../utils';

/**
 * Helper function to setup a test post with a row block
 */
async function setupRowBlock(admin, editor, page) {
	await admin.createNewPost({ title: 'Row Carousel test' });

	// Insert a container block (row requires a container parent)
	await editor.insertBlock({ name: 'maxi-blocks/container-maxi' });

	// Wait for the container to be inserted
	await page.waitForSelector('.maxi-container-block', {
		state: 'visible',
	});

	// Wait for the row block inside the container to be visible
	await page.waitForSelector('.maxi-row-block', {
		state: 'visible',
	});

	// Click on the row block to select it
	const rowBlock = page.locator('.maxi-row-block').first();
	await rowBlock.click();
}

test.describe('Row Carousel', () => {
	test('Should enable carousel and verify basic settings', async ({
		page,
		admin,
		editor,
	}) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Check that carousel is initially disabled
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await expect(carouselToggle).not.toBeChecked();

		// Enable carousel
		await carouselToggle.click();
		await expect(carouselToggle).toBeChecked();

		// Verify carousel is enabled by checking if carousel settings are visible
		await expect(
			page.locator('.maxi-carousel-slider__trigger-width')
		).toBeVisible();
	});

	test('Should change slides per view setting', async ({
		page,
		admin,
		editor,
	}) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Enable carousel
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await carouselToggle.click();

		// Wait for carousel settings to appear
		await page.waitForSelector('.maxi-carousel-slider__trigger-width');

		// Find the "Columns per slide" control
		const columnsInput = page.locator(
			'input[aria-label="Columns per slide"]'
		);

		// Change slides per view to 3
		await columnsInput.fill('3');
		await columnsInput.blur();

		// Verify the value is set
		await expect(columnsInput).toHaveValue('3');
	});

	test('Should enable and configure autoplay', async ({
		page,
		admin,
		editor,
	}) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Enable carousel
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await carouselToggle.click();

		// Wait for carousel settings to appear
		await page.waitForTimeout(500);

		// Find and enable autoplay toggle
		const autoplayToggle = page
			.locator('.maxi-toggle-switch')
			.filter({ hasText: 'Autoplay' })
			.locator('input');
		await autoplayToggle.click();
		await expect(autoplayToggle).toBeChecked();

		// Verify pause on hover and pause on interaction are automatically enabled
		const pauseOnHoverToggle = page
			.locator('.maxi-toggle-switch')
			.filter({ hasText: 'Pause on hover' })
			.locator('input');
		await expect(pauseOnHoverToggle).toBeChecked();

		const pauseOnInteractionToggle = page
			.locator('.maxi-toggle-switch')
			.filter({ hasText: 'Pause on interaction' })
			.locator('input');
		await expect(pauseOnInteractionToggle).toBeChecked();

		// Change autoplay speed
		const autoplaySpeedInput = page.locator(
			'input[aria-label="Autoplay speed (s)"]'
		);
		await autoplaySpeedInput.fill('5');
		await autoplaySpeedInput.blur();
		await expect(autoplaySpeedInput).toHaveValue('5');
	});

	test('Should enable infinite loop', async ({ page, admin, editor }) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Enable carousel
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await carouselToggle.click();

		// Wait for carousel settings to appear
		await page.waitForTimeout(500);

		// Find and enable infinite loop toggle
		const loopToggle = page
			.locator('.maxi-toggle-switch')
			.filter({ hasText: 'Infinite loop' })
			.locator('input');
		await loopToggle.click();
		await expect(loopToggle).toBeChecked();
	});

	test('Should configure gap and peek offset', async ({
		page,
		admin,
		editor,
	}) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Enable carousel
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await carouselToggle.click();

		// Wait for carousel settings to appear
		await page.waitForTimeout(500);

		// Set gap between columns
		const gapInput = page.locator(
			'input[aria-label="Gap between columns (px)"]'
		);
		await gapInput.fill('20');
		await gapInput.blur();
		await expect(gapInput).toHaveValue('20');

		// Set peek offset
		const peekInput = page.locator('input[aria-label="Peek offset (px)"]');
		await peekInput.fill('50');
		await peekInput.blur();
		await expect(peekInput).toHaveValue('50');
	});

	test('Should enable carousel arrows', async ({ page, admin, editor }) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Enable carousel
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await carouselToggle.click();

		// Wait for carousel to be enabled
		await page.waitForTimeout(500);

		// Open the Arrows accordion
		await openSidebarTab(page, 'canvas', 'arrows');

		// Get the current state of arrows toggle
		const arrowsToggle = page.locator(
			'.maxi-carousel-arrows__toggle input'
		);
		const initialArrowState = await arrowsToggle.isChecked();

		// If initially disabled, enable it
		if (!initialArrowState) {
			await arrowsToggle.click();
			await expect(arrowsToggle).toBeChecked();
		}

		// Verify arrows toggle works
		await expect(arrowsToggle).toBeChecked();
	});

	test('Should enable carousel dots', async ({ page, admin, editor }) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Enable carousel
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await carouselToggle.click();

		// Wait for carousel to be enabled
		await page.waitForTimeout(500);

		// Open the Dots accordion
		await openSidebarTab(page, 'canvas', 'dots');

		// Get the current state of dots toggle
		const dotsToggle = page.locator('.maxi-carousel-dots__toggle input');
		const initialDotsState = await dotsToggle.isChecked();

		// If initially disabled, enable it
		if (!initialDotsState) {
			await dotsToggle.click();
			await expect(dotsToggle).toBeChecked();
		}

		// Verify dots toggle works
		await expect(dotsToggle).toBeChecked();
	});

	test('Should change transition speed', async ({ page, admin, editor }) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Enable carousel
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await carouselToggle.click();

		// Wait for carousel settings to appear
		await page.waitForTimeout(500);

		// Change transition speed
		const transitionSpeedInput = page.locator(
			'input[aria-label="Transition speed (s)"]'
		);
		await transitionSpeedInput.fill('1.5');
		await transitionSpeedInput.blur();
		await expect(transitionSpeedInput).toHaveValue('1.5');
	});

	test('Should toggle preview mode', async ({ page, admin, editor }) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Enable carousel
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await carouselToggle.click();

		// Wait for carousel settings to appear
		await page.waitForTimeout(500);

		// Find and toggle preview
		const previewToggle = page
			.locator('.maxi-toggle-switch')
			.filter({ hasText: 'Preview' })
			.locator('input');

		// Check initial state (should be unchecked)
		const initialState = await previewToggle.isChecked();

		// Toggle preview
		await previewToggle.click();

		// Verify state changed
		const newState = await previewToggle.isChecked();
		expect(newState).toBe(!initialState);
	});

	test('Should disable carousel and hide settings', async ({
		page,
		admin,
		editor,
	}) => {
		await setupRowBlock(admin, editor, page);

		// Open the Canvas tab and Carousel slider accordion
		await openSidebarTab(page, 'canvas', 'carousel slider');

		// Enable carousel first
		const carouselToggle = page.locator(
			'.maxi-carousel-slider__toggle input'
		);
		await carouselToggle.click();

		// Wait for carousel settings to appear
		await page.waitForSelector('.maxi-carousel-slider__trigger-width');

		// Verify trigger width control is visible
		await expect(
			page.locator('.maxi-carousel-slider__trigger-width')
		).toBeVisible();

		// Disable carousel
		await carouselToggle.click();
		await expect(carouselToggle).not.toBeChecked();

		// Verify carousel settings are hidden
		await expect(
			page.locator('.maxi-carousel-slider__trigger-width')
		).not.toBeVisible();
	});
});
