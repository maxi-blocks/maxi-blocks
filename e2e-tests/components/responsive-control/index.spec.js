/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('responsive control', () => {
	it('test the responsive control', async () => {
		await createNewPost();
		await page.$eval('#maxi-blocks__toolbar-buttons button', responsive =>
			responsive.click()
		);

		await page.$$eval(
			'#maxi-blocks__toolbar-buttons .maxi-responsive-selector button',
			selector => selector[2].click()
		);

		await insertBlock('Button Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'breakpoint');

		await accordionPanel.$eval('.maxi-responsive-control input', input =>
			input.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('000');

		const attributes = await getBlockAttributes();
		const breakpoint = attributes['breakpoints-xl'];
		const expectValue = 1000;
		expect(breakpoint).toStrictEqual(expectValue);
	});
});
