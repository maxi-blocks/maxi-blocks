/* eslint-disable no-await-in-loop */
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
	pressKeyWithModifier,
	setClipboardData,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import pasteHTML from './pasteExamples';
import {
	addCustomCSS,
	getBlockAttributes,
	getBlockStyle,
	getEditedPostContent,
	openPreviewPage,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

const linkExample = 'test.com';

const clickTextStyle = async (page, type = 'bold') => {
	await page.waitForSelector('.toolbar-item__typography-control button');
	await page.$eval('.toolbar-item__typography-control button', button =>
		button.click()
	);
	await page.waitForSelector(`.toolbar-item__${type}`);
	await page.$eval(`.toolbar-item__${type}`, button => button.click());

	await page.keyboard.press('Escape');
	await page.$eval('.maxi-text-block__content', el => el.focus());
};

const pressKeyWithTimeout = async (key, times, timeout = 50) => {
	// Need some delay between pressing arrow as block needs to re-render
	for (let i = 0; i < times; i += 1) {
		await page.keyboard.press(key);

		await page.waitForTimeout(timeout);
	}
};

describe('TextMaxi', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
	});

	it('Writes a sentence on Text Maxi', async () => {
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi on pressing enter', async () => {
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi split', async () => {
		await page.keyboard.type('Testing Text Maxi...onSplit', { delay: 100 });
		await page.waitForTimeout(150);
		await pressKeyWithTimeout('ArrowLeft', 7);
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi on merge from top', async () => {
		await page.keyboard.type('Test Text Maxi...', { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await page.keyboard.type('...OnMerge', { delay: 100 });
		await pressKeyWithTimeout('ArrowLeft', 11);
		await page.waitForTimeout(150);
		await page.keyboard.press('Delete');
		await page.waitForTimeout(150);

		await updateAllBlockUniqueIds(page);
		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi on merge from bottom', async () => {
		await page.keyboard.type('Test Text Maxi...', { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await page.keyboard.type('...OnMerge', { delay: 100 });
		await pressKeyWithTimeout('ArrowLeft', 10);
		await page.waitForTimeout(150);
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(150);

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi merge from bottom to top with Custom Formats', async () => {
		await page.keyboard.type('Test Text Maxi...', { delay: 100 });
		await pressKeyWithTimeout('ArrowLeft', 3);
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await clickTextStyle(page, 'bold');
		await page.waitForTimeout(150);
		await pressKeyWithTimeout('ArrowRight', 4);
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		await page.keyboard.type('...OnMerge', { delay: 100 });
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await clickTextStyle(page, 'italic');
		await page.waitForTimeout(150);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(150);
		await pressKeyWithTimeout('ArrowRight', 20);
		await page.waitForTimeout(150);
		await page.keyboard.press('Delete');
		await page.waitForTimeout(150);

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi merge from top to bottom with Custom Formats', async () => {
		await page.keyboard.type('Test Text Maxi...', { delay: 100 });
		await pressKeyWithTimeout('ArrowLeft', 3);
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);

		await clickTextStyle(page, 'bold');
		await page.waitForTimeout(150);
		await pressKeyWithTimeout('ArrowRight', 4);
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await page.keyboard.type('...OnMerge', { delay: 100 });
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await clickTextStyle(page, 'italic');
		await page.waitForTimeout(150);
		await page.keyboard.press('ArrowDown');
		await page.waitForTimeout(150);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(150);
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(150);

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in whole content', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
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
		await page.waitForTimeout(150);
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

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in whole content, and being modifiable from the end', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		await page.keyboard.press('Escape');
		await page.waitForTimeout(150);
		await page.waitForSelector('.toolbar-item__text-link');
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);

		await page
			.waitForSelector('a.components-external-link')
			.catch(async () => {
				const selectMaxiTextDiv = await page.$('.maxi-text-block');
				const selectMaxiTextP = await selectMaxiTextDiv.$(
					'.block-editor-rich-text__editable'
				);
				await selectMaxiTextP.focus();
				await page.waitForTimeout(150);
				await page.waitForSelector('.toolbar-item__text-link');
				await page.$eval('.toolbar-item__text-link', button =>
					button.click()
				);
				await page.waitForTimeout(250);

				await page.waitForSelector('a.components-external-link');
			});

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
		await page.waitForTimeout(150);
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
		await page
			.waitForSelector('.maxi-link-control__link-destroyer')
			.catch(async () => {
				const selectMaxiTextDiv = await page.$('.maxi-text-block');
				const selectMaxiTextP = await selectMaxiTextDiv.$(
					'.block-editor-rich-text__editable'
				);
				await selectMaxiTextP.focus();
				await page.waitForTimeout(150);
				await page.waitForSelector('.toolbar-item__text-link');
				await page.$eval('.toolbar-item__text-link', button =>
					button.click()
				);
				await page.waitForTimeout(150);

				await page.waitForSelector(
					'.maxi-link-control__link-destroyer'
				);
			});

		await page.$eval('.maxi-link-control__link-destroyer', button =>
			button.click()
		);
		await page.waitForTimeout(150);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in whole content, and then removing a part', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();
		await page.keyboard.press('ArrowRight');

		await pressKeyWithTimeout('ArrowLeft', 6);
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);
		await page.$eval('.maxi-link-control__link-destroyer', button =>
			button.click()
		);
		await page.waitForTimeout(150);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
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
		await page.waitForTimeout(150);
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
		await page.waitForTimeout(150);
		await page.$eval('.maxi-link-control__link-destroyer', button =>
			button.click()
		);
		await page.waitForTimeout(150);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link in part of the content', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);
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
		expect(await getEditedPostContent(page)).toMatchSnapshot();
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
		await page.waitForTimeout(150);
		await pressKeyWithTimeout('ArrowLeft', 5);
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.waitForSelector('.toolbar-item__text-link');
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await page
			.waitForSelector('.maxi-link-control__link-destroyer')
			.catch(async () => {
				const selectMaxiTextDiv = await page.$('.maxi-text-block');
				const selectMaxiTextP = await selectMaxiTextDiv.$(
					'.block-editor-rich-text__editable'
				);
				await selectMaxiTextP.focus();
				await page.waitForTimeout(150);
				await pressKeyWithTimeout('ArrowLeft', 5);
				await page.waitForTimeout(150);
				await pressKeyWithModifier('shift', 'ArrowLeft');
				await pressKeyWithModifier('shift', 'ArrowLeft');
				await pressKeyWithModifier('shift', 'ArrowLeft');
				await pressKeyWithModifier('shift', 'ArrowLeft');
				await page.waitForTimeout(150);
				await page.waitForSelector('.toolbar-item__text-link');
				await page.$eval('.toolbar-item__text-link', button =>
					button.click()
				);
				await page.waitForTimeout(150);

				await page.waitForSelector(
					'.maxi-link-control__link-destroyer'
				);
			});

		await page.$eval('.maxi-link-control__link-destroyer', button =>
			button.click()
		);
		await page.waitForTimeout(200);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi toolbar Link with all option on frontend', async () => {
		await page.keyboard.type('Test Text Maxi', { delay: 100 });

		await page.waitForTimeout(200);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		await page.$$eval(
			'.maxi-link-control__options .maxi-toggle-switch input',
			inputs => inputs.forEach(input => input.click())
		);

		await page.waitForTimeout(200);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
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
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);
		await page.keyboard.type(linkExample, { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();

		await pressKeyWithTimeout('ArrowLeft', 2);
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);
		await page.keyboard.type('another-test.com', { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		// Check content with multiple and different urls
		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();

		await selectMaxiTextP.focus();
		await pressKeyWithTimeout('ArrowRight', 6);
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-link', button => button.click());
		await page.waitForTimeout(150);

		// Click on first option
		await page.$eval(
			'.maxi-link-control__options .maxi-toggle-switch input',
			input => input.click()
		);
		await page.waitForTimeout(150);

		await page.$eval(
			'.block-editor-link-control__search-item-action',
			button => button.click()
		);
		await page.waitForTimeout(150);
		await pressKeyWithTimeout('ArrowLeft', 4);
		await page.keyboard.type('ing', { delay: 100 });
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		// Check content after changing one link
		expect(await getEditedPostContent(page)).toMatchSnapshot();
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
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);
		await clickTextStyle(page, 'bold');
		await page.waitForTimeout(150);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(150);
		await pressKeyWithTimeout('ArrowRight', 3);
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.focus();

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Test Text Maxi when pasting headings', async () => {
		await setClipboardData({ html: pasteHTML });
		await page.waitForTimeout(150);
		await pressKeyWithModifier('primary', 'v');
		await page.waitForTimeout(150);

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it.only('Test Text Maxi on List mode and changing the font color', async () => {
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__list-options', button =>
			button.click()
		);
		await page.waitForTimeout(150);
		await page.waitForSelector(
			'.toolbar-item__popover__list-options__button'
		);
		await page.$$eval(
			'.toolbar-item__popover__list-options__button',
			buttons => buttons[1].click()
		);
		await page.waitForTimeout(150);
		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.click();
		await page.waitForTimeout(150);
		await pressKeyWithModifier('primary', 'a');
		await page.waitForTimeout(150);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(150);
		await pressKeyWithTimeout('ArrowRight', 8);
		await page.waitForTimeout(150);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(150);
		await pressKeyWithTimeout('ArrowRight', 6);
		await page.waitForTimeout(150);
		await pressKeyWithModifier('shift', 'Enter');
		await page.waitForTimeout(150);

		// Change color
		await page.waitForTimeout(500);
		await page.$eval('.toolbar-item__text-color', button => button.click());
		await page.waitForTimeout(150);
		await page.waitForSelector('.maxi-color-control__palette-box');
		await page.$$eval('.maxi-color-control__palette-box', paletteButtons =>
			paletteButtons[3].click()
		);
		await page.waitForTimeout(500);

		const {
			'palette-color-general': expectedColor,
			content: expectedContent,
		} = await getBlockAttributes();

		await page.waitForTimeout(500);

		expect(expectedColor).toBe(4);
		expect(expectedContent).toMatchSnapshot();
	});

	// Toolbar related. Waiting for #2519
	it.skip('Testing changing custom format and showing the correct value', async () => {
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);

		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await page.waitForTimeout(150);

		await page.$eval('.toolbar-item__typography-control', button =>
			button.click()
		);
		await page.waitForTimeout(150);

		const input = await page.$('.maxi-typography-control__size input');
		await input.focus();
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(200);
		await page.keyboard.press(0);
		await page.waitForTimeout(200);

		const inputValue = await input.evaluate(input => input.value);

		expect(inputValue).toStrictEqual('10');
	});
	it('Text Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
