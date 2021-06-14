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
import { getBlockAttributes, openSidebar } from '../../utils';

describe('Number Control', () => {
	it('Checking the number control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'width height');

		// Max value
		await accordionPanel.$eval(
			'.maxi-full-size-control .maxi-base-control__field input',
			select => select.focus()
		);
		await page.keyboard.type('4000');

		const attributes = await getBlockAttributes();
		const heightAttribute = attributes['height-general'];
		const expectNum = 3999;

		expect(heightAttribute).toStrictEqual(expectNum);

		// Min value
		await accordionPanel.$eval(
			'.maxi-full-size-control .maxi-base-control__field input',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('0');

		const numberAttributes = await getBlockAttributes();
		const minHeightAttribute = numberAttributes['height-general'];
		const expectMinNum = '';

		expect(minHeightAttribute).toStrictEqual(expectMinNum);

		// reset value
		await accordionPanel.$eval(
			'.maxi-full-size-control .maxi-base-control__field input',
			select => select.focus()
		);
		await page.keyboard.type('40');

		await accordionPanel.$eval(
			'.maxi-full-size-control .maxi-base-control__field button',
			click => click.click()
		);

		const numbersAttributes = await getBlockAttributes();
		const autoHeightAttribute = numbersAttributes['height-general'];
		const expectAuto = '';

		expect(autoHeightAttribute).toStrictEqual(expectAuto);
	});
});
