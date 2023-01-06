/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	addTypographyStyle,
	editAdvancedNumberControl,
	getAttributes,
	getBlockStyle,
	getEditedPostContent,
	openSidebarTab,
	setAttributes,
} from '../../utils';

describe('Text list options control', () => {
	it('Check indent options and styles', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await setAttributes(page, { uniqueID: 'text-maxi-1' });
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
		await page.waitForTimeout(150);
		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.click();
		await page.waitForTimeout(150);

		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await pressKeyWithModifier('shift', 'Enter');
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();

		const accordion = await openSidebarTab(page, 'style', 'list options');

		// Change marker indent
		await editAdvancedNumberControl({
			page,
			instance: await accordion.$(
				'.maxi-text-inspector__list-marker-indent'
			),
			newNumber: '40',
		});

		expect(await getAttributes('list-marker-indent-general')).toStrictEqual(
			40
		);

		// Change text indent
		await editAdvancedNumberControl({
			page,
			instance: await accordion.$('.maxi-text-inspector__list-indent'),
			newNumber: '23',
		});

		expect(await getAttributes('list-indent-general')).toStrictEqual(23);

		await openSidebarTab(page, 'style', 'typography');

		await addTypographyStyle({
			instance: page,
			direction: 'rtl',
		});

		expect(await getAttributes('text-direction-general')).toStrictEqual(
			'rtl'
		);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
