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
	getBlockStyle,
	getAttributes,
	addResponsiveTest,
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

		// check responsive opacity control
		const responsiveResult = await addResponsiveTest({
			page,
			instance: '.maxi-opacity-control .maxi-base-control__field input',
			needFocus: true,
			baseExpect: '19',
			xsExpect: '55',
			newValue: '55',
		});

		expect(responsiveResult).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
