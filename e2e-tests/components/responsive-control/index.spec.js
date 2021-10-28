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
	openSidebarTab,
	changeResponsive,
} from '../../utils';

describe('ResponsiveControl', () => {
	it('Test the responsive control', async () => {
		await createNewPost();
		await changeResponsive(page, 'xs');
		await insertBlock('Button Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'breakpoint'
		);

		await accordionPanel.$eval('.maxi-responsive-control input', input =>
			input.focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('50');

		const attributes = await getBlockAttributes();
		const breakpoint = attributes['breakpoints-xs'];

		expect(breakpoint).toStrictEqual(450);
	});

	/* it('Check Responsive to responsive control', async () => {
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
	}); */
});
