/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('ColorControl', () => {
	it('Checking the color control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control label',
			fancyRadioControls => fancyRadioControls[5].click()
		);

		await page.$$eval(
			'.maxi-background-control .maxi-base-control__field .maxi-sc-color-palette div',
			select => select[3].click()
		);

		const attributes = await getBlockAttributes();
		const backgroundColor = attributes['background-palette-color'];
		const expectedResult = 4;

		expect(backgroundColor).toStrictEqual(expectedResult);
	});
});
