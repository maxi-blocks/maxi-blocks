/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { openSidebar } from '../../utils';

describe('ArrowDisplay', () => {
	it('Cheking the arrow display', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);
		const accordionPanel = await openSidebar(page, 'callout arrow');

		await accordionPanel.$eval(
			'.maxi-arrow-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		const hasClass = page.$$eval('.maxi-container-block div', test =>
			test[2].classList.contains('maxi-container-arrow__bottom')
		);

		expect(hasClass).toBeTruthy();
	});
});
