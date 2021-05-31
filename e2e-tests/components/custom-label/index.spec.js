/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('position control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the position control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing position');
		const accordionPanel = await openAdvancedSidebar(
			page,
			'custom classes'
		);
		await accordionPanel.$eval(
			'.maxi-accordion-control__item__panel .components-base-control__field .components-text-control__input',
			select => select.focus()
		);
		await page.keyboard.type('Column');

		const Attributes = await getBlockAttributes();
		const AdditionalClass = 'Column';

		expect(Attributes.extraClassName).toStrictEqual(AdditionalClass);
	});
});
