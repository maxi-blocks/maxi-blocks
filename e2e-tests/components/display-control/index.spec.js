/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
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

		await accordionPanel.$$eval('.maxi-display-control button', button =>
			button[1].click()
		);

		const attributes = await getBlockAttributes();
		const display = attributes['display-general'];
		const expectResult = 'none';

		expect(display).toStrictEqual(expectResult);
	});

	it('Check Responsive display control', async () => {
		await openSidebarTab(page, 'advanced', 'show hide block');
		const displayButtons = await page.$$('.maxi-display-control button');

		const isItemChecked = await page.$$eval(
			'.maxi-display-control button',
			select => select[1].ariaPressed
		);

		expect(isItemChecked).toBe('true');

		// responsive S
		await changeResponsive(page, 's');
		await displayButtons[0].click();

		const responsiveSOption = await page.$$eval(
			'.maxi-display-control button',
			select => select[0].ariaPressed
		);

		expect(responsiveSOption).toBe('true');

		const expectAttributes = await getBlockAttributes();
		const display = expectAttributes['display-s'];

		expect(display).toStrictEqual('flex');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$$eval(
			'.maxi-display-control button',
			select => select[0].ariaPressed
		);

		expect(responsiveXsOption).toBe('true');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$$eval(
			'.maxi-display-control button',
			select => select[1].ariaPressed
		);

		expect(responsiveMOption).toBe('true');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
