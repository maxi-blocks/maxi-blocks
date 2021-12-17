/* eslint-disable no-return-await */
/**
 * IMPORTANT: when testing on non-interactive there are no delay times between action, so is possible that
 * is necessary to add `await page.waitForTimeout(150);` as the `formatValue` takes that time to be saved
 */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
	pressKeyTimes,
	setClipboardData,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import pasteHTML from './pasteExamples';
import {
	getBlockAttributes,
	getBlockStyle,
	openPreviewPage,
	setAttributes,
} from '../../utils';

const linkExample = 'test.com';
describe('TextMaxi', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await setAttributes(page, { uniqueID: 'text-maxi-1' });
	});

	it('Writes a sentence on Text Maxi', async () => {
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi on pressing enter', async () => {
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi split', async () => {
		await page.keyboard.type('Testing Text Maxi...onSplit', { delay: 100 });
		await pressKeyTimes('ArrowLeft', '7');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi on merge from top', async () => {
		await page.keyboard.type('Test Text Maxi...', { delay: 100 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await page.keyboard.type('...OnMerge', { delay: 100 });
		await pressKeyTimes('ArrowLeft', '11');
		await page.keyboard.press('Delete');
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi on merge from bottom', async () => {
		await page.keyboard.type('Test Text Maxi...', { delay: 100 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await page.keyboard.type('...OnMerge', { delay: 100 });
		await pressKeyTimes('ArrowLeft', '10');
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi merge from bottom to top with Custom Formats', async () => {
		await page.keyboard.type('Test Text Maxi...', { delay: 100 });
		await pressKeyTimes('ArrowLeft', '3');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__bold', button => button.click());
		await pressKeyTimes('ArrowRight', '4');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		await page.keyboard.type('...OnMerge', { delay: 100 });
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.waitForSelector('.toolbar-item__italic');
		await page.$eval('.toolbar-item__italic', button => button.click());
		await pressKeyTimes('ArrowLeft', '5');
		await page.keyboard.press('Delete');
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi merge from top to bottom with Custom Formats', async () => {
		await page.keyboard.type('Test Text Maxi...', { delay: 100 });
		await pressKeyTimes('ArrowLeft', '3');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);

		await page.$eval('.toolbar-item__bold', button => button.click());
		await pressKeyTimes('ArrowRight', '4');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await page.keyboard.type('...OnMerge', { delay: 100 });
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.waitForSelector('.toolbar-item__italic');
		await page.$eval('.toolbar-item__italic', button => button.click());
		await pressKeyTimes('ArrowLeft', '4');
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in whole content', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Check frontend
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');
		const content = await previewPage.$eval(
			'.entry-content',
			contentWrapper => contentWrapper.innerHTML.trim()
		);
		expect(content).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in whole content, and then keep writing', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();

		await page.keyboard.type(' and its awesome features', { delay: 100 });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in whole content, and being modifiable from the end', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();
		await page.waitForTimeout(150);
		await page.waitForSelector('.toolbar-item__text-link');
		await page.$eval('.toolbar-item__text-link', button => button.click());

		await page.waitForSelector('a.components-external-link');

		const isLinkModifiable = await page.$eval(
			'a.components-external-link',
			link => link.href.length > 0
		);

		expect(isLinkModifiable).toBeTruthy();
	});

	it('Test Text Maxi toolbar Link in whole content, and then remove it', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.$eval('.toolbar-popover-link-destroyer', button =>
			button.click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in whole content, and then removing a part', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();

		await pressKeyTimes('ArrowLeft', '6');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.$eval('.toolbar-popover-link-destroyer', button =>
			button.click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();

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

	it('Test Text Maxi toolbar Link in whole content, and then removing last part', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();

		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.$eval('.toolbar-popover-link-destroyer', button =>
			button.click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in part of the content', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		// Check no undefined title
		expect(
			await page.$eval(
				'.block-editor-link-control__search-item-title',
				contentWrapper => contentWrapper.textContent.trim()
			)
		).toStrictEqual(`${linkExample}(opens in a new tab)`);
		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();

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

	it('Test Text Maxi toolbar Link in part of the content and then remove it', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await pressKeyTimes('ArrowLeft', 5);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.waitForSelector('.toolbar-item__text-link');
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await page.waitForSelector('.toolbar-popover-link-destroyer');
		await page.$eval('.toolbar-popover-link-destroyer', button =>
			button.click()
		);
		await page.waitForTimeout(200);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link with all option on frontend', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });

		await page.waitForTimeout(200);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

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
		await page.waitForTimeout(200);

		// Test is faster than human being in terms of clicking lol
		// Needs to check as the last option doesn't have time enough to be registered 👍
		await page.$$eval(
			'.block-editor-link-control__setting',
			linkSettings => {
				linkSettings.forEach(linkSetting => {
					const item = linkSetting.querySelector(
						'.components-form-toggle__input'
					);
					const { checked } = item;

					if (!checked) item.click();
				});
			}
		);
		await page.waitForTimeout(200);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();

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

	it('Test Text Maxi toolbar Link with multiple instances', async () => {
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

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
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.keyboard.type('another-test.com', { delay: 100 });
		await page.keyboard.press('Enter');

		// Check content with multiple and different urls
		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();

		await selectMaxiTextP.focus();
		await pressKeyTimes('ArrowRight', '6');
		await page.waitForTimeout(150);
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
		await page.keyboard.type('ing', { delay: 100 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		// Check content after changing one link
		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();

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

	it('Testing Text Maxi with custom formats when split a word at middle', async () => {
		await page.keyboard.type('Testing Text Maxi Bold', { delay: 100 });
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__bold', button => button.click());
		await page.waitForTimeout(150);
		await page.keyboard.press('ArrowLeft');
		await pressKeyTimes('ArrowRight', 3);
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it.skip('Test Text Maxi when pasting headings', async () => {
		await setClipboardData({ html: pasteHTML });
		await pressKeyWithModifier('primary', 'v');
		await page.waitForTimeout(150);
		await setAttributes(page, { uniqueID: 'text-maxi-1' });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi on List mode and changing the font color', async () => {
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__list-options', button =>
			button.click()
		);
		await page.waitForSelector(
			'.toolbar-item__popover__list-options__button'
		);
		await page.$eval(
			'.toolbar-item__popover__list-options__button',
			button => button.click()
		);
		await page.waitForTimeout(150);
		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();
		await pressKeyTimes('ArrowRight', '8');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await pressKeyTimes('ArrowRight', '5');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const { content: expectedContent } = await getBlockAttributes();

		expect(expectedContent).toMatchSnapshot();

		// Change color
		await page.waitForTimeout(200);
		await page.$eval('.toolbar-item__text-options--color', button =>
			button.click()
		);
		await page.waitForSelector('.maxi-color-control__palette-box');
		await page.$$eval('.maxi-color-control__palette-box', paletteButtons =>
			paletteButtons[3].click()
		);

		const {
			'palette-color-general': expectedColor,
			content: expectedContent2,
		} = await getBlockAttributes();

		expect(expectedColor).toBe(4);
		expect(expectedContent2 === expectedContent).toBeTruthy();
	});

	it('Testing changing custom format and showing the correct value', async () => {
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);

		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');

		await page.$eval('.toolbar-item__typography-control', button =>
			button.click()
		);

		const input = await page.$('.maxi-typography-control__size input');
		await input.focus();
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(200);
		await page.keyboard.press(0);
		await page.waitForTimeout(200);

		const inputValue = await input.evaluate(input => input.value);

		expect(inputValue).toStrictEqual('10');
	});
});
