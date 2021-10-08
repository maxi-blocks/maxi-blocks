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
	changeResponsive,
	getBlockStyle,
} from '../../utils';

describe('ResponsiveControl', () => {
	it('Test the responsive control', async () => {
		await createNewPost();

		// open the responsive selector
		await page.$eval('#maxi-blocks__toolbar-buttons button', responsive =>
			responsive.click()
		);

		// select the responsive XL
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

	it('Check Responsive to responsive control', async () => {
		const input = await page.$('.maxi-responsive-control input');

		const breakpoint = await page.$eval(
			'.maxi-responsive-control input',
			button => button.value
		);

		expect(breakpoint).toStrictEqual('1000');

		// responsive S
		await changeResponsive(page, 's');
		await input.focus();
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('855');
		const breakpointS = await page.$eval(
			'.maxi-responsive-control input',
			button => button.value
		);

		expect(breakpointS).toStrictEqual('855');

		const attributes = await getBlockAttributes();
		const breakpoints = attributes['breakpoints-s'];

		expect(breakpoints).toStrictEqual(855);

		// responsive XS
		await changeResponsive(page, 'xs');

		const breakpointXs = await page.$eval(
			'.maxi-responsive-control input',
			button => button.value
		);

		expect(breakpointXs).toStrictEqual('480');

		// responsive M
		await changeResponsive(page, 'm');

		const breakpointM = await page.$eval(
			'.maxi-responsive-control input',
			button => button.value
		);

		expect(breakpointM).toStrictEqual('1024');

		const blockStyles = await getBlockStyle(page);
		expect(blockStyles).toMatchSnapshot();
	});
});
