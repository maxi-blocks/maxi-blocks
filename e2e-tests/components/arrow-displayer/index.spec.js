/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('ArrowDisplay', () => {
	it('Cheking the arrow display', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);
		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'callout arrow'
		);

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
