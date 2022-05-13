/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	editAxisControl,
	getAttributes,
} from '../../../../utils';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

describe('CopyPaste from Toolbar', () => {
	/* beforeEach(async () => {
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
	}); */

	it('Should copy and paste bulk styles', async () => {
		await createNewPost();
		await page.waitForTimeout(1000);
		await insertBlock('Text Maxi');

		// edit text maxi
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'position'
		);
		const selectPosition = await accordionPanel.$(
			'.maxi-position-control .maxi-base-control__field select'
		);
		await selectPosition.select('relative');

		await editAxisControl({
			page,
			instance: await page.$('.maxi-position-control .maxi-axis-control'),
			syncOption: 'all',
			values: '56',
			unit: '%',
		});

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy/paste
		await page.$eval(
			'.components-popover__content .maxi-copypaste__copy-selector button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy Style
		await page.$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button.click()
		);
		await page.waitForTimeout(150);
		await insertBlock('Text Maxi');

		// open options
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy/paste
		await page.$eval(
			'.components-popover__content .maxi-copypaste__copy-selector button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		// select copy Style
		await page.$$eval(
			'.components-popover__content .toolbar-item__copy-paste__popover button',
			button => button[1].click()
		);
		await page.waitForTimeout(150);

		const expectPosition = {
			'position-top-general': 56,
			'position-bottom-general': 56,
			'position-left-general': 56,
			'position-right-general': 56,
			'position-unit-general': '%',
		};

		const positionResult = await getAttributes([
			'position-top-general',
			'position-bottom-general',
			'position-left-general',
			'position-right-general',
			'position-unit-general',
		]);

		expect(positionResult).toStrictEqual(expectPosition);
	});
	/* it('Should copy and paste styles with special paste', async () => {
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
	}); */
});
