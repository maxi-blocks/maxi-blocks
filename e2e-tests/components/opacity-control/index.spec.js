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
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
	getAttributes,
} from '../../utils';

describe('OpacityControl', () => {
	it('Checking the opacity control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'opacity'
		);

		await accordionPanel.$eval(
			'.maxi-opacity-control .maxi-base-control__field input',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('19');

		expect(await getAttributes('opacity-general')).toStrictEqual(0.19);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Responsive opacity control', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'opacity'
		);

		const responsiveBaseOption = await page.$eval(
			'.maxi-opacity-control .maxi-base-control__field input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveBaseOption).toStrictEqual('19');

		// responsive S
		await changeResponsive(page, 's');
		await accordionPanel.$eval(
			'.maxi-opacity-control .maxi-base-control__field input',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('55');

		const responsiveSOption = await page.$eval(
			'.maxi-opacity-control .maxi-base-control__field input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveSOption).toStrictEqual('55');

		expect(await getAttributes('opacity-s')).toStrictEqual(0.55);

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-opacity-control .maxi-base-control__field input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveXsOption).toStrictEqual('55');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-opacity-control .maxi-base-control__field input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveMOption).toStrictEqual('19');
	});
});
