/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getAttributes,
	addResponsiveTest,
	getBlockStyle,
	editAdvancedNumberControl,
	insertMaxiBlock,
} from '../../utils';

describe('ZIndexControl', () => {
	it('Checking the z-index control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		await openSidebarTab(page, 'advanced', 'z index');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-zIndex-control .maxi-base-control__field'
			),
			newNumber: '20',
		});

		expect(await getAttributes('z-index-g')).toStrictEqual(20);

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
