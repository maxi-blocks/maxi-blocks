/* eslint-disable no-return-await */
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
	getBlockStyle,
	openSidebarTab,
	editAdvancedNumberControl,
	getAttributes,
	editColorControl,
	modalMock,
} from '../../utils';

describe('List in Text-maxi', () => {
	it('Use list options', async () => {
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
			button => button[1].click()
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

		// Text Position
		const textPosition = await page.$(
			'.maxi-image-inspector__list-style select'
		);
		await textPosition.select('sub');

		expect(await getAttributes('list-text-position-general')).toStrictEqual(
			'sub'
		);
	});

	it('Check text position, style, start from in organized', async () => {
		// Start From input negative numbers
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-image-inspector__list-start '),
			newNumber: '-23',
		});
		expect(await getAttributes('listStart')).toStrictEqual(-23);

		// Style
		const style = await page.$$('.maxi-image-inspector__list-style select');
		await style[1].select('armenian');

		expect(await getAttributes('listStyle')).toStrictEqual('armenian');
		expect(await getAttributes('listStart')).toStrictEqual(-23);

		await page.waitForTimeout(150);

		// Start From input
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-image-inspector__list-start '),
			newNumber: '78',
		});

		expect(await getAttributes('listStart')).toStrictEqual(78);

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-image-inspector__list-start '),
			newNumber: '-4',
		});

		expect(await getAttributes('listStart')).toStrictEqual(0);

		// Reverse order button
		await page.$eval('.maxi-image-inspector__list-reverse input', input =>
			input.click()
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-image-inspector__list-start '),
			newNumber: '-34',
		});

		expect(await getAttributes('listStart')).toStrictEqual(4);

		// Reverse order button
		await page.$eval('.maxi-image-inspector__list-reverse input', input =>
			input.click()
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check text position, style, Unorganized Custom', async () => {
		// Select
		// Type of list
		const listType = await page.$(
			'.maxi-image-inspector__list-type select'
		);
		await listType.select('ul');

		expect(await getAttributes('typeOfList')).toStrictEqual('ul');

		// style default
		const style = await page.$$('.maxi-image-inspector__list-style select');
		await style[1].select('circle');

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Style custom
		const styleCustom = await page.$$(
			'.maxi-image-inspector__list-style select'
		);
		await styleCustom[1].select('custom');

		await page.waitForTimeout(150);

		const source = await page.$(
			'.maxi-image-inspector__list-source-selector select'
		);

		await source.select('text');
		await page.waitForTimeout(150);

		await page.$eval(
			'.maxi-image-inspector__list-source-text input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('test');

		expect(await getAttributes('listStyleCustom')).toStrictEqual('test');

		// source URL
		// expect to be properly tested
		/* await source.select('url');
		await page.$eval(
			'.maxi-image-inspector__list-source-text input',
			input => input.focus()
		);
		await pressKeyWithModifier('primary', 'a');

		await page.keyboard.type('http://placekitten.com/20/20', {
			delay: 250,
		});
		await page.waitForTimeout(500);

		expect(await getAttributes('listStyleCustom')).toStrictEqual(
			'http://placekitten.com/20/20'
		); */

		// source Icon

		await source.select('icon');

		await modalMock(page, { type: 'list-svg' });

		await editColorControl({
			page,
			instance: await page.$('.maxi-accordion-control__item__panel'),
			paletteStatus: true,
			colorPalette: 7,
		});

		expect(await getAttributes('list-palette-color')).toStrictEqual(7);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
