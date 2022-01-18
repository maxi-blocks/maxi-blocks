/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	modalMock,
	openSidebarTab,
	getAttributes,
	changeResponsive,
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
	});
	it('Check responsive svg stroke width control', async () => {
		await changeResponsive(page, 's');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'icon line width'
		);

		const baseStrokeValue = await accordionPanel.$eval(
			'.maxi-advanced-number-control input',
			input => input.placeholder
		);
		expect(baseStrokeValue).toStrictEqual('3');

		await accordionPanel.$eval(
			'.maxi-advanced-number-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('1');

		await changeResponsive(page, 'xs');

		const sStrokeValue = await accordionPanel.$eval(
			'.maxi-advanced-number-control input',
			input => input.placeholder
		);
		expect(sStrokeValue).toStrictEqual('1');

		await changeResponsive(page, 'm');

		const mStrokeValue = await accordionPanel.$eval(
			'.maxi-advanced-number-control input',
			input => input.placeholder
		);
		expect(mStrokeValue).toStrictEqual('3');
	});
});
