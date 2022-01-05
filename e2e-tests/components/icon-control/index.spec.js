/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	modalMock,
	getAttributes,
} from '../../utils';

describe('IconControl', () => {
	it('Check Icon Control', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'style', 'icon');

		// select icon
		await modalMock(page, { type: 'button-icon' });

		expect(await getEditedPostContent()).toMatchSnapshot();

		// width, stroke width
		const inputs = await page.$$(
			'.maxi-advanced-number-control .maxi-base-control__field input'
		);

		// width
		await inputs[0].click();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('40');

		expect(await getAttributes('icon-width-general')).toStrictEqual(340);

		// stroke width
		await inputs[2].click();
		await page.keyboard.type('5');

		expect(await getAttributes('icon-stroke-general')).toStrictEqual(5);

		// icon spacing
		await inputs[4].click();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('66');

		expect(await getAttributes('icon-spacing-general')).toStrictEqual(66);

		// icon position
		const iconPosition = await page.$$('.maxi-tabs-control button');

		await iconPosition[1].click();
		const { 'icon-position': position } = await getBlockAttributes();

		expect(position).toStrictEqual('right');

		// Icon Border
		await iconPosition[3].click();

		await page.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[2].click()
		);

		// expects
		expect(await getAttributes('icon-border-style-general')).toStrictEqual(
			'dashed'
		);
	});
});
