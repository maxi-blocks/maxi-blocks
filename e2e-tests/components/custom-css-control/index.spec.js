/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockStyle, addCustomCSS } from '../../utils';

describe('Custom-Css-Control', () => {
	it('Checking the custom-css control in Group Maxi', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

		await addCustomCSS(page);

		/* expect(cssValidate).toStrictEqual('Valid');
		expect(css).toMatchSnapshot();

		const cssHover = await page.$$eval(
			'.maxi-additional__css .w-tc-editor textarea',
			content => content[1].value
		);

		const cssHoverValidate = await page.$eval(
			'#maxi-additional__css-error-text__group_on_hover',
			valid => valid.innerText
		);

		await page.waitForTimeout(1000);
		expect(cssHoverValidate).toStrictEqual('Valid');

		expect(cssHover).toMatchSnapshot(); */

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
