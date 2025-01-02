/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setClipboardData,
	pressKeyWithModifier,
	openPreviewPage,
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

describe('Dynamic content', () => {
	afterEach(async () => {
		await page.goto('http://localhost:8889/wp-admin/post-new.php');
		await removeUploadedImage(page);
	});

	it('Should return media DC content', async () => {
		await createNewPost();
		await addImageToLibrary(page);

		// Need a first call to set the results on the store
		await wpDataSelect(
			'core',
			'getEntityRecords',
			'postType',
			'attachment'
		);
		await page.waitForTimeout(1000);

		const mediaEntities = await wpDataSelect(
			'core',
			'getEntityRecords',
			'postType',
			'attachment'
		);
		const mediaElement = mediaEntities[0];

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

		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;

		// Check backend
		const expectedResults = {
			title: 'foo',
			caption: 'No content found',
			description: 'No content found',
			author: 'admin',
			content: `http://localhost:8889/wp-content/uploads/${currentYear}/${currentMonth}/foo.png`,
		};

		const titleBlocks = ['text-dc-title-1', 'text-dc-title-2'];
		const captionBlocks = ['text-dc-caption-1', 'text-dc-caption-2'];
		const descriptionBlocks = [
			'text-dc-description-1',
			'text-dc-description-2',
		];
		const authorBlocks = ['text-dc-author-1', 'text-dc-author-2'];
		const contentBlocks = ['image-dc-content-1', 'image-dc-content-2'];

		const getBackTextResults = async (block, type) =>
			page.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => (el.innerText === expect ? true : el.innerText),
				expectedResults[type]
			);

		const getBackImageResults = async (block, type) =>
			page.$eval(
				`.${block}.maxi-image-block .maxi-image-block__image`,
				(el, expect) => (el.src === expect ? true : el.src),
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
		const previewPage = await openPreviewPage();
		await previewPage.waitForSelector(
			'.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontTextResults = async (block, type) =>
			previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => (el.innerText === expect ? true : el.innerText),
				expectedResults[type]
			);

		const getFrontImageResults = async (block, type) =>
			previewPage.$eval(
				`.${block}.maxi-image-block .maxi-image-block__image`,
				(el, expect) => (el.src === expect ? true : el.src),
				expectedResults[type]
			);

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
