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

describe('Dynamic content component for text blocks', () => {
	it('Should work correctly with author settings', async () => {
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

		// Select "Author" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('users');
		await page.waitForTimeout(2000);

		// Select "Username" as field
		const selectField = await page.$(
			'.maxi-dynamic-content .maxi-dc-field .maxi-select-control__input'
		);
		await selectField.select('username');
		await page.waitForTimeout(2000);

		expect(await getDCContent(page)).toBe('admin');

		// Select "Biographical info" as field
		await selectField.select('description');
		await page.waitForTimeout(2000);

		expect(await getDCContent(page)).toBe('No content found');

		// Select "Website" as field
		await selectField.select('url');
		await page.waitForTimeout(2000);

		expect(await getDCContent(page)).toBe('http://localhost:8889');
	});

	it('Should work correctly with post settings', async () => {
		// Select "Post" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('posts');
		await page.waitForTimeout(2000);

		// Select "Title" as field
		const selectField = await page.$(
			'.maxi-dynamic-content .maxi-dc-field .maxi-select-control__input'
		);
		await selectField.select('title');
		await page.waitForTimeout(2000);

		expect(await getDCContent(page)).toBe('Hello world!');

		// Select "Get by date" as relation
		const selectRelation = await page.$(
			'.maxi-dynamic-content .maxi-dc-relation .maxi-select-control__input'
		);
		await selectRelation.select('by-date');
		await page.waitForTimeout(2000);

		expect(await getDCContent(page)).toBe('Hello world!');

		// Increase accumulator by 1
		const accumulator = await page.$(
			'.maxi-dynamic-content .maxi-advanced-number-control input[type="number"]'
		);
		await accumulator.click();
		await page.keyboard.press('ArrowUp');
		await page.waitForTimeout(2000);

		expect(await getDCContent(page)).toBe('No content found');
	});

	it('Should work correctly with page settings', async () => {
		// Select "Page" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('pages');
		await page.waitForTimeout(3000);

		// Select "by-id" as relation
		const selectRelation = await page.$(
			'.maxi-dynamic-content .maxi-dc-relation .maxi-select-control__input'
		);
		await selectRelation.select('by-id');
		await page.waitForTimeout(3000);

		expect(await getDCContent(page)).toBe('Sample Page');

		// Select "Alphabetical" as relation
		await selectRelation.select('alphabetical');
		await page.waitForTimeout(3000);

		expect(await getDCContent(page)).toBe('No content found');

		// Decrease accumulator by 1
		const accumulator = await page.$(
			'.maxi-dynamic-content .maxi-advanced-number-control input[type="number"]'
		);
		await accumulator.click();
		await page.keyboard.press('ArrowDown');
		await page.waitForTimeout(3000);

		expect(await getDCContent(page)).toBe('Sample Page');
	});

	it('Should work correctly with category settings', async () => {
		// Select "Category" as DC type
		const selectType = await page.$(
			'.maxi-dynamic-content .maxi-dc-type .maxi-select-control__input'
		);
		await selectType.select('categories');
		await page.waitForTimeout(3000);

		// Select "Name" as field
		const selectField = await page.$(
			'.maxi-dynamic-content .maxi-dc-field .maxi-select-control__input'
		);
		await selectField.select('name');
		await page.waitForTimeout(3000);

		expect(await getDCContent(page)).toBe('Uncategorized');

		// Select "Count" as field
		await selectField.select('count');
		await page.waitForTimeout(3000);

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
		await page.waitForTimeout(3000);

		expect(await getDCContent(page)).toBe('maxi-blocks');

		// Select "Language" as field
		const selectField = await page.$(
			'.maxi-dynamic-content .maxi-dc-field .maxi-select-control__input'
		);
		await selectField.select('language');
		await page.waitForTimeout(3000);

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
		await page.waitForTimeout(3000);

		const currentYear = new Date().getFullYear();
		const currentMonth = `0${new Date().getMonth() + 1}`.slice(-2);

		expect(await getDCImageContent(page)).toBe(
			`http://localhost:8889/wp-content/uploads/${currentYear}/${currentMonth}/foo.png`
		);

		// Select "Get by date" as relation
		const selectRelation = await page.$(
			'.maxi-dynamic-content .maxi-dc-relation .maxi-select-control__input'
		);
		await selectRelation.select('by-date');
		await page.waitForTimeout(3000);

		expect(await getDCImageContent(page)).toBe(
			`http://localhost:8889/wp-content/uploads/${currentYear}/${currentMonth}/foo.png`
		);
	});
});
