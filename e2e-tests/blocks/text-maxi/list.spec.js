/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

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
	addTypographyStyle,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

/**
 *
 * @param {string} content   - Text to be added in the block
 * @param {number} typeIndex - Index of the list type to be selected
 */
const createTextWithList = async (
	content = 'Testing Text Maxi List',
	typeIndex = 1
) => {
	await insertMaxiBlock(page, 'Text Maxi');
	await updateAllBlockUniqueIds(page);

	await page.keyboard.type(content, { delay: 100 });
	await page.waitForTimeout(150);

	await page.$eval('.toolbar-wrapper .toolbar-item__list-options', button =>
		button.click()
	);

	await page.waitForSelector('.toolbar-wrapper .toolbar-item__list-options');

	await page.waitForTimeout(500);

	await page.$$eval(
		'.components-popover__content .toolbar-item__popover__list-options button',
		(button, index) => button[index].click(),
		typeIndex
	);
};

describe('List in Text-maxi', () => {
	it('Use list options with list style position inside', async () => {
		await createNewPost();
		await createTextWithList();
		await openSidebarTab(page, 'style', 'list options');

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Text style position
		const textStylePosition = await page.$(
			'.maxi-text-inspector__list-style-position select'
		);
		await textStylePosition.select('outside');

		// text indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-indent '),
			newNumber: '31',
		});

		expect(await getAttributes('list-indent-general')).toStrictEqual(31);

		// List gap
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-gap '),
			newNumber: '21',
		});

		expect(await getAttributes('list-gap-general')).toStrictEqual(21);

		// Paragraph spacing
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-text-inspector__list-paragraph-spacing '
			),
			newNumber: '44',
		});

		expect(
			await getAttributes('list-paragraph-spacing-general')
		).toStrictEqual(44);

		// Marker size
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-size '),
			newNumber: '11',
		});

		expect(await getAttributes('list-marker-size-general')).toStrictEqual(
			11
		);

		// Marker indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-text-inspector__list-marker-line-height '
			),
			newNumber: '46',
		});

		expect(
			await getAttributes('list-marker-line-height-general')
		).toStrictEqual(46);

		// Text Position
		const textPosition = await page.$(
			'.maxi-text-inspector__list-style select'
		);
		await textPosition.select('sub');

		expect(await getAttributes('list-text-position-general')).toStrictEqual(
			'sub'
		);
	});

	it('Check options with different units', async () => {
		// text indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-indent '),
			newNumber: '3',
			newValue: 'em',
		});

		expect(await getAttributes('list-indent-general')).toStrictEqual(3);
		expect(await getAttributes('list-indent-unit-general')).toStrictEqual(
			'em'
		);

		// List gap
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-gap '),
			newNumber: '21',
			newValue: '%',
		});

		expect(await getAttributes('list-gap-general')).toStrictEqual(21);
		expect(await getAttributes('list-gap-unit-general')).toStrictEqual('%');

		// Paragraph spacing
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-text-inspector__list-paragraph-spacing '
			),
			newNumber: '44',
			newValue: 'px',
		});

		expect(
			await getAttributes('list-paragraph-spacing-general')
		).toStrictEqual(44);
		expect(
			await getAttributes('list-paragraph-spacing-unit-general')
		).toStrictEqual('px');

		// Marker size
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-size '),
			newNumber: '11',
			newValue: 'px',
		});

		expect(await getAttributes('list-marker-size-general')).toStrictEqual(
			11
		);
		expect(
			await getAttributes('list-marker-size-unit-general')
		).toStrictEqual('px');

		// Marker indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-text-inspector__list-marker-line-height '
			),
			newNumber: '16',
			newValue: 'vw',
		});

		expect(
			await getAttributes('list-marker-line-height-general')
		).toStrictEqual(16);
		expect(
			await getAttributes('list-marker-line-height-unit-general')
		).toStrictEqual('vw');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Use list options with list style position outside', async () => {
		await createNewPost();
		await createTextWithList();

		await openSidebarTab(page, 'style', 'list options');

		// Text style position
		const textStylePosition = await page.$(
			'.maxi-text-inspector__list-style-position select'
		);
		await textStylePosition.select('outside');

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// text indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-indent '),
			newNumber: '31',
		});

		expect(await getAttributes('list-indent-general')).toStrictEqual(31);

		// List gap
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-gap '),
			newNumber: '21',
		});

		expect(await getAttributes('list-gap-general')).toStrictEqual(21);

		// Paragraph spacing
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-text-inspector__list-paragraph-spacing '
			),
			newNumber: '44',
		});

		expect(
			await getAttributes('list-paragraph-spacing-general')
		).toStrictEqual(44);

		// Marker size
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-size '),
			newNumber: '11',
		});

		expect(await getAttributes('list-marker-size-general')).toStrictEqual(
			11
		);

		// Marker indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-text-inspector__list-marker-line-height '
			),
			newNumber: '46',
		});

		expect(
			await getAttributes('list-marker-line-height-general')
		).toStrictEqual(46);

		// Text Position
		const textPosition = await page.$(
			'.maxi-text-inspector__list-style select'
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
			instance: await page.$('.maxi-text-inspector__list-start '),
			newNumber: '-23',
		});
		expect(await getAttributes('listStart')).toStrictEqual(-23);

		// Style
		const style = await page.$$('.maxi-text-inspector__list-style select');
		await style[1].select('armenian');

		expect(await getAttributes('listStyle')).toStrictEqual('armenian');
		expect(await getAttributes('listStart')).toStrictEqual(0);

		await page.waitForTimeout(150);

		// Start From input
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-start '),
			newNumber: '78',
		});

		expect(await getAttributes('listStart')).toStrictEqual(78);

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-start '),
			newNumber: '-4',
		});

		expect(await getAttributes('listStart')).toStrictEqual(4);

		// Reverse order button
		await page.$eval('.maxi-text-inspector__list-reverse input', input =>
			input.click()
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-start '),
			newNumber: '-34',
		});

		expect(await getAttributes('listStart')).toStrictEqual(34);

		// Reverse order button
		await page.$eval('.maxi-text-inspector__list-reverse input', input =>
			input.click()
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check text position, style, Unorganized Custom', async () => {
		// Select
		// Type of list
		const listType = await page.$('.maxi-text-inspector__list-type select');
		await listType.select('ul');

		expect(await getAttributes('typeOfList')).toStrictEqual('ul');

		// style default
		const style = await page.$$('.maxi-text-inspector__list-style select');
		await style[1].select('circle');

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Style custom
		const styleCustom = await page.$$(
			'.maxi-text-inspector__list-style select'
		);
		await styleCustom[1].select('custom');

		await page.waitForTimeout(150);

		const source = await page.$(
			'.maxi-text-inspector__list-source-selector select'
		);

		await source.select('text');
		await page.waitForTimeout(150);

		await page.$eval(
			'.maxi-text-inspector__list-source-text input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('test');
		await page.waitForTimeout(150);

		expect(await getAttributes('listStyleCustom')).toStrictEqual('test');

		// source URL
		// expect to be properly tested
		/* await source.select('url');
		await page.$eval(
			'.maxi-text-inspector__list-source-text input',
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

	it('Check indent options and styles on multiline list item', async () => {
		await createNewPost();
		await createTextWithList('');

		const selectMaxiTextDiv = await page.$('.maxi-text-block');
		const selectMaxiTextP = await selectMaxiTextDiv.$(
			'.block-editor-rich-text__editable'
		);
		await selectMaxiTextP.click();
		await page.waitForTimeout(150);

		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await pressKeyWithModifier('shift', 'Enter');
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);

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

		// Check styles on rtl
		await openSidebarTab(page, 'style', 'typography');
		await addTypographyStyle({
			instance: page,
			direction: 'rtl',
		});

		expect(await getAttributes('text-direction-general')).toStrictEqual(
			'rtl'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check options with SVG as a marker', async () => {
		await createNewPost();
		await createTextWithList(undefined, 2);

		await openSidebarTab(page, 'style', 'list options');

		// Style custom
		const styleCustom = await page.$$(
			'.maxi-text-inspector__list-style select'
		);
		await styleCustom[1].select('custom');

		await page.waitForTimeout(150);

		const source = await page.$(
			'.maxi-text-inspector__list-source-selector select'
		);

		await source.select('icon');

		await modalMock(page, { type: 'list-svg' });

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Change marker size
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-size'),
			newNumber: '4',
		});

		expect(await getAttributes('list-marker-size-general')).toStrictEqual(
			4
		);

		// Change marker color
		await editColorControl({
			page,
			instance: await page.$('.maxi-accordion-control__item__panel'),
			paletteStatus: true,
			colorPalette: 7,
		});

		expect(await getAttributes('list-palette-color')).toStrictEqual(7);

		// Change marker indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-indent'),
			newNumber: '10',
		});

		expect(await getAttributes('list-marker-indent-general')).toStrictEqual(
			10
		);

		// Change text indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-indent'),
			newNumber: '23',
		});

		expect(await getAttributes('list-indent-general')).toStrictEqual(23);

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Change marker position
		const textStylePosition = await page.$(
			'.maxi-text-inspector__list-style-position select'
		);
		await textStylePosition.select('outside');

		expect(
			await getAttributes('list-style-position-general')
		).toStrictEqual('outside');

		// Change marker height
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-height'),
			newNumber: '20',
		});

		expect(await getAttributes('list-marker-height-general')).toStrictEqual(
			20
		);

		// Change marker line height
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-text-inspector__list-marker-line-height'
			),
			newNumber: '20',
		});

		expect(
			await getAttributes('list-marker-line-height-general')
		).toStrictEqual(20);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check indent options on RTL', async () => {
		await createNewPost();
		await createTextWithList();

		await openSidebarTab(page, 'style', 'typography');

		await addTypographyStyle({
			instance: page,
			direction: 'rtl',
		});

		expect(await getAttributes('text-direction-general')).toStrictEqual(
			'rtl'
		);

		await openSidebarTab(page, 'style', 'list options');

		// Change marker indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-indent'),
			newNumber: '40',
			newValue: 'px',
		});

		expect(await getAttributes('list-marker-indent-general')).toStrictEqual(
			40
		);
		expect(
			await getAttributes('list-marker-indent-unit-general')
		).toStrictEqual('px');

		// Change text indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-indent'),
			newNumber: '23',
		});

		expect(await getAttributes('list-indent-general')).toStrictEqual(23);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check options with marker none', async () => {
		await createNewPost();
		await createTextWithList();

		await openSidebarTab(page, 'style', 'list options');

		// Style none
		const styleNone = await page.$$(
			'.maxi-text-inspector__list-style select'
		);
		await styleNone[1].select('none');

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Change text indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-indent'),
			newNumber: '23',
		});

		expect(await getAttributes('list-indent-general')).toStrictEqual(23);

		// Change marker indent
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-indent'),
			newNumber: '40',
		});

		expect(await getAttributes('list-marker-indent-general')).toStrictEqual(
			40
		);

		// Change marker size
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-size'),
			newNumber: '4',
		});

		expect(await getAttributes('list-marker-size-general')).toStrictEqual(
			4
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check marker vertical offset options', async () => {
		await createNewPost();
		await createTextWithList();

		await openSidebarTab(page, 'style', 'list options');

		// Change vertical offset
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-text-inspector__list-marker-offset'),
			newNumber: '20',
			newValue: 'em',
		});

		expect(
			await getAttributes('list-marker-vertical-offset-general')
		).toStrictEqual(20);
		expect(
			await getAttributes('list-marker-vertical-offset-unit-general')
		).toStrictEqual('em');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
