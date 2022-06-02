/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { modalMock, getAttributes } from '../../utils';

describe('Svg Icon Maxi default size', () => {
	it('Svg Icon Maxi default size', async () => {
		await createNewPost();
		await insertBlock('Icon Maxi');

		await modalMock(page, { type: 'svg' });
		await page.waitForTimeout(150);

		await page.$eval('button[aria-label="Close dialog"]', button =>
			button.click()
		);

		expect(await getAttributes('svg-width-general')).toStrictEqual('64');
	});
});
