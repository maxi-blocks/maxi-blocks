/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	editAxisControl,
	getAttributes,
	addResponsiveTest,
} from '../../utils';

describe('Padding control', () => {
	it('Checking padding control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openSidebarTab(page, 'style', 'margin padding');

		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding'
			),
			values: '24',
			unit: 'em',
		});

		const expectPadding = {
			'padding-top-general': '24',
			'padding-bottom-general': '24',
			'padding-left-general': '24',
			'padding-right-general': '24',
			'padding-left-unit-general': 'em',
			'padding-bottom-unit-general': 'em',
			'padding-top-unit-general': 'em',
			'padding-right-unit-general': 'em',
		};
		const paddingResult = await getAttributes([
			'padding-left-unit-general',
			'padding-bottom-unit-general',
			'padding-top-unit-general',
			'padding-right-unit-general',
			'padding-top-general',
			'padding-bottom-general',
			'padding-left-general',
			'padding-right-general',
		]);

		expect(paddingResult).toStrictEqual(expectPadding);
	});

	it('Checking responsive padding', async () => {
		const responsiveValue = await addResponsiveTest({
			page,
			instance:
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding input',
			needFocusPlaceholder: true,
			baseExpect: '24',
			xsExpect: '56',
			newValue: '56',
		});
		expect(responsiveValue).toBeTruthy();

		const responsiveUnit = await addResponsiveTest({
			page,
			instance:
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding select',
			selectInstance:
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding select',
			needSelectIndex: true,
			baseExpect: 'em',
			xsExpect: '%',
			newValue: '%',
		});
		expect(responsiveUnit).toBeTruthy();
	});
});
