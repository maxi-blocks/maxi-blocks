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
import { modalMock } from '../../utils';

describe('Button Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
	});

	it('Button Maxi does not break', async () => {
		await page.keyboard.type('Hello', { delay: 100 });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Check Button Icon', async () => {
		await page.keyboard.type('Hello');

		await modalMock(page, { type: 'button-icon' });

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
