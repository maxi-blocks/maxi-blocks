/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyTimes,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getAttributes,
	getBlockAttributes,
	getEditedPostContent,
	modalMock,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('IconControl', () => {
	it('Check Icon Control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);
		await openSidebarTab(page, 'style', 'icon');

		// select icon
		await modalMock(page, { type: 'button-icon' });

		expect(await getEditedPostContent(page)).toMatchSnapshot();

		// width, stroke width
		const inputs = await page.$$(
			'.maxi-advanced-number-control .maxi-base-control__field input'
		);

		// width
		await inputs[0].click();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('40', { delay: 350 });

		expect(await getAttributes('icon-width-xl')).toStrictEqual('340');

		// stroke width
		await inputs[2].click();
		await page.keyboard.type('5', { delay: 350 });

		expect(await getAttributes('icon-stroke-xl')).toStrictEqual(5);

		// icon spacing
		await inputs[4].click();
		await pressKeyWithModifier('ctrl', 'a');
		await page.keyboard.type('66', { delay: 350 });

		expect(await getAttributes('icon-spacing-xl')).toStrictEqual(66);

		// icon position
		const iconPosition = await page.$$(
			'.maxi-settingstab-control.maxi-icon-control__position button'
		);

		await iconPosition[2].click();
		const { 'icon-position': position } = await getBlockAttributes();

		expect(position).toStrictEqual('left');

		// Icon Border
		const iconBorder = await page.$$(
			'.maxi-settingstab-control.maxi-icon-styles-control button'
		);

		await iconBorder[2].click();

		await page.$$eval(
			'.maxi-border-control .maxi-default-styles-control button',
			button => button[2].click()
		);

		// expects
		expect(await getAttributes('icon-border-style-xl')).toStrictEqual(
			'dashed'
		);
	});
});
