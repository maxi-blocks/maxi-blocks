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
	addCustomCSS,
	changeResponsive,
	getAttributes,
} from '../../utils';

describe('Custom-Css-Control', () => {
	it('Checking the custom-css', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);

	it('Checking the custom-css responsive', async () => {
		await changeResponsive(page, 's');

		// check base value in S responsive
		const baseValue = await page.$$eval(
			'.w-tc-editor textarea',
			input => input[0].value
		);

		expect(baseValue).toStrictEqual('background: red');

		// change S value
		await page.$eval('.w-tc-editor textarea', input => input.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('background: blue');

		// change xs responsive
		await changeResponsive(page, 'xs');

		const xsValue = await page.$$eval(
			'.w-tc-editor textarea',
			input => input[0].value
		);

		expect(xsValue).toStrictEqual('background: blue');

		// change m responsive
		await changeResponsive(page, 'm');

		const mValue = await page.$$eval(
			'.w-tc-editor textarea',
			input => input[0].value
		);

		expect(mValue).toStrictEqual('background: red');
	});

	it('Checking the custom-css Validation', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'custom css'
		);

		const selector = await accordionPanel.$(
			'.maxi-custom-css-control__category select'
		);

		await selector.select('group');

		await page.$eval('.maxi-additional__css-group textarea', input =>
			input.focus()
		);

		await page.keyboard.type('VALIDATE ERROR');

		await accordionPanel.$eval(
			'.maxi-additional__css-group button',
			button => button.click()
		);
		await page.waitForTimeout(150);

		const error = await accordionPanel.$$eval(
			'.maxi-additional__css-error',
			input => input[0].innerText
		);
		expect(error).not.toBe('Valid');

		// focus out
		await page.$eval('.editor-post-title__input', input => input.focus());

		// await validation
		await page.waitForTimeout(1000);
		await page.$eval('.maxi-group-block', block => block.focus());

		// return css block
		expect(await getAttributes('custom-css-general')).toMatchSnapshot();
		expect(await getAttributes('custom-css-m')).toMatchSnapshot();
		expect(await getAttributes('custom-css-s')).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
