/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import openSidebar from '../../utils/openSidebar';
import { getBlockAttributes } from '../../utils';

describe('border control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the border control', async () => {
		await insertBlock('Text Maxi');
		const borderAccordion = await openSidebar(page, 'border');
		await borderAccordion.$$(
			'.maxi-border-control .maxi-default-styles-control button'
			// button => button.click()
		);

		const expectAttributes = ['solid', 'dashed', 'dotted', undefined];

		for (let i = 0; i < borderAccordion.length; i++) {
			const borderStyle = await borderAccordion[i !== 3 ? i + 1 : 0];

			await borderStyle.click();
			const attributes = await getBlockAttributes();

			expect(attributes['border-style-general']).toStrictEqual(
				expectAttributes[i]
			);
		}

		const borderType = await borderAccordion.$(
			'.maxi-border-control .maxi-border-control__type .maxi-base-control__field'
		);
		await borderType.select('groove');
		const expectBorderType = 'groove';
		const firstAttributes = await getBlockAttributes();

		expect(firstAttributes['border-style-general']).toStrictEqual(
			expectBorderType
		);

		// color

		await page.$$eval('.maxi-color-control__color input', select =>
			select[1].focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('FAFA03');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(1000);

		const expectedColorResult = 'rgba(250,250,3,1)';

		const colorAttributes = await getBlockAttributes();

		expect(colorAttributes['border-color-general']).toStrictEqual(
			expectedColorResult
		);
	});
});
