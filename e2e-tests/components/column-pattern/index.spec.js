/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
	getAttributes,
	editAdvancedNumberControl,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('ColumnPattern', () => {
	it('Check column pattern', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);

		await page.$eval('.maxi-row-block', row => row.focus());

		const accordionControl = await openSidebarTab(
			page,
			'style',
			'column picker'
		);

		// check default values
		expect(await getAttributes('column-gap-general')).toStrictEqual(2.5);
		expect(await getAttributes('column-gap-unit-general')).toStrictEqual(
			'%'
		);

		expect(await getAttributes('row-gap-general')).toStrictEqual(20);
		expect(await getAttributes('row-gap-unit-general')).toStrictEqual('px');

		// select column
		await accordionControl.$eval(
			'.components-column-pattern .maxi-base-control__field input',
			select => select.focus()
		);
		await pressKeyWithModifier('ctrl', 'a');
		await page.keyboard.type('2');

		await page.waitForTimeout(500);

		await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			click => click[0].click()
		);

		await page.waitForTimeout(500);

		expect(await getAttributes('row-pattern-xl')).toStrictEqual('1-1');

		// row gap
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-gap-control .maxi-gap-control__row-gap'
			),
			newNumber: '14',
			newValue: '%',
		});

		// column gap
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-gap-control .maxi-gap-control__column-gap'
			),
			newNumber: '32',
			newValue: 'em',
		});

		expect(await getAttributes('column-gap-xl')).toStrictEqual(32);
		expect(await getAttributes('column-gap-unit-xl')).toStrictEqual('em');

		expect(await getAttributes('row-gap-xl')).toStrictEqual(14);
		expect(await getAttributes('row-gap-unit-xl')).toStrictEqual('%');
	});

	it('Check responsive row-pattern', async () => {
		// s responsive
		await changeResponsive(page, 's');

		let accordionControl = await openSidebarTab(
			page,
			'style',
			'column picker'
		);

		await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			click => click[1].click()
		);

		const buttonClick = await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			button => button[1].ariaPressed
		);

		expect(buttonClick).toBeTruthy();

		expect(await getAttributes('row-pattern-s')).toStrictEqual('1-3');

		// row gap S
		await editAdvancedNumberControl({
			page,
			instance: await accordionControl.$(
				'.maxi-gap-control .maxi-gap-control__row-gap'
			),
			newNumber: '6',
			newValue: 'px',
		});

		// column gap S
		await editAdvancedNumberControl({
			page,
			instance: await accordionControl.$(
				'.maxi-gap-control .maxi-gap-control__column-gap'
			),
			newNumber: '12',
			newValue: '%',
		});

		await page.waitForTimeout(500);

		expect(await getAttributes('column-gap-s')).toStrictEqual(12);
		expect(await getAttributes('column-gap-unit-s')).toStrictEqual('%');

		expect(await getAttributes('row-gap-s')).toStrictEqual(6);
		expect(await getAttributes('row-gap-unit-s')).toStrictEqual('px');

		// xs responsive
		await changeResponsive(page, 'xs');

		accordionControl = await openSidebarTab(page, 'style', 'column picker');

		const rowSelectedXs = await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			button => button[1].ariaPressed
		);

		expect(rowSelectedXs).toBeTruthy();

		const rowGapValueXs = await accordionControl.$eval(
			'.maxi-gap-control .maxi-gap-control__row-gap input',
			input => input.value
		);
		const rowGapSelectXs = await accordionControl.$eval(
			'.maxi-gap-control .maxi-gap-control__row-gap select',
			input => input.value
		);

		const columnGapValueXs = await accordionControl.$eval(
			'.maxi-gap-control .maxi-gap-control__column-gap input',
			input => input.value
		);
		const columnGapSelectXs = await accordionControl.$eval(
			'.maxi-gap-control .maxi-gap-control__column-gap select',
			input => input.value
		);

		expect(rowGapValueXs).toStrictEqual('6');
		expect(rowGapSelectXs).toStrictEqual('px');

		expect(columnGapValueXs).toStrictEqual('12');
		expect(columnGapSelectXs).toStrictEqual('%');

		// m responsive
		await changeResponsive(page, 'm');

		accordionControl = await openSidebarTab(page, 'style', 'column picker');

		const rowSelectedL = await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			button => button[0].ariaPressed
		);

		expect(rowSelectedL).toBeTruthy();

		const rowGapValueM = await accordionControl.$eval(
			'.maxi-gap-control .maxi-gap-control__row-gap input',
			input => input.value
		);
		const rowGapSelectM = await accordionControl.$eval(
			'.maxi-gap-control .maxi-gap-control__row-gap select',
			input => input.value
		);

		const columnGapValueM = await accordionControl.$eval(
			'.maxi-gap-control .maxi-gap-control__column-gap input',
			input => input.value
		);
		const columnGapSelectM = await accordionControl.$eval(
			'.maxi-gap-control .maxi-gap-control__column-gap select',
			input => input.value
		);

		expect(rowGapValueM).toStrictEqual('14');
		expect(rowGapSelectM).toStrictEqual('%');

		expect(columnGapValueM).toStrictEqual('32');
		expect(columnGapSelectM).toStrictEqual('em');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
