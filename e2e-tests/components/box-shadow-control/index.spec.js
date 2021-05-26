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
			'box-shadow-color-general-hover': '',
			'box-shadow-horizontal-general': 0,
			'box-shadow-spread-general': 10,
			'box-shadow-status-hover': false,
			'box-shadow-vertical-general': 0,
		};
		const attributes = await getBlockAttributes();

		expect(attributes).toStrictEqual(expectAttributes);

		/* for (let i = 0; i < boxShadowControls.length; i++) {
			const boxShadowControl = await boxShadowControls[i];

			await boxShadowControl.click();
			const attributes = await getBlockAttributes();

			Object.entries(expectedAttributes).forEach(([key, value]) => {
				expect(attributes[key].toString()).toBe(value);
			});
		} */
	});
});
