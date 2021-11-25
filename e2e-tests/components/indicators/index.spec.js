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
	getBlockAttributes,
} from '../../utils';

describe('Indicators', () => {
	it('Checking the indicators', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		const axisControlInstance = await accordionPanel.$(
			'.maxi-axis-control__padding'
		);

		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '12',
			unit: '%',
		});

		const expectPadding = {
			'padding-top-general': 12,
			'padding-bottom-general': 12,
			'padding-left-general': 12,
			'padding-right-general': 12,
			'padding-unit-general': '%',
		};

		const pageAttributes = await getBlockAttributes();
		const paddingAttributes = (({
			'padding-unit-general': paddingUnit,
			'padding-top-general': paddingTop,
			'padding-bottom-general': paddingBottom,
			'padding-left-general': paddingLeft,
			'padding-right-general': paddingRight,
		}) => ({
			'padding-unit-general': paddingUnit,
			'padding-top-general': paddingTop,
			'padding-bottom-general': paddingBottom,
			'padding-left-general': paddingLeft,
			'padding-right-general': paddingRight,
		}))(pageAttributes);

		expect(paddingAttributes).toStrictEqual(expectPadding);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
