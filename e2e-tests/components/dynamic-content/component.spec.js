import { createNewPost } from '@wordpress/e2e-test-utils';
import { insertMaxiBlock } from '../../utils';
import {
	addImageToLibrary,
	removeUploadedImage,
} from '../../utils/addImageToLibrary';

const getDCContent = async page =>
	page.$eval(
		'.maxi-text-block .maxi-text-block__content',
		el => el.textContent
	);

const getDCImageContent = async page =>
	page.$eval('.maxi-image-block .maxi-image-block__image', el => el.src);

/**
 * Check if the response has loaded the DC data
 * @param {HTTPResponse} response      - response object
 * @param {string}       type          - DC type
 * @param {...string}    shouldInclude - should be included in the response URL
 * @returns {boolean}
 */
const isResponseOk = (response, type, ...shouldInclude) => {
	const url = response.url();
	const endpoint = `wp/v2/${type}`;

	if (
		!(
			url.includes(encodeURIComponent(endpoint)) &&
			shouldInclude.every(include => url.includes(include))
		)
	) {
		return false;
	}

	if (response.status() !== 200) {
		throw new Error(
			`Failed to load DC data for ${type} with ${shouldInclude.join(
				', '
			)}: ${response.status()}`
		);
	}

	return true;
};

describe('Dynamic content component for text blocks', () => {
	beforeAll(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await page.waitForSelector('.toolbar-wrapper');

		// open DC editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__dynamic-content',
			button => button.click()
		);

		await page.waitForSelector('.maxi-dynamic-content');

		// Enable DC
		await page.$eval(
			'.maxi-dynamic-content .maxi-toggle-switch input',
			button => button.click()
		);
	});

	it('Should work correctly with post settings', async () => {
		// Select "Post" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('posts');
		await page.waitForResponse(response =>
			isResponseOk(response, 'posts', 'include=')
		);
		await page.waitForTimeout(300);

		// Select "Title" as field
		const selectField = await page.$(
			'.maxi-dynamic-content .maxi-dc-field .maxi-select-control__input'
		);
		await selectField.select('title');

		expect(await getDCContent(page)).toBe('Hello world!');

		// Select "Get by date" as relation
		const selectRelation = await page.$(
			'.maxi-dynamic-content .maxi-dc-relation .maxi-select-control__input'
		);
		await selectRelation.select('by-date');
		await page.waitForResponse(response =>
			isResponseOk(response, 'posts', 'orderby=date')
		);
		await page.waitForTimeout(300);

		expect(await getDCContent(page)).toBe('Hello world!');

		// Increase accumulator by 1
		const accumulator = await page.$(
			'.maxi-dynamic-content .maxi-advanced-number-control input[type="number"]'
		);
		await accumulator.click();
		await page.keyboard.press('ArrowUp');
		await page.waitForResponse(response =>
			isResponseOk(response, 'posts', 'orderby=date')
		);
		await page.waitForTimeout(300);

		expect(await getDCContent(page)).toBe('No content found');

		await selectRelation.select('by-id');
	});

	it('Should work correctly with author settings', async () => {
		// Select "Author" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('users');
		await page.waitForResponse(response =>
			isResponseOk(response, 'users', 'users%2F')
		);
		await page.waitForTimeout(300);

		// Select "Username" as field
		const selectField = await page.$(
			'.maxi-dynamic-content .maxi-dc-field .maxi-select-control__input'
		);
		await selectField.select('username');

		expect(await getDCContent(page)).toBe('admin');

		// Select "Biographical info" as field
		await selectField.select('description');

		expect(await getDCContent(page)).toBe('No content found');

		// Select "Website" as field
		await selectField.select('url');

		expect(await getDCContent(page)).toBe('http://localhost:8889');
	});

	it('Should work correctly with page settings', async () => {
		// Select "Page" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('pages');
		await page.waitForResponse(response =>
			isResponseOk(response, 'pages', 'include=')
		);
		await page.waitForTimeout(300);

		expect(await getDCContent(page)).toBe('Sample Page');

		// Select "Alphabetical" as relation
		const selectRelation = await page.$(
			'.maxi-dynamic-content .maxi-dc-relation .maxi-select-control__input'
		);
		await selectRelation.select('alphabetical');
		await page.waitForResponse(response =>
			isResponseOk(response, 'pages', 'orderby=title')
		);
		await page.waitForTimeout(300);

		expect(await getDCContent(page)).toBe('No content found');

		// Decrease accumulator by 1
		const accumulator = await page.$(
			'.maxi-dynamic-content .maxi-advanced-number-control input[type="number"]'
		);
		await accumulator.click();
		await page.keyboard.press('ArrowDown');
		await page.waitForResponse(response =>
			isResponseOk(response, 'pages', 'orderby=title')
		);
		await page.waitForTimeout(300);

		expect(await getDCContent(page)).toBe('Sample Page');

		// Select "Get by id" as relation
		await selectRelation.select('by-id');
	});

	it('Should work correctly with category settings', async () => {
		// Select "Category" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('categories');
		await page.waitForResponse(response =>
			isResponseOk(response, 'categories', 'include=')
		);
		await page.waitForTimeout(300);

		// Select "Name" as field
		const selectField = await page.$(
			'.maxi-dynamic-content .maxi-dc-field .maxi-select-control__input'
		);
		await selectField.select('name');

		expect(await getDCContent(page)).toBe('Uncategorized');

		// Select "Count" as field
		await selectField.select('count');

		expect(await getDCContent(page)).toBe('1');
	});

	it('Should work correctly with tag settings', async () => {
		// Select "Tag" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('tags');
		await page.waitForTimeout(3000);

		expect(await getDCContent(page)).toBe('No content found');
	});

	it('Should work correctly with site settings', async () => {
		// Select "Site" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('settings');
		await page.waitForTimeout(300);

		expect(await getDCContent(page)).toBe('maxi-blocks');

		// Select "Language" as field
		const selectField = await page.$(
			'.maxi-dynamic-content .maxi-dc-field .maxi-select-control__input'
		);
		await selectField.select('language');

		expect(await getDCContent(page)).toBe('en_US');
	});
});

describe('Dynamic content component for image blocks', () => {
	beforeAll(async () => {
		await createNewPost();
		await addImageToLibrary(page);
	});

	afterAll(async () => {
		await page.goto('http://localhost:8889/wp-admin/post-new.php');
		await removeUploadedImage(page);
	});

	it('Should work correctly with author settings', async () => {
		await insertMaxiBlock(page, 'Image Maxi');

		await page.waitForSelector('.toolbar-wrapper');

		// open DC editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__dynamic-content',
			button => button.click()
		);

		await page.waitForSelector('.maxi-dynamic-content');

		// Enable DC
		await page.$eval(
			'.maxi-dynamic-content .maxi-toggle-switch input',
			button => button.click()
		);

		// Select "Media" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('media');
		await page.waitForResponse(response =>
			isResponseOk(response, 'media', 'include=')
		);
		await page.waitForTimeout(300);

		const imageUrl = await getDCImageContent(page);
		const url = new URL(imageUrl);
		expect(url.origin).toBe('http://localhost:8889');
		expect(url.pathname).toMatch(
			/^\/wp-content\/uploads\/\d{4}\/\d{2}\/foo\.png$/
		);

		// Select "Get by date" as relation
		const selectRelation = await page.$(
			'.maxi-dynamic-content .maxi-dc-relation .maxi-select-control__input'
		);
		await selectRelation.select('by-date');
		await page.waitForResponse(response =>
			isResponseOk(response, 'media', 'orderby=date')
		);
		await page.waitForTimeout(300);

		const imageUrl1 = await getDCImageContent(page);
		const url1 = new URL(imageUrl1);
		expect(url1.origin).toBe('http://localhost:8889');
		expect(url1.pathname).toMatch(
			/^\/wp-content\/uploads\/\d{4}\/\d{2}\/foo\.png$/
		);
	});
});
