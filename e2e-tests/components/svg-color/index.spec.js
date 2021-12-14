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
	changeResponsive,
} from '../../utils';

describe('Svg Icon Maxi', () => {
	it('Svg Color Control', async () => {
		await createNewPost();
		await insertBlock('SVG Icon Maxi');
		await modalMock(page, { type: 'svg' });

		await page.waitForTimeout(200);

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

		expect(await getAttributes('svg-palette-fill-color')).toStrictEqual(4);

		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control__SVG-line-color'),
			paletteStatus: true,
			colorPalette: 7,
		});

		expect(await getAttributes('svg-palette-line-color')).toStrictEqual(7);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	/* it('Svg Color Control responsive', async () => {
		await changeResponsive(page, 's');

		debugger;
		// base values
		const baseFillColor = await page.$eval(
			'.maxi-color-control__SVG-fill-color .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(baseFillColor).toStrictEqual(4);

		const baseLineColor = await page.$eval(
			'.maxi-color-control__SVG-line-color .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(baseLineColor).toStrictEqual(7);

		// change values
		await openSidebarTab(page, 'style', 'colour');

		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control__SVG-fill-color'),
			paletteStatus: true,
			colorPalette: 6,
		});

		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control__SVG-line-color'),
			paletteStatus: true,
			colorPalette: 3,
		});

		// xs
		await changeResponsive(page, 'xs');

		const xsFillColor = await page.$eval(
			'.maxi-color-control__SVG-fill-color .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(xsFillColor).toStrictEqual(6);

		const xsLineColor = await page.$eval(
			'.maxi-color-control__SVG-line-color .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(xsLineColor).toStrictEqual(3);

		// m
		await changeResponsive(page, 'm');

		const mFillColor = await page.$eval(
			'.maxi-color-control__SVG-fill-color .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(mFillColor).toStrictEqual(4);

		const mLineColor = await page.$eval(
			'.maxi-color-control__SVG-line-color .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(mLineColor).toStrictEqual(7);
	}); */
});
