import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('Github actions errors', () => {
	it('Should pass', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		expect(true).toBeTruthy();
	});
});
