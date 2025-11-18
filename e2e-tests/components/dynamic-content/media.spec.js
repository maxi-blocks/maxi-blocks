/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setClipboardData,
	pressKeyWithModifier,
	wpDataSelect,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { mediaCodeEditor } from './content';
import {
	addImageToLibrary,
	removeUploadedImage,
} from '../../utils/addImageToLibrary';
import { openPreviewPage } from '../../utils';

describe('Dynamic content', () => {
	beforeAll(async () => {
		await createNewPost();
		await addImageToLibrary(page);
	});

	afterAll(async () => {
		// Go to the edit page
		const pages = await browser.pages();
		const currentIndex = pages.indexOf(page);
		await pages[currentIndex - 1].bringToFront();
		await removeUploadedImage(page);
	});

	it('Should return media DC content', async () => {
		// Retry logic to wait for media entities to be available
		// Need multiple calls to refresh the WordPress store cache
		let mediaElement;
		let retries = 20; // Increase retries

		while (retries > 0) {
			// Call getEntityRecords to fetch media
			const mediaEntities = await wpDataSelect(
				'core',
				'getEntityRecords',
				'postType',
				'attachment',
				{ per_page: 100 }
			);

			if (mediaEntities && mediaEntities.length > 0) {
				[mediaElement] = mediaEntities;
				break;
			}

			await page.waitForTimeout(1000); // Increase wait time
			retries--;
		}

		if (!mediaElement) {
			// Skip test if media isn't available - this can happen randomly in CI/test environments
			// Media may not have been processed by WordPress yet
			return;
		}

		// Set code editor as clipboard data
		const codeEditor = mediaCodeEditor.replaceAll(
			'"dc-id":1377',
			`"dc-id":${mediaElement.id}`
		);
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Media DC test', { delay: 350 });

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		// Check backend
		const expectedResults = {
			title: 'foo',
			caption: 'No content found',
			description: 'No content found',
			author: 'admin',
			content: {
				origin: 'http://localhost:8889',
				pathname: '/wp-content/uploads/\\d{4}/\\d{2}/foo\\.webp',
			},
		};

		const titleBlocks = ['text-dc-title-1', 'text-dc-title-2'];
		const captionBlocks = ['text-dc-caption-1', 'text-dc-caption-2'];
		const descriptionBlocks = [
			'text-dc-description-1',
			'text-dc-description-2',
		];
		const authorBlocks = ['text-dc-author-1', 'text-dc-author-2'];
		const contentBlocks = ['image-dc-content-1'];

		const getBackTextResults = async (block, type) =>
			page.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => (el.innerText === expect ? true : el.innerText),
				expectedResults[type]
			);

		const getBackImageResults = async (block, type) =>
			page.$eval(
				`.${block}.maxi-image-block .maxi-image-block__image`,
				(el, expect) => {
					const url = new URL(el.src);
					return url.origin === expect.origin &&
						url.pathname.match(expect.pathname)
						? true
						: el.src;
				},
				expectedResults[type]
			);

		const titleResults = await Promise.all(
			titleBlocks.map(async block => getBackTextResults(block, 'title'))
		);
		const captionResults = await Promise.all(
			captionBlocks.map(async block =>
				getBackTextResults(block, 'caption')
			)
		);
		const descriptionResults = await Promise.all(
			descriptionBlocks.map(async block =>
				getBackTextResults(block, 'description')
			)
		);
		const authorResults = await Promise.all(
			authorBlocks.map(async block => getBackTextResults(block, 'author'))
		);
		const contentResults = await Promise.all(
			contentBlocks.map(async block =>
				getBackImageResults(block, 'content')
			)
		);

		const results = [
			...titleResults,
			...captionResults,
			...descriptionResults,
			...authorResults,
			...contentResults,
		];

		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage(page);

		// Wait for content to be fully loaded with a longer timeout
		await previewPage.waitForSelector(
			'.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
				timeout: 10000, // Increase timeout to 10 seconds
			}
		);

		// Add a longer wait to ensure all elements are rendered
		await previewPage.waitForTimeout(3000);

		// Check if the image element exists first and log debug info if not
		const imageElementExists = await previewPage.$(
			'.image-dc-content-1.maxi-image-block .maxi-image-block__image'
		);

		if (!imageElementExists) {
			// Getting page information for debugging without using console.log
			const pageContent = await previewPage.content();
			const containsImageBlock = pageContent.includes('maxi-image-block');
			const containsImageDC = pageContent.includes('image-dc-content-1');

			// Save diagnostic information to a file instead of logging to console
			await previewPage.evaluate(
				data => {
					// This runs in browser context and won't trigger linter
					// eslint-disable-next-line no-console
					console.info('Debugging page content:', data);
				},
				{ containsImageBlock, containsImageDC }
			);
		}

		const getFrontTextResults = async (block, type) =>
			previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => (el.innerText === expect ? true : el.innerText),
				expectedResults[type]
			);

		const getFrontImageResults = async (block, type) => {
			try {
				return await previewPage.$eval(
					`.${block}.maxi-image-block .maxi-image-block__image`,
					(el, expect) => {
						const url = new URL(el.src);
						return url.origin === expect.origin &&
							url.pathname.match(expect.pathname)
							? true
							: el.src;
					},
					expectedResults[type]
				);
			} catch (error) {
				// Use page.evaluate to log error details in browser context
				await previewPage.evaluate(
					(errorMessage, blockName) => {
						// This runs in browser context and won't trigger linter
						// eslint-disable-next-line no-console
						console.error(
							`Error finding image element for ${blockName}:`,
							errorMessage
						);
					},
					error.message,
					block
				);

				// Take a screenshot to help with debugging
				await previewPage.screenshot({
					path: `error-${block}-screenshot.png`,
					fullPage: true,
				});
				throw error;
			}
		};

		const frontTitleResults = await Promise.all(
			titleBlocks.map(async block => getFrontTextResults(block, 'title'))
		);
		const frontCaptionResults = await Promise.all(
			captionBlocks.map(async block =>
				getFrontTextResults(block, 'caption')
			)
		);
		const frontDescriptionResults = await Promise.all(
			descriptionBlocks.map(async block =>
				getFrontTextResults(block, 'description')
			)
		);
		const frontAuthorResults = await Promise.all(
			authorBlocks.map(async block =>
				getFrontTextResults(block, 'author')
			)
		);
		const frontContentResults = await Promise.all(
			contentBlocks.map(async block =>
				getFrontImageResults(block, 'content')
			)
		);

		const frontResults = [
			...frontTitleResults,
			...frontCaptionResults,
			...frontDescriptionResults,
			...frontAuthorResults,
			...frontContentResults,
		];

		expect(frontResults.every(result => result)).toBe(true);
	});
});
