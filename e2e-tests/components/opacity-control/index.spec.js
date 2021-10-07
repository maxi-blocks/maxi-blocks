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
import {
	getBlockAttributes,
	openAdvancedSidebar,
	getBlockStyle,
} from '../../utils';

describe('OpacityControl', () => {
	it('Checking the opacity control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'opacity');

		await accordionPanel.$eval(
			'.maxi-opacity-control .maxi-base-control__field input',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('19');

		const attributes = await getBlockAttributes();
		const opacity = attributes['opacity-general'];
		const expectResult = 0.19;

		expect(opacity).toStrictEqual(expectResult);

		const blockStyles = await getBlockStyle(page);
		expect(blockStyles).toMatchSnapshot();
	});
});
