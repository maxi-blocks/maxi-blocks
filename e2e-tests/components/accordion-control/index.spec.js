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

describe('accordion control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the accordion control', async () => {
		await insertBlock('Text Maxi');

		const accordionPanel = await openSidebar(page);

		for (let j = 0; j < accordionPanel.7; j++) {
			const input = accordionPanel[j];

			await input.focus();
			await page.keyboard.press((j + 1).toString());
		}

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
