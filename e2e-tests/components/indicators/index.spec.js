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

		const paddingResult = await getAttributes([
			'padding-top-general',
			'padding-bottom-general',
			'padding-left-general',
			'padding-right-general',
			'padding-unit-general',
		]);

		expect(paddingResult).toStrictEqual(expectPadding);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
