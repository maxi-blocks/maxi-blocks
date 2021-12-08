/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * Interactive dependencies
 */
import { getBlockStyle, modalMock, addCustomCSS } from '../../utils';

describe('Svg Icon Maxi', () => {
	it('Svg Icon Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('SVG Icon Maxi');

		await modalMock(page, { type: 'svg' });
		await page.waitForTimeout(150);

		await page.$eval('button[aria-label="Close dialog"]', button =>
			button.click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Svg Icon Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
