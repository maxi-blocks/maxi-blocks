/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
	openPreviewPage,
	pressKeyTimes,
	setClipboardData,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import pasteHTML from './pasteExamples';

const linkExample = 'test.com';
describe('TextMaxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Writes a sentence on Text Maxi', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Test Text Maxi split', async () => {
		await createNewPost();

		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi...onSplit');
		await pressKeyTimes('ArrowLeft', '7');
		await page.keyboard.press('Enter');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Test Text Maxi merge', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Test Text Maxi...');
		await insertBlock('Text Maxi');
		await page.keyboard.type('...OnMerge');
		await pressKeyTimes('ArrowLeft', '11');
		await page.keyboard.press('Delete');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in whole content', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Test Text Maxi');
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample);
		await page.keyboard.press('Enter');

		expect(await getEditedPostContent()).toMatchSnapshot();

		// Check frontend
		const editorPage = page;
		const previewPage = await openPreviewPage(editorPage);
		await previewPage.waitForSelector('.entry-content');
		const content = await previewPage.$eval(
			'.entry-content',
			contentWrapper => contentWrapper.innerHTML.trim()
		);
		expect(content).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in part of the content', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Test Text Maxi');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample);
		await page.keyboard.press('Enter');

		// Check no undefined title
		expect(
			await page.$eval(
				'.block-editor-link-control__search-item-title',
				contentWrapper => contentWrapper.textContent.trim()
			)
		).toStrictEqual(`${linkExample}(opens in a new tab)`);
		expect(await getEditedPostContent()).toMatchSnapshot();

		// Check frontend
		const editorPage = page;
		const previewPage = await openPreviewPage(editorPage);
		await previewPage.waitForSelector('.entry-content');
		const content = await previewPage.$eval(
			'.entry-content',
			contentWrapper => contentWrapper.innerHTML.trim()
		);
		expect(content).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link with all option on frontend', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Test Text Maxi');
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample);
		await page.keyboard.press('Enter');

		const linkSettings = await page.$$(
			'.block-editor-link-control__setting'
		);
		linkSettings.forEach(
			async linkSetting =>
				await linkSetting.$eval(
					'.components-form-toggle__input',
					setting => setting.click()
				)
		);

		// Check frontend
		const editorPage = page;
		const previewPage = await openPreviewPage(editorPage);
		await previewPage.waitForSelector('.entry-content');
		const content = await previewPage.$eval(
			'.entry-content',
			contentWrapper => contentWrapper.innerHTML.trim()
		);
		expect(content).toMatchSnapshot();
	});

	it('Testing Text Maxi with custom formats when split', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi Bold');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		await page.$eval('.toolbar-item__bold', button => button.click());
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('Enter');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Testing Text Maxi with custom formats when merge from top block to bottom one', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi.');
		await insertBlock('Text Maxi');
		await page.keyboard.type('.Bold');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');

		await page.$eval('.toolbar-item__bold', button => button.click());
		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();
		await pressKeyTimes('ArrowRight', '18');
		await page.keyboard.press('Delete');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Testing Text Maxi with custom formats when merge from bottom block to top one', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi.');
		await insertBlock('Text Maxi');
		await page.keyboard.type('.Bold');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		await page.$eval('.toolbar-item__bold', button => button.click());
		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Backspace');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
	it('Test Text Maxi when pasting headings', async () => {
		await insertBlock('Text Maxi');

		await setClipboardData({ html: pasteHTML });
		await pressKeyWithModifier('primary', 'v');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
