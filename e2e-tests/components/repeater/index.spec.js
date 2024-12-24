/**
 * WordPress dependencies
 */
import { createNewPost, setPostContent } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	editColorControl,
	getEditedPostContent,
	insertMaxiBlock,
	openSidebarTab,
} from '../../utils';
import {
	codeEditorWithContentInFirstColumn,
	codeEditorWithRepeater,
	codeEditorWithDifferentContentInColumns,
} from './content';

const toggleRepeater = async page => {
	await openSidebarTab(page, 'style', 'repeater');

	await page.waitForSelector('.maxi-repeater__toggle');
	await page.$eval('.maxi-repeater__toggle input', toggle => toggle.click());
};

const insertMaxiBlockIntoColumn = async (page, blockName, column) => {
	await page.$eval(
		`.maxi-column-block:nth-child(${column}) .maxi-block-inserter__button`,
		button => button.click()
	);

	await page.keyboard.type(blockName);
	await page.$eval('.block-editor-block-types-list__item', button =>
		button.click()
	);
	await page.waitForTimeout(2000);
};

const sanitizeEditedPostContent = content =>
	content.replace(
		/,"uniqueID":"[^"]+"|,"customLabel":"[^"]+"|\sid="[^"]+"|\s[a-zA-Z0-9-]+-u|\.\w+-u|\.\w+-\w+-u/g,
		''
	);

describe('Repeater', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Check basic adding/removing block and attributes changing', async () => {
		await insertMaxiBlock(page, 'Container Maxi');

		await page.waitForSelector('.maxi-row-block__template button');
		await page.waitForTimeout(500);

		// Click on non equal column template to check if columns will be resized on repeater toggle
		await page.$$eval('.maxi-row-block__template button', button =>
			button[2].click()
		);
		await page.waitForTimeout(350);

		await toggleRepeater(page);

		// Add button to second column
		await insertMaxiBlockIntoColumn(page, 'Button Maxi', 2);

		await page.waitForTimeout(2000);

		// Select button from second column
		await page.$eval(
			'.maxi-column-block:nth-child(2) .maxi-button-block',
			block =>
				wp.data
					.dispatch('core/block-editor')
					.selectBlock(block.getAttribute('data-block'))
		);

		await page.waitForTimeout(350);

		// Check if button was added to all columns
		expect(
			sanitizeEditedPostContent(await getEditedPostContent(page))
		).toMatchSnapshot();

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		await editColorControl({
			page,
			instance: await accordionPanel.$('.maxi-background-control'),
			paletteStatus: true,
			colorPalette: 3,
		});

		expect(
			sanitizeEditedPostContent(await getEditedPostContent(page))
		).toMatchSnapshot();

		// Remove button from second column
		page.$$eval('.maxi-button-block', button =>
			wp.data
				.dispatch('core/block-editor')
				.removeBlock(button[1].getAttribute('data-block'))
		);

		await page.waitForTimeout(2000);

		// Check if buttons were removed from all columns
		expect(
			sanitizeEditedPostContent(await getEditedPostContent(page))
		).toMatchSnapshot();
	});

	it('Check repeater columns validation on toggle when first column has content', async () => {
		// Set title
		await page.keyboard.type('Page repeater test', { delay: 350 });

		// Add code editor
		await setPostContent(codeEditorWithContentInFirstColumn);

		await page.waitForTimeout(500);

		// Select row
		await page.$eval('.maxi-row-block', block =>
			wp.data
				.dispatch('core/block-editor')
				.selectBlock(block.getAttribute('data-block'))
		);
		await page.waitForTimeout(150);

		await toggleRepeater(page);

		await page.waitForTimeout(150);

		expect(
			sanitizeEditedPostContent(await getEditedPostContent(page))
		).toMatchSnapshot();
	});

	it('Check block moving with turned on repeater', async () => {
		// Set title
		await page.keyboard.type('Page repeater test');

		// Add code editor
		await setPostContent(codeEditorWithRepeater);
		await page.waitForTimeout(1000);

		// Select text from second column
		await page.$eval(
			'.maxi-column-block:nth-child(2) .maxi-text-block',
			block =>
				wp.data
					.dispatch('core/block-editor')
					.selectBlock(block.getAttribute('data-block'))
		);
		await page.waitForTimeout(350);

		// Move text down
		await page.$$eval('.toolbar-item-move__vertically button', button =>
			button[1].click()
		);
		await page.waitForTimeout(350);

		expect(
			sanitizeEditedPostContent(await getEditedPostContent(page))
		).toMatchSnapshot();

		// Select nested(second) text from third column
		await page.$$eval(
			'.maxi-column-block:nth-child(3) .maxi-text-block',
			blocks =>
				wp.data
					.dispatch('core/block-editor')
					.selectBlock(blocks[1].getAttribute('data-block'))
		);
		await page.waitForTimeout(350);

		// Move text up
		await page.$eval('.toolbar-item-move__vertically button', button =>
			button.click()
		);
		await page.waitForTimeout(350);

		expect(
			sanitizeEditedPostContent(await getEditedPostContent(page))
		).toMatchSnapshot();
	});

	it('Check different structure popup', async () => {
		// Set title
		await page.keyboard.type('Page repeater test');

		// Add code editor
		await setPostContent(codeEditorWithDifferentContentInColumns);
		await page.waitForTimeout(500);

		// Select row
		await page.$eval('.maxi-row-block', block =>
			wp.data
				.dispatch('core/block-editor')
				.selectBlock(block.getAttribute('data-block'))
		);

		await toggleRepeater(page);

		await page.waitForSelector('.maxi-dialog-box');
		await page.waitForTimeout(150);

		// Click on cancel button
		await page.$eval('.maxi-dialog-box-buttons button', button =>
			button.click()
		);

		await page.waitForSelector('.maxi-dialog-box', { hidden: true });

		expect(
			sanitizeEditedPostContent(await getEditedPostContent(page))
		).toMatchSnapshot();

		await toggleRepeater(page);

		await page.waitForSelector('.maxi-dialog-box');
		await page.waitForTimeout(150);

		// Click on confirm button
		await page.$$eval('.maxi-dialog-box-buttons button', buttons =>
			buttons[1].click()
		);

		await page.waitForSelector('.maxi-dialog-box', { hidden: true });

		expect(
			sanitizeEditedPostContent(await getEditedPostContent(page))
		).toMatchSnapshot();
	});
});
