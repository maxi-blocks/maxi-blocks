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
	getBlockStyle,
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

		// width
		const widthInput = await page.$(
			'.maxi-icon-control__width .maxi-base-control__field input'
		);
		await widthInput.click();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('40', { delay: 350 });

		expect(await getAttributes('icon-width-general')).toStrictEqual('340');

		// stroke width
		const strokeWidthInput = await page.$(
			'.maxi-icon-control__stroke-width .maxi-base-control__field input'
		);
		await strokeWidthInput.click();
		await page.keyboard.type('5', { delay: 350 });

		expect(await getAttributes('icon-stroke-general')).toStrictEqual(5);

		// icon spacing
		const spacingInput = await page.$(
			'.maxi-icon-control__spacing .maxi-base-control__field input'
		);
		await spacingInput.click();
		await pressKeyWithModifier('ctrl', 'a');
		await page.keyboard.type('66', { delay: 350 });

		expect(await getAttributes('icon-spacing-general')).toStrictEqual(66);

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
		expect(await getAttributes('icon-border-style-general')).toStrictEqual(
			'dashed'
		);
	});

	it('Should change icon border radius and padding units', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);
		await openSidebarTab(page, 'style', 'icon');

		// select icon
		await modalMock(page, { type: 'button-icon' });

		// Set border radius to 100
		const borderTabButton = await page.$(
			'button.maxi-tabs-control__button-border'
		);
		await borderTabButton.click();
		const borderRadiusInput = await page.$(
			'.maxi-axis-control__icon-border .maxi-advanced-number-control .maxi-base-control__field input'
		);
		await borderRadiusInput.click();
		await page.keyboard.type('100', { delay: 350 });

		// Set padding to 100
		const paddingInput = await page.$(
			'.maxi-axis-control__icon-padding .maxi-advanced-number-control .maxi-base-control__field input'
		);
		await paddingInput.click();
		await page.keyboard.type('100', { delay: 350 });

		// Change border radius units to em
		const borderRadiusSelect = await page.$(
			'.maxi-axis-control__icon-border .maxi-select-control__input'
		);
		await borderRadiusSelect.select('em');

		// Change padding units to %
		const paddingSelect = await page.$(
			'.maxi-axis-control__icon-padding .maxi-select-control__input'
		);
		await paddingSelect.select('%');

		await page.waitForTimeout(1000);

		// Verify the changes
		expect(
			await getAttributes('icon-border-top-left-radius-general')
		).toStrictEqual(100);
		expect(
			await getAttributes('icon-border-unit-radius-general')
		).toStrictEqual('em');
		expect(await getAttributes('icon-padding-top-general')).toStrictEqual(
			'100'
		);
		expect(
			await getAttributes('icon-padding-top-unit-general')
		).toStrictEqual('%');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
