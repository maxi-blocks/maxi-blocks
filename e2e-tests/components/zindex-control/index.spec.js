import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyTimes,
	// getBlockAttributes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('typography control', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('checking the z-index control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing z-index');

		const accordionPanel = await openAdvancedSidebar(page, 'z index');

		await accordionPanel.$eval(
			'.maxi-zIndex-control .maxi-base-control__field input',
			input => input.focus()
		);

		await page.keyboard.type('2');

		const expectResult = 2;
		const attributes = await getBlockAttributes();

		expect(attributes['z-index-general']).toStrictEqual(expectResult);
	});
});
