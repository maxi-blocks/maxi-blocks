/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openSidebar } from '../../utils';

describe('arrow control', () => {
	it('cheking the arrow control', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);
		const accordionPanel = await openSidebar(page, 'arrow');

		await accordionPanel.$$eval('.maxi-arrow-control label', button =>
			button[1].click()
		);

		const attributes = await getBlockAttributes();
		const arrowStatus = attributes['arrow-status'];
		const expectStatus = true;
		expect(arrowStatus).toStrictEqual(expectStatus);
	});
});
