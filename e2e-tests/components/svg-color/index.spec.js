/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	editColorControl,
	getAttributes,
	getEditedPostContent,
	modalMock,
	openSidebarTab,
	insertMaxiBlock,
} from '../../utils';

describe('Icon Color', () => {
	it('Check Icon Color', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Icon Maxi');
		await modalMock(page, { type: 'svg' });

		// Close model opened automatically by the block
		await page.waitForSelector(
			'.components-modal__content .components-modal__header button'
		);
		await page.$eval(
			'.components-modal__content .components-modal__header button',
			svg => svg.click()
		);

		await openSidebarTab(page, 'style', 'icon colour');

		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control__SVG-fill-color'),
			paletteStatus: true,
			colorPalette: 4,
		});

		expect(await getAttributes('svg-fill_pc')).toStrictEqual(4);

		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control__SVG-line-color'),
			paletteStatus: true,
			colorPalette: 7,
		});

		expect(await getAttributes('svg-line_pc')).toStrictEqual(7);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
	});
});
