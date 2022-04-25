/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	getAttributes,
	editAdvancedNumberControl,
} from '../../utils';

describe('ResponsiveControl', () => {
	it('Test the responsive control', async () => {
		await createNewPost();
		await changeResponsive(page, 'xs');
		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'advanced', 'breakpoint');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-responsive-control'),
			newNumber: '450',
		});

		expect(await getAttributes('breakpoints-xs')).toStrictEqual(450);

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
