/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	// pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import openSidebar from '../../utils/openSidebar';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('display control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the display control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing display');
		const accordionPanel = await openAdvancedSidebar(page, 'display');
		await accordionPanel.$$eval(
			'.components-base-control__field .components-radio-control__option label',
			button => button[1].click()
		);
		const expectResult = 'none';
		const attributes = await getBlockAttributes();
		expect(attributes['display-general']).toStrictEqual(expectResult);
	});
});
