/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	openSidebarTab,
	editAdvancedNumberControl,
	getAttributes,
} from '../../utils';

describe('TextMaxi', () => {
	it('Writes a sentence on Text Maxi', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi List', { delay: 100 });
		await page.waitForTimeout(150);

		await page.$eval(
			'.toolbar-wrapper .toolbar-item__list-options',
			button => button.click()
		);

		await page.waitForSelector(
			'.toolbar-wrapper .toolbar-item__list-options'
		);

		await page.waitForTimeout(500);

		await page.$$eval(
			'.components-popover__content .toolbar-item__popover__list-options button',
			button => button[0].click()
		);

		await openSidebarTab(page, 'style', 'list options');

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// text indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-image-inspector__list-indent '),
			newNumber: '31',
		});

		expect(await getAttributes('list-indent-general')).toStrictEqual(31);

		// List gap
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-image-inspector__list-gap '),
			newNumber: '21',
		});

		expect(await getAttributes('list-gap-general')).toStrictEqual(21);

		// Paragraph spacing
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-image-inspector__list-paragraph-spacing '
			),
			newNumber: '44',
		});

		expect(
			await getAttributes('list-paragraph-spacing-general')
		).toStrictEqual(44);

		// Marker size
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-image-inspector__list-size '),
			newNumber: '11',
		});

		expect(await getAttributes('list-size-general')).toStrictEqual(11);

		// Marker indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-image-inspector__list-marker-line-height '
			),
			newNumber: '46',
		});

		expect(
			await getAttributes('list-marker-line-height-general')
		).toStrictEqual(46);

		// Select
		// Text Position
		const textPosition = await page.$(
			'.maxi-image-inspector__list-style select'
		);
		await textPosition.select('sub');

		expect(await getAttributes('list-text-position-general')).toStrictEqual(
			'sub'
		);

		// Type of list
		const listType = await page.$(
			'.maxi-image-inspector__list-type select'
		);
		await listType.select('ul');

		expect(await getAttributes('typeOfList')).toStrictEqual('ul');

		const listTypeOrganized = await page.$(
			'.maxi-image-inspector__list-type select'
		);
		await listTypeOrganized.select('ol');

		// Style
		const style = await page.$$('.maxi-image-inspector__list-style select');
		await style[1].select('armenian');

		expect(await getAttributes('listStyle')).toStrictEqual('armenian');

		// Start From input
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-image-inspector__list-start '),
			newNumber: '78',
		});
		expect(await getAttributes('listStart')).toStrictEqual(78);
		// Reverse order button
	});
});
