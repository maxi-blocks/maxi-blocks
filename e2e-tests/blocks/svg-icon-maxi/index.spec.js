/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	modalMock,
	addCustomCSS,
	waitForAttribute,
} from '../../utils';

describe('Svg Icon Maxi', () => {
	it('Svg Icon Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Icon Maxi');

		await modalMock(page, { type: 'svg' });

		await page.$eval('button[aria-label="Close dialog"]', button =>
			button.click()
		);
		await page.waitForTimeout(200);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Svg Icon Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
