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
import {
	modalMock,
	openSidebarTab,
	editColorControl,
	getAttributes,
} from '../../utils';

describe('Svg Color', () => {
	it('Svg Color Control', async () => {
		await createNewPost();
		await insertBlock('SVG Icon Maxi');
		await modalMock(page, { type: 'svg' });

		// Close model opened automatically by the block
		await page.waitForSelector(
			'.components-modal__content .maxi-cloud-container .ais-InfiniteHits-list .maxi-cloud-masonry-card__svg-container'
		);
		await page.$$eval(
			'.components-modal__content .maxi-cloud-container .ais-InfiniteHits-list .maxi-cloud-masonry-card__svg-container',
			svg => svg[0].click()
		);

		await openSidebarTab(page, 'style', 'colour');

		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control__SVG-fill-color'),
			paletteStatus: true,
			colorPalette: 4,
		});

		expect(await getAttributes('svg-fill-palette-color')).toStrictEqual(4);

		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control__SVG-line-color'),
			paletteStatus: true,
			colorPalette: 7,
		});

		expect(await getAttributes('svg-line-palette-color')).toStrictEqual(7);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
