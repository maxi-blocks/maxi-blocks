/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockAttributes } from '../../../../utils';
import { block } from './utils';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';
import getGroupAttributes from '../../../../../src/extensions/styles/getGroupAttributes';

describe.skip('CopyPaste from Toolbar', () => {
	beforeEach(async () => {
		await createNewPost();
		await page.waitForTimeout(1000);

		// Inserts styled block
		await page.evaluate(block => {
			window.wp.data.dispatch('core/block-editor').insertBlock(block);
		}, block);
		await page.waitForTimeout(1000);

		// Copy styles
		await page.waitForSelector('.toolbar-item__copy-paste');
		await page.$eval('.toolbar-item__copy-paste', button => button.click());
		await page.waitForSelector('.toolbar-item__copy-paste__popover');
		await page.$eval('.toolbar-item__copy-paste__popover button', button =>
			button.click()
		);

		// Set new block
		await insertBlock('Text Maxi');
	});

	it('Should copy and paste bulk styles', async () => {
		// Paste styles
		await page.waitForSelector('.toolbar-item__copy-paste');
		await page.$eval('.toolbar-item__copy-paste', button => button.click());
		await page.waitForSelector('.toolbar-item__copy-paste__popover');
		await page.$$eval('.toolbar-item__copy-paste__popover button', button =>
			button[1].click()
		);

		// Compare attributes
		const secondBlockAttr = await getBlockAttributes();
		await page.waitForSelector('.maxi-text-block');
		await page.$eval('.maxi-text-block', block => block.focus());
		const firstBlockAttr = await getBlockAttributes();

		['uniqueID', 'content', 'fullWidth'].forEach(attr => {
			delete secondBlockAttr[attr];
			delete firstBlockAttr[attr];
		});

		await expect(isEqual(firstBlockAttr, secondBlockAttr)).toBeTruthy();
	});
	it('Should copy and paste styles with special paste', async () => {
		// Paste styles
		await page.waitForSelector('.toolbar-item__copy-paste');
		await page.$eval('.toolbar-item__copy-paste', button => button.click());
		await page.waitForSelector('.toolbar-item__copy-paste__popover');
		await page.$$eval('.toolbar-item__copy-paste__popover button', button =>
			button[2].click()
		);
		await page.$$eval(
			'.toolbar-item__copy-paste__popover__item',
			pasteOptions => {
				pasteOptions.forEach(option => {
					if (
						option.querySelector('span')?.innerHTML === 'typography'
					)
						option.querySelector('input')?.click();
				});
			}
		);
		await page.$eval(
			'.toolbar-item__copy-paste__popover__button--special',
			button => button.click()
		);

		// Compare attributes
		const secondBlockAttr = await getBlockAttributes();
		const secondBlockTypography = getGroupAttributes(
			secondBlockAttr,
			'typography'
		);
		await page.waitForSelector('.maxi-text-block');
		await page.$eval('.maxi-text-block', block => block.focus());
		const firstBlockAttr = await getBlockAttributes();
		const firstBlockTypography = getGroupAttributes(
			firstBlockAttr,
			'typography'
		);

		await expect(
			isEqual(firstBlockTypography, secondBlockTypography)
		).toBeTruthy();
	});
});
