/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';

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

	it(' Testing Text Maxi with custom formats when merge from top block to bottom one', async () => {
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
});
