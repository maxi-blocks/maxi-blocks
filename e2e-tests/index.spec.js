import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockStyle, getEditedPostContent } from './utils';

describe('Github actions errors', () => {
	it('Should pass', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		await page.keyboard.type('Hello', { delay: 100 });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();

		expect(true).toBeTruthy();
	});
});
