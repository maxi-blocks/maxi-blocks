/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	getAttributes,
	editAdvancedNumberControl,
	insertMaxiBlock,
} from '../../utils';

describe('ResponsiveControl', () => {
	it('Test the responsive control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await changeResponsive(page, 'xs');
		await openSidebarTab(page, 'advanced', 'breakpoint');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-responsive-control'),
			newNumber: '450',
		});

		expect(await getAttributes('_bp-xs')).toStrictEqual(450);

		await openSidebarTab(page, 'style', 'alignment');
		await changeResponsive(page, 'xxl');

		await page.$eval(
			'.maxi-tabs-control__full-width .maxi-settingstab-control_has-border-left-right button',
			button => button.click()
		);

		expect(await getAttributes('_a-xxl')).toStrictEqual('left');

		await changeResponsive(page, 'xl');
		await page.$eval(
			'.maxi-tabs-control__full-width .maxi-settingstab-control_has-border-left-right .maxi-tabs-control__button-right',
			button => button.click()
		);

		expect(await getAttributes('_a-g')).toStrictEqual('right');

		await changeResponsive(page, 'l');
		await page.$eval(
			'.maxi-tabs-control__full-width .maxi-settingstab-control_has-border-left-right .maxi-tabs-control__button-center',
			button => button.click()
		);

		expect(await getAttributes('_a-l')).toStrictEqual('center');

		await changeResponsive(page, 'm');
		await page.$eval(
			'.maxi-tabs-control__full-width .maxi-settingstab-control_has-border-left-right button',
			button => button.click()
		);

		expect(await getAttributes('_a-m')).toStrictEqual('left');

		await changeResponsive(page, 's');
		await page.$eval(
			'.maxi-tabs-control__full-width .maxi-settingstab-control_has-border-left-right .maxi-tabs-control__button-right',
			button => button.click()
		);

		expect(await getAttributes('_a-s')).toStrictEqual('right');

		await changeResponsive(page, 'xs');
		await page.$eval(
			'.maxi-tabs-control__full-width .maxi-settingstab-control_has-border-left-right .maxi-tabs-control__button-center',
			button => button.click()
		);

		expect(await getAttributes('_a-xs')).toStrictEqual('center');
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
		const breakpoints = attributes['_bp-s'];

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
