/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	getAttributes,
	addResponsiveTest,
	editAdvancedNumberControl,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('OpacityControl', () => {
	it('Checking the opacity control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi', { delay: 350 });
		await openSidebarTab(page, 'advanced', 'opacity');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-opacity-control .maxi-base-control__field'
			),
			newNumber: '19',
		});

		expect(await getAttributes('opacity-xl')).toStrictEqual(0.19);

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
