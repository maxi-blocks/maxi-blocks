/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import {
	getBlockStyle,
	openSidebarTab,
	changeResponsive,
	addResponsiveTest,
	getAttributes,
} from '../../utils';

describe('Divider Maxi', () => {
	it('Divider Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Divider Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Divider alignment', async () => {
		const accordionPanel = await openSidebarTab(page, 'style', 'alignment');

		const alignmentSelectors = await accordionPanel.$$(
			'.maxi-base-control select'
		);

		await alignmentSelectors[0].select('vertical');
		await page.waitForTimeout(150);
		await alignmentSelectors[1].select('flex-start');
		await page.waitForTimeout(150);
		await alignmentSelectors[2].select('flex-start');

		// responsive
		// responsive S
		await changeResponsive(page, 's');

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
	// divider line orientation responsive
	it('Check responsive line orientation', async () => {
		await createNewPost();
		await insertBlock('Divider Maxi');
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

		const alignmentSelectors = await accordionPanel.$(
			'.line-orientation-selector select'
		);

		await changeResponsive(page, 'l');
		await alignmentSelectors.select('horizontal');
		expect(await getAttributes('line-orientation-l')).toStrictEqual(
			'horizontal'
		);

		expect(await getAttributes('line-orientation-s')).toStrictEqual(
			'vertical'
		);
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
