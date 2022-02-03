/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getAttributes,
	addResponsiveTest,
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

		expect(await getAttributes('z-index-general')).toStrictEqual(20);

		// check responsive origin
		const responsiveResultOrigin = await addResponsiveTest({
			page,
			instance: '.maxi-zIndex-control .maxi-base-control__field input',
			needFocus: true,
			baseExpect: '20',
			xsExpect: '16',
			newValue: '16',
		});

		expect(responsiveResultOrigin).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
