import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyTimes,
	getBlockAttributes,
} from '@wordpress/e2e-test-utils';
// import { getBlockAttributes } from '../../utils';
import openAdvancedSidebar from '../../utils/openSidebar';

describe('typography control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the z-index control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing z-index');

		const accordionPanel = await openAdvancedSidebar(page, 'z index');
		debugger;
		const zIndex = await accordionPanel.$eval(
			'.components-base-control.maxi-number-control.maxi-zIndex-control .components-base-control__field input',
			input => input.focus()
		);

		await page.keyboard.type('2');

		const expectResult = 2;
		const zIndexPosition = await getBlockAttributes();
		expect(zIndexPosition['z-index-general']).toStrictEqual(expectResult);
	});
});
