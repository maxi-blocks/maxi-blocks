/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('BoxShadowControl', () => {
	it('Checking the boxShadow control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'box shadow');

		await accordionPanel.$$eval('.maxi-shadow-control button', click =>
			click[1].click()
		);

		const expectAttributes = {
			'box-shadow-blur-general': 87,
			'box-shadow-color-general': undefined,
			'box-shadow-horizontal-general': 0,
			'box-shadow-spread-general': 10,
			'box-shadow-status-hover': false,
			'box-shadow-vertical-general': 0,
		};

		const attributes = await getBlockAttributes();

		const typographyAttributes = (({
			'box-shadow-blur-general': boxShadowBlur,
			'box-shadow-color-general': boxShadowColor,
			'box-shadow-horizontal-general': boxShadowHorizontal,
			'box-shadow-spread-general': boxShadowSpread,
			'box-shadow-status-hover': boxShadowStatus,
			'box-shadow-vertical-general': boxShadowVertical,
		}) => ({
			'box-shadow-blur-general': boxShadowBlur,
			'box-shadow-color-general': boxShadowColor,
			'box-shadow-horizontal-general': boxShadowHorizontal,
			'box-shadow-spread-general': boxShadowSpread,
			'box-shadow-status-hover': boxShadowStatus,
			'box-shadow-vertical-general': boxShadowVertical,
		}))(attributes);

		expect(typographyAttributes).toStrictEqual(expectAttributes);
	});
});
