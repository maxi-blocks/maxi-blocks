/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	// getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

describe('checkbox control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the checkbox control', async () => {
		await insertBlock('Text Maxi');

		const accordionPanel = await openSidebar(page, 'padding margin');

		const axisControls = await accordionPanel.$$('.maxi-axis-control');
		const marginControl = axisControls[1];
		const checkBoxes = await marginControl.$$(
			'.maxi-axis-control__content__item .maxi-axis-control__content__item__checkbox input'
		);

		for (const checkBox of checkBoxes) {
			await checkBox.click();
		}
		// estas? si => consola
		const marginKeys = [
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
			'margin-top-general',
		];

		const fourthAttributes = await getBlockAttributes();

		const areAllAuto = marginKeys.every(key => {
			return fourthAttributes[key] === 'auto';
		});
		// ["The specified value \"auto\" cannot be parsed, or is out of range."] => ni idea colega lol => es rarismo => siguiente, ya lo miraremos
		expect(areAllAuto).toStrictEqual(true);
	});
});
