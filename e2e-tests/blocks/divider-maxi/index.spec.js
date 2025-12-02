/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
import {
	addCustomCSS,
	addResponsiveTest,
	changeResponsive,
	getAttributes,
	getBlockStyle,
	getEditedPostContent,
	insertMaxiBlock,
	openSidebarTab,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Divider Maxi', () => {
	it('Divider Maxi does not break', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Divider alignment', async () => {
		const accordionPanel = await openSidebarTab(page, 'style', 'alignment');

		let alignmentSelectors = await accordionPanel.$$(
			'.maxi-base-control select'
		);

		await alignmentSelectors[0].select('vertical');
		await page.waitForTimeout(150);
		await alignmentSelectors[1].select('flex-start');
		await page.waitForTimeout(150);
		await alignmentSelectors[2].select('flex-start');

		expect(await getAttributes('line-orientation-general')).toStrictEqual(
			'vertical'
		);
		expect(await getAttributes('line-vertical-general')).toStrictEqual(
			'flex-start'
		);
		expect(await getAttributes('line-horizontal-general')).toStrictEqual(
			'flex-start'
		);

		// responsive horizontal
		// responsive S
		await changeResponsive(page, 's');

		alignmentSelectors = await accordionPanel.$$(
			'.maxi-base-control select'
		);
		await alignmentSelectors[0].select('horizontal');
		await page.waitForTimeout(150);
		await alignmentSelectors[1].select('flex-end');
		await page.waitForTimeout(150);
		await alignmentSelectors[2].select('flex-end');

		// responsive XS
		const alignmentOrientation = await accordionPanel.$$eval(
			'.maxi-base-control select',
			select => select[0].value
		);
		const alignmentVertical = await accordionPanel.$$eval(
			'.maxi-base-control select',
			select => select[1].value
		);
		const alignmentHorizontal = await accordionPanel.$$eval(
			'.maxi-base-control select',
			select => select[2].value
		);

		expect(alignmentOrientation).toBe('horizontal');
		expect(alignmentVertical).toBe('flex-end');
		expect(alignmentHorizontal).toBe('flex-end');

		// responsive M
		const alignmentMOrientation = await accordionPanel.$$eval(
			'.maxi-base-control select',
			select => select[0].value
		);
		const alignmentMVertical = await accordionPanel.$$eval(
			'.maxi-base-control select',
			select => select[1].value
		);
		const alignmentMHorizontal = await accordionPanel.$$eval(
			'.maxi-base-control select',
			select => select[2].value
		);

		expect(alignmentMOrientation).toBe('horizontal');
		expect(alignmentMVertical).toBe('flex-end');
		expect(alignmentMHorizontal).toBe('flex-end');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check responsive line orientation', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');
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
		await page.waitForTimeout(150);

		await changeResponsive(page, 'l');

		const alignmentSelectors = await accordionPanel.$(
			'.line-orientation-selector select'
		);

		await alignmentSelectors.select('horizontal');
		expect(await getAttributes('line-orientation-general')).toStrictEqual(
			'horizontal'
		);

		expect(await getAttributes('line-orientation-s')).toStrictEqual(
			'vertical'
		);
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Divider Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
