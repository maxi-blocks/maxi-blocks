/**
 * WordPress dependencies
 */
import { expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import {
	addCustomCSS,
	addResponsiveTest,
	changeResponsive,
	getAttributes,
	getBlockStyle,
	getEditedPostContent,
	insertMaxiBlock,
	openSidebarTab,
	test,
	updateAllBlockUniqueIds,
} from '../../utils';

test.describe('Divider Maxi', () => {
	test('Divider Maxi does not break', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Divider Maxi');

		await updateAllBlockUniqueIds(page);

		await expect(await getEditedPostContent(page, editor)).toMatchSnapshot(
			'divider-maxi__content.html'
		);
		await page.waitForTimeout(300);
		await expect(await getBlockStyle(page)).toMatchSnapshot(
			'divider-maxi__style.css'
		);
	});

	test('Check Divider alignment', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Divider Maxi');
		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(page, 'style', 'alignment');

		const alignmentSelectors = accordionPanel.locator(
			'.maxi-base-control select'
		);

		await alignmentSelectors.nth(0).selectOption('vertical');
		await alignmentSelectors.nth(1).selectOption('flex-start');
		await alignmentSelectors.nth(2).selectOption('flex-start');

		await page.waitForTimeout(300);
		expect(
			await getAttributes(page, 'line-orientation-general')
		).toStrictEqual('vertical');
		expect(
			await getAttributes(page, 'line-vertical-general')
		).toStrictEqual('flex-start');
		expect(
			await getAttributes(page, 'line-horizontal-general')
		).toStrictEqual('flex-start');

		// responsive horizontal
		// responsive S
		await changeResponsive(page, 's');

		const sAlignmentSelectors = accordionPanel.locator(
			'.maxi-base-control select'
		);
		await sAlignmentSelectors.nth(0).selectOption('horizontal');
		await sAlignmentSelectors.nth(1).selectOption('flex-end');
		await sAlignmentSelectors.nth(2).selectOption('flex-end');

		// responsive XS
		await changeResponsive(page, 'xs');

		const xsAlignmentSelectors = accordionPanel.locator(
			'.maxi-base-control select'
		);
		const alignmentOrientation = await xsAlignmentSelectors
			.nth(0)
			.inputValue();
		const alignmentVertical = await xsAlignmentSelectors
			.nth(1)
			.inputValue();
		const alignmentHorizontal = await xsAlignmentSelectors
			.nth(2)
			.inputValue();

		expect(alignmentOrientation).toBe('horizontal');
		expect(alignmentVertical).toBe('flex-end');
		expect(alignmentHorizontal).toBe('flex-end');

		// responsive M
		await changeResponsive(page, 'm');

		const mAlignmentSelectors = accordionPanel.locator(
			'.maxi-base-control select'
		);
		const alignmentMOrientation = await mAlignmentSelectors
			.nth(0)
			.inputValue();
		const alignmentMVertical = await mAlignmentSelectors
			.nth(1)
			.inputValue();
		const alignmentMHorizontal = await mAlignmentSelectors
			.nth(2)
			.inputValue();

		expect(alignmentMOrientation).toBe('vertical');
		expect(alignmentMVertical).toBe('flex-start');
		expect(alignmentMHorizontal).toBe('flex-start');

		await page.waitForTimeout(300);
		expect(await getBlockStyle(page)).toMatchSnapshot(
			'divider-alignment__style.css'
		);
	});

	test('Check responsive line orientation', async ({
		admin,
		editor,
		page,
	}) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Divider Maxi');
		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(page, 'style', 'alignment');

		const responsiveVertical = await addResponsiveTest({
			page,
			instance: '.line-orientation-selector select',
			selectInstance: '.line-orientation-selector select',
			needSelectIndex: true,
			baseExpect: 'horizontal',
			xsExpect: 'vertical',
			newValue: 'vertical',
		});
		expect(responsiveVertical).toBeTruthy();

		await changeResponsive(page, 'l');

		const alignmentSelectors = accordionPanel.locator(
			'.line-orientation-selector select'
		);

		await alignmentSelectors.first().selectOption('horizontal');

		await page.waitForTimeout(300);
		expect(
			await getAttributes(page, 'line-orientation-general')
		).toStrictEqual('horizontal');

		expect(await getAttributes(page, 'line-orientation-s')).toStrictEqual(
			'vertical'
		);

		await page.waitForTimeout(300);
		expect(await getBlockStyle(page)).toMatchSnapshot(
			'divider-responsive-orientation__style.css'
		);
	});

	test('Divider Custom CSS', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Divider Maxi');
		await updateAllBlockUniqueIds(page);

		await expect(await addCustomCSS(page)).toMatchSnapshot(
			'divider-custom-css__style.css'
		);
	}, 500000);
});
