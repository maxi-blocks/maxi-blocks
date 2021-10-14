/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar, getBlockStyle } from '../../utils';

describe('CheckBoxControl', () => {
	it('checking the checkbox control', async () => {
		await createNewPost();
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

		expect(areAllAuto).toStrictEqual(true);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
