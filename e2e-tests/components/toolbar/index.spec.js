/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';

describe('toolbar', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('test toolbar');
	});
	it('Checks toolbar do not break', async () => {
		await insertBlock('Text Maxi');
		const toolbar = await page.$('.toolbar-wrapper');

		expect(toolbar).toBeTruthy();
	});
	it('checking the move up and move down', async () => {
		//////////////////
		await insertBlock('Text Maxi');
		const buttons = await page.$$('.toolbar-wrapper button');

		await buttons[1].click();
		await buttons[2].click();

		/*const typographyAttributes = await getBlockAttributes();
		const typography = typographyAttributes['font-family-general'];
		const expectTypography = 'Montserrat';
		expect(typography).toStrictEqual(expectTypography);*/
	});
});

// typography
await buttons[4].click();
await page.keyboard.type('Montserrat');
await page.keyboard.press('Enter');

const typographyAttributes = await getBlockAttributes();
const typography = typographyAttributes['font-family-general'];
const expectTypography = 'Montserrat';
expect(typography).toStrictEqual(expectTypography);

// text color
await buttons[5].click();
await page.$$eval(
	'.components-popover__content .maxi-color-palette-control .maxi-base-control .maxi-sc-color-palette div',
	click => click[3].click()
);

const textColorAttributes = await getBlockAttributes();
const textColor = textColorAttributes['palette-preset-typography-color'];
const expectTextColor = 4;
expect(textColor).toStrictEqual(expectTextColor);

// alignment
await buttons[6].click();
await page.$$eval(
	'.components-popover__content .maxi-alignment-control label',
	click => click[1].click()
);

const alignmentAttributes = await getBlockAttributes();
const alignment = alignmentAttributes['text-alignment-general'];
const expectAlignment = 'center';
expect(alignment).toStrictEqual(expectAlignment);

// test level
await buttons[7].click();
await page.$$eval(
	'.components-popover__content .maxi-font-level-control button',
	click => click[1].click()
);

const textLevelAttributes = await getBlockAttributes();
const { textLevel } = textLevelAttributes;
const expectTextLevel = 'h1';
expect(textLevel).toStrictEqual(expectTextLevel);

// bold
await buttons[8].click();

const boldAttributes = await getBlockAttributes();
const bold = boldAttributes['font-weight-general'];
const expectBold = 400;
expect(bold).toStrictEqual(expectBold);

// italic
await buttons[9].click();

const italicAttributes = await getBlockAttributes();
const italic = italicAttributes['font-style-general'];
const expectItalic = 'italic';
expect(italic).toStrictEqual(expectItalic);

// link
await buttons[10].click();
await page.keyboard.type('test.com');
await page.keyboard.press('Enter');

const linkAttributes = await getBlockAttributes();
const link = linkAttributes.linkSettings;
const expectLink = { url: 'test.com' };
debugger;
expect(link).toEqual(expectLink);

// list options
await buttons[11].click();
await page.$$eval(
	'.components-popover__content .toolbar-item__popover__list-options button',
	click => click[0].click()
);

await page.$eval('.wp-block-maxi-blocks-text-maxi', select => select.focus());
const listAttributes = await getBlockAttributes();

const list = listAttributes.typeOfList;
const expectList = 'ol';
expect(list).toStrictEqual(expectList);

// size
await buttons[12].click();
await page.$$eval(
	'.toolbar-item__size__popover .maxi-size-control input',
	click => click[0].focus()
);
await page.keyboard.type('200');

const sizeAttributes = await getBlockAttributes();
const size = sizeAttributes['max-width-general'];
const expectSize = '200';
expect(size).toStrictEqual(expectSize);

// padding & margin
await buttons[13].click();
await page.$$eval(
	'.toolbar-item__padding-margin__popover .maxi-axis-control__content input',
	click => click[0].focus()
);
await page.keyboard.type('30');

const paddingAttributes = await getBlockAttributes();
const padding = paddingAttributes['padding-top-general'];
const expectPadding = '30';
expect(padding).toStrictEqual(expectPadding);

// duplicate
await buttons[14].click();

// delete 1
await buttons[15].click();

// hide 1
await buttons[16].click();

// copy / paste
// insert bold
await insertBlock('Text Maxi');
await buttons[8].click();

// copy
await buttons[17].click();
await page.$$eval('.toolbar-item__copy-paste__popover button', click =>
	click[0].click()
);

// delete
await buttons[15].click();

// paste
await buttons[17].click();
await page.$$eval('.toolbar-item__copy-paste__popover button', click =>
	click[1].click()
);

const boldCopiedAttributes = await getBlockAttributes();
const boldCopied = boldCopiedAttributes['font-weight-general'];
const expectBoldCopied = '400';
expect(boldCopied).toStrictEqual(expectBoldCopied);

// reusable blocks
await buttons[3].click();
await page.keyboard.type('text');
await page.keyboard.press('Enter');
