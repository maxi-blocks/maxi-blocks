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

	it('Test Text Maxi on pressing enter', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		await page.keyboard.press('Enter');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Test Text Maxi split', async () => {
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
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
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

		await page.$$eval(
			'.block-editor-link-control__setting',
			linkSettings => {
				linkSettings.forEach(linkSetting => {
					linkSetting
						.querySelector('.components-form-toggle__input')
						.click();
				});
			}
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
	}, 30000);

	it('Test Text Maxi toolbar Link with multiple instances', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample);
		await page.keyboard.press('Enter');

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();

		await pressKeyTimes('ArrowLeft', '2');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');

		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type('another-test.com');
		await page.keyboard.press('Enter');

		// Check content with multiple and different urls
		expect(await getEditedPostContent()).toMatchSnapshot();

		await selectMaxiTextP.focus();
		await pressKeyTimes('ArrowRight', '6');
		await page.$eval('.toolbar-item__text-link', button => button.click());

		const linkSettings = await page.$$(
			'.block-editor-link-control__setting'
		);
		await linkSettings[0].$eval('.components-form-toggle__input', setting =>
			setting.click()
		);
		await page.$eval(
			'.block-editor-link-control__search-item-action',
			button => button.click()
		);
		await pressKeyTimes('ArrowLeft', '4');
		await page.keyboard.type('ing');
		await page.keyboard.press('Enter');

		// Check content after changing one link
		expect(await getEditedPostContent()).toMatchSnapshot();

		// Check frontend
		const editorPage = page;
		const previewPage = await openPreviewPage(editorPage);
		await editorPage.waitForTimeout(1000);
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
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.$eval('.toolbar-item__bold', button => button.click());
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('Enter');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Testing Text Maxi with custom formats when merge from top block to bottom one', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi.');
		await page.keyboard.press('Enter');
		await page.keyboard.type('.Bold');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');

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
		await page.keyboard.press('Enter');
		await page.keyboard.type('.Bold');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
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
		await await pressKeyWithModifier('primary', 'v');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
