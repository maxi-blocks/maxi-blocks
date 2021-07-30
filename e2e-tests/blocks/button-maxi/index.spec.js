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
import { getBlockAttributes, openSidebar } from '../../utils';

describe('Button Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Button Maxi does not break', async () => {
		await insertBlock('Button Maxi');

		await page.keyboard.type('Hello');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	/* it('Check Button Icon', async () => {
		await insertBlock('Button Maxi');

		await page.keyboard.type('Hello');

		const accordionPanel = await openSidebar(page, 'icon');

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-library-modal__action-section__buttons button',
			click => click[0].click()
		);

		await page.waitForSelector('.maxi-library-modal');
		const modal = await page.$('.maxi-library-modal');
		await page.waitForSelector('.ais-SearchBox-input');
		const modalSearcher = await modal.$('.ais-SearchBox-input');
		await modalSearcher.focus();
		await page.keyboard.type('alert');
		await page.waitForTimeout(1000);
		await page.waitForSelector('.alert-maxi-svg');
		await modal.$eval(
			'.maxi-cloud-masonry-card__svg-container__button',
			button => button.click()
		);
		const expectShape =
			'<svg stroke-linejoin="round" stroke-width="2" stroke="#081219" data-stroke="" fill="none" viewBox="0 0 24 24" height="64px" width="64px" class="alert-maxi-svg"><g stroke-miterlimit="10"><path d="M11.157 3.995L2.521 19.037c-.372.648.096 1.456.843 1.456h17.272c.747 0 1.215-.808.843-1.456L12.843 3.995c-.373-.651-1.312-.651-1.685 0z"></path><path stroke-linecap="round" d="M12 9.615v5.003"></path></g><circle r=".202" cy="17.251" cx="12"></circle></svg>';

		const attributes = await getBlockAttributes();

		expect(
			attributes['icon-content']
				.replace(/(\r\n|\n|\r)/g, '')
				.replace(/\s/g, '')
		).toEqual(expectShape.replace(/(\r\n|\n|\r)/g, '').replace(/\s/g, ''));
	}); */
});
