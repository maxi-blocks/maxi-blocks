/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('clip-path control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the clip-path control', async () => {
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'clip path');
		// Use clip-path to create a triangle

		const useClipPath = await accordionPanel.$eval(
			'.maxi-clip-path-control .maxi-fancy-radio-control .maxi-base-control__field .maxi-radio-control__option label',
			use => use.click()
		);
		await accordionPanel.$$eval('.clip-path-defaults button', click =>
			click[0].click()
		);

		const triangleExpect = 'polygon(50% 0%, 0% 100%, 100% 100%)';
		const triangleAttributes = await getBlockAttributes();

		expect(triangleAttributes.clipPath).toStrictEqual(triangleExpect);
		// Transform the triangle into a square

		await accordionPanel.$$eval(
			'.maxi-base-control__field .maxi-radio-control__option label',
			use => use[2].click()
		);

		const selectType = await accordionPanel.$(
			'.maxi-clip-path-control__handles .maxi-base-control__field select'
		);
		await selectType.select('inset');

		const squareExpect = 'inset(15% 5% 15% 5%)';
		const squareAttributes = await getBlockAttributes();

		expect(squareAttributes.clipPath).toStrictEqual(squareExpect);
		// Edit the square

		await accordionPanel.$$eval(
			'.maxi-clip-path-control__handles .maxi-fancy-radio-control .maxi-base-control__field .maxi-radio-control__option label',
			use => use[1].click()
		);

		const editPoints = await accordionPanel.$$(
			'.maxi-clip-path-control__handles .maxi-clip-path-controller .maxi-clip-path-controller__settings input'
		);

		const top = editPoints[0];
		const right = editPoints[1];
		const bottom = editPoints[2];
		const left = editPoints[3];

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

		const customExpect = 'inset(100% 51% 100% 51%)';
		const customAttributes = await getBlockAttributes();

		expect(customAttributes.clipPath).toStrictEqual(customExpect);
	});
});
