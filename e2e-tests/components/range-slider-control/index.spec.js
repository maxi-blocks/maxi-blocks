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
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('Range Slider Control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('Checking the range slider control', async () => {
		await insertBlock('Text Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'opacity');

		// Max value
		await accordionPanel.$eval(
			'.maxi-accordion-control__item__panel .maxi-opacity-control .maxi-base-control__field input',
			select => select.focus()
		);
		await page.keyboard.type('400');

		const attributes = await getBlockAttributes();
		const heightAttribute = attributes['opacity-general'];
		const expectNum = 1;

		expect(heightAttribute).toStrictEqual(expectNum);

		// Min value
		await accordionPanel.$eval(
			'.maxi-accordion-control__item__panel .maxi-opacity-control .maxi-base-control__field input',
			select => select.focus()
		);

		await page.keyboard.type('0.1');

		const numberAttributes = await getBlockAttributes();
		const minHeightAttribute = numberAttributes['opacity-general'];
		const expectMinNum = 0.01;

		expect(minHeightAttribute).toStrictEqual(expectMinNum);

		// reset value
		await accordionPanel.$eval(
			'.maxi-accordion-control__item__panel .maxi-opacity-control .maxi-base-control__field input',
			select => select.focus()
		);
		await page.keyboard.type('40');

		await accordionPanel.$eval(
			'.maxi-accordion-control__item__panel .maxi-opacity-control .maxi-base-control__field button',
			click => click.click()
		);

		const numbersAttributes = await getBlockAttributes();
		const autoHeightAttribute = numbersAttributes['opacity-general'];
		const expectAuto = '';

		expect(autoHeightAttribute).toStrictEqual(expectAuto);
	});
});
