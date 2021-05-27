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

describe('boxShadow control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the boxShadow control', async () => {
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'box shadow');

		const boxShadowControls = await accordionPanel.$$eval(
			'.maxi-shadow-control button',
			click => click[1].click()
		);

		const expectAttributes = {
			'box-shadow-blur-general': 87,
			'box-shadow-color-general': 'rgb(236, 241, 246)',
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
