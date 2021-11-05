/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebarTab, getBlockStyle } from '../../utils';

describe('ClipPathOption', () => {
	it('Checking the clip-path control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openSidebarTab(page, 'style', 'clip path');

		// Use clip-path to create a triangle
		await accordionPanel.$eval(
			'.maxi-clip-path-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);
		await accordionPanel.$$eval('.clip-path-defaults button', click =>
			click[1].click()
		);

		const triangleExpect = 'polygon(50% 0%, 0% 100%, 100% 100%)';
		const triangleAttributes = await getBlockAttributes();
		const triangleClipPath = triangleAttributes.clipPath;

		expect(triangleClipPath).toStrictEqual(triangleExpect);

		// Transform the triangle into a square
		await accordionPanel.$eval(
			'.maxi-toggle-switch.clip-path-custom .maxi-base-control__label',
			use => use.click()
		);

		const selectType = await accordionPanel.$(
			'.maxi-clip-path-control__handles .maxi-base-control__field select'
		);
		await selectType.select('inset');

		const squareExpect = 'inset(15% 5% 15% 5%)';
		const squareAttributes = await getBlockAttributes();
		const squareClipPath = squareAttributes.clipPath;

		expect(squareClipPath).toStrictEqual(squareExpect);

		// Edit the square
		await accordionPanel.$$eval(
			'.maxi-clip-path-control__handles .maxi-button-group-control button',
			use => use[1].click()
		);

		const editPoints = await accordionPanel.$$(
			'.maxi-clip-path-control__handles .maxi-clip-path-controller .maxi-clip-path-controller__settings input'
		);

		const [top, right, bottom, left] = editPoints;

		await top.focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('28');

		await right.focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('5');

		await bottom.focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('15');

		await left.focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('64');

		const customAttributes = await getBlockAttributes();
		const customClipPath = customAttributes.clipPath;
		const customExpect = 'inset(28% 5% 15% 64%)';

		expect(customClipPath).toStrictEqual(customExpect);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
