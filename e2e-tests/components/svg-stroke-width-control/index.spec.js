/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Interactive dependencies
 */
import {
	modalMock,
	openSidebarTab,
	getAttributes,
	addResponsiveTest,
} from '../../utils';

describe('Svg stroke width control', () => {
	it('Check svg stroke width control', async () => {
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

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'icon line width'
		);

		await accordionPanel.$$eval(
			'.maxi-advanced-number-control input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('3');

		expect(await getAttributes('svg-stroke-general')).toStrictEqual(3);

		expect(await getEditedPostContent()).toMatchSnapshot();

		// check responsive svg stroke
		const responsiveResult = await addResponsiveTest({
			page,
			instance: '.maxi-advanced-number-control input',
			needFocus: true,
			baseExpect: '3',
			xsExpect: '1',
			newValue: '1',
		});

		expect(responsiveResult).toBeTruthy();
	});
});
