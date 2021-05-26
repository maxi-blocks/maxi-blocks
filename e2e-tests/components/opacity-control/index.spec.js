/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('opacity control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the opacity control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing opacity');
		const accordionPanel = await openAdvancedSidebar(page, 'opacity');

		await accordionPanel.$eval(
			'.maxi-accordion-control__item__panel .components-base-control__field .components-input-control__container input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('19');

		const expectResult = 0.19;
		const attributes = await getBlockAttributes();
		expect(attributes['opacity-general']).toStrictEqual(expectResult);
	});
});
