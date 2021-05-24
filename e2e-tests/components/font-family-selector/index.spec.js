import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

describe('font level', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the font family selector', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing font family');
		const accordionPanel = await openSidebar(page, 'typography');
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');

		const expectedResult = 'Montserrat';
		const attributes = await getBlockAttributes();

		expect(attributes['font-family-general']).toStrictEqual(expectedResult);
	});
});
