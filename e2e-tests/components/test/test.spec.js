import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';

describe('tests', () => {
	it('select', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		const attributes = await getBlockAttributes();

		debugger;

		expect(typeof attributes).toBe('object');
	});
});
