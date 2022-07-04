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
	getBlockStyle,
	getAttributes,
} from '../../utils';

describe('DisplayControl', () => {
	it('Checking the display control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'show hide block'
		);

		await accordionPanel.$eval(
			'.maxi-display-control .maxi-tabs-control__button-Hide',
			button => button.click()
		);

		expect(await getAttributes('display-general')).toStrictEqual('none');
	});

	it('Check Responsive display control', async () => {
		await openSidebarTab(page, 'advanced', 'show hide block');

		const isItemChecked = await page.$eval(
			'.maxi-display-control .maxi-tabs-control__button-Hide',
			select => select.ariaPressed
		);

		expect(isItemChecked).toBe('true');

		// responsive S
		await changeResponsive(page, 's');
		await page.$eval(
			'.maxi-display-control .maxi-tabs-control__button-Show',
			button => button.click()
		);
		const responsiveSOption = await page.$eval(
			'.maxi-display-control .maxi-tabs-control__button-Show',
			select => select.ariaPressed
		);

		expect(responsiveSOption).toBe('true');

		expect(await getAttributes('display-s')).toStrictEqual('flex');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-display-control .maxi-tabs-control__button-Show',
			select => select.ariaPressed
		);

		expect(responsiveXsOption).toBe('true');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-display-control .maxi-tabs-control__button-Hide',
			select => select.ariaPressed
		);

		expect(responsiveMOption).toBe('true');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
