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
	getBlockStyle,
} from '../../utils';

describe('ZIndexControl', () => {
	it('Checking the z-index control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'z index'
		);

		await accordionPanel.$eval(
			'.maxi-zIndex-control .maxi-base-control__field input',
			input => input.focus()
		);

		await page.keyboard.type('20');

		const attributes = await getBlockAttributes();
		const zIndex = attributes['z-index-general'];

		expect(zIndex).toStrictEqual(20);
	});
	it('Check Responsive zIndex control', async () => {
		const input = await page.$('.maxi-zIndex-control input');

		// responsive S
		await changeResponsive(page, 's');
		await input.focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('9');
		const zIndexS = await page.$eval(
			'.maxi-zIndex-control input',
			button => button.value
		);

		expect(zIndexS).toStrictEqual('29');

		const attributes = await getBlockAttributes();
		const zIndex = attributes['z-index-s'];

		expect(zIndex).toStrictEqual(29);

		// responsive XS
		await changeResponsive(page, 'xs');

		const zIndexXs = await page.$eval(
			'.maxi-zIndex-control input',
			button => button.value
		);

		expect(zIndexXs).toStrictEqual('29');

		// responsive M
		await changeResponsive(page, 'm');

		const zIndexM = await page.$eval(
			'.maxi-zIndex-control input',
			button => button.value
		);

		expect(zIndexM).toStrictEqual('20');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
