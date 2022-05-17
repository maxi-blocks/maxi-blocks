/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	editAxisControl,
	getAttributes,
	addResponsiveTest,
} from '../../utils';

describe('Indicators', () => {
	it('Checking the indicators', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		const axisControlInstance = await accordionPanel.$(
			'.maxi-axis-control__padding .maxi-axis-control__content__item__padding'
		);

		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '12',
			unit: '%',
		});

		const paddingTop = await page.$eval(
			'.maxi-indicators__padding.maxi-indicators__padding--top',
			div => div.outerHTML
		);

		const paddingRight = await page.$eval(
			'.maxi-indicators__padding.maxi-indicators__padding--right',
			div => div.outerHTML
		);

		const paddingBottom = await page.$eval(
			'.maxi-indicators__padding.maxi-indicators__padding--bottom',
			div => div.outerHTML
		);

		const paddingLeft = await page.$eval(
			'.maxi-indicators__padding.maxi-indicators__padding--left',
			div => div.outerHTML
		);

		expect(paddingTop).toMatchSnapshot();
		expect(paddingRight).toMatchSnapshot();
		expect(paddingBottom).toMatchSnapshot();
		expect(paddingLeft).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Checking the indicators responsive', async () => {
		const responsiveValue = await addResponsiveTest({
			page,
			instance:
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding select',
			selectInstance:
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding select',
			needSelectIndex: true,
			baseExpect: '%',
			xsExpect: 'em',
			newValue: 'em',
		});
		expect(responsiveValue).toBeTruthy();

		const responsivePadding = await addResponsiveTest({
			page,
			instance:
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding input',
			needFocusPlaceholder: true,
			baseExpect: '12',
			xsExpect: '44',
			newValue: '44',
		});
		expect(responsivePadding).toBeTruthy();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
