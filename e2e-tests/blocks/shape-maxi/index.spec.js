/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Shape Maxi', () => {
	it('Shape Maxi does not break', async () => {
		/* await createNewPost();
		await insertBlock('Shape Maxi');

		await page.waitForSelector('.maxi-library-modal');
		const modal = await page.$('.maxi-library-modal');
		await page.waitForSelector('.ais-SearchBox-input');
		const modalSearcher = await modal.$('.ais-SearchBox-input');
		await modalSearcher.focus();
		await page.keyboard.type('anchor');
		await page.waitForTimeout(1000);
		await page.waitForSelector('.anchor-maxi-svg');
		await modal.$eval(
			'.maxi-cloud-masonry-card__svg-container__button',
			button => button.click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot(); */
	});
});
