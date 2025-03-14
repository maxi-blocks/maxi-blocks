/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	changeResponsive,
	editAdvancedNumberControl,
	getAttributes,
	getBlockStyle,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('ClipPathControl', () => {
	const selectType = async (page, type) => {
		const selectType = await page.$(
			' .maxi-clip-path-control__handles .maxi-base-control__field select'
		);
		await selectType.select(type);
	};

	const getEditPoints = async () =>
		page.$$(
			' .maxi-clip-path-control__handles .maxi-clip-path-controller .maxi-clip-path-controller__settings'
		);

	const openCustomPoints = async () =>
		page.$$eval(
			' .maxi-clip-path-control__handles .maxi-settingstab-control button',
			use => use[1].click()
		);

	it('Checking the clip-path control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Image Maxi');
		await updateAllBlockUniqueIds(page);
		const accordionPanel = await openSidebarTab(page, 'style', 'clip path');

		// Use clip-path to create a triangle
		await accordionPanel.$eval(
			'.maxi-clip-path-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);
		await accordionPanel.$$eval('.clip-path-defaults button', click =>
			click[1].click()
		);

		expect(await getAttributes('clip-path-xl')).toStrictEqual(
			'polygon(50% 0%, 0% 100%, 100% 100%)'
		);

		// Transform the triangle into a square
		await accordionPanel.$eval(
			'.maxi-toggle-switch.clip-path-custom .maxi-base-control__label',
			use => use.click()
		);

		await selectType(page, 'inset');

		expect(await getAttributes('clip-path-xl')).toStrictEqual(
			'inset(15% 5% 15% 5%)'
		);

		// Edit the square
		await openCustomPoints();

		const [top, right, bottom, left] = await getEditPoints();

		await editAdvancedNumberControl({
			page,
			instance: top,
			newNumber: '28',
			newValue: 'px',
		});

		await editAdvancedNumberControl({
			page,
			instance: right,
			newNumber: '10',
		});

		await editAdvancedNumberControl({
			page,
			instance: bottom,
			newNumber: '25',
			newValue: 'px',
		});

		await editAdvancedNumberControl({
			page,
			instance: left,
			newNumber: '64',
		});

		expect(await getAttributes('clip-path-xl')).toStrictEqual(
			'inset(28px 10% 25px 64%)'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Checking the clip-path control responsive', async () => {
		// Responsive M
		await changeResponsive(page, 'm');

		await openCustomPoints();

		const [topM, rightM, bottomM, leftM] = await getEditPoints();

		await editAdvancedNumberControl({
			page,
			instance: topM,
			newNumber: '56',
			newValue: '%',
		});

		await editAdvancedNumberControl({
			page,
			instance: rightM,
			newNumber: '76',
			newValue: 'px',
		});

		await editAdvancedNumberControl({
			page,
			instance: bottomM,
			newNumber: '23',
			newValue: '%',
		});

		await editAdvancedNumberControl({
			page,
			instance: leftM,
			newNumber: '12',
			newValue: 'px',
		});

		expect(await getAttributes('clip-path-m')).toStrictEqual(
			'inset(56% 76px 23% 12px)'
		);

		// Responsive S
		await changeResponsive(page, 's');

		await selectType(page, 'ellipse');

		await openCustomPoints();

		const [leftS, topS, centerS] = await getEditPoints();

		await editAdvancedNumberControl({
			page,
			instance: leftS,
			newNumber: '6',
			newValue: 'px',
		});

		await editAdvancedNumberControl({
			page,
			instance: topS,
			newNumber: '18',
		});

		const [centerX, centerY] = await centerS.$$(
			' .maxi-base-control .maxi-advanced-number-control'
		);

		await editAdvancedNumberControl({
			page,
			instance: centerX,
			newNumber: '48',
			newValue: 'px',
		});

		await editAdvancedNumberControl({
			page,
			instance: centerY,
			newNumber: '34',
		});

		expect(await getAttributes('clip-path-s')).toStrictEqual(
			'ellipse(6px 18% at 48px 34%)'
		);

		changeResponsive(page, 'base');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
