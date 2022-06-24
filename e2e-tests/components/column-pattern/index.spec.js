/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
	getAttributes,
	editAdvancedNumberControl,
	checkColumnPicker,
} from '../../utils';

/* const checkColumnPicker = async page => {
	const columnsStyles = await page.$$(
		'.components-column-pattern .components-column-pattern__templates button'
	);
	const expect1Column = [50, 25, 75, 20, 80];
	const expect2Column = [50, 75, 25, 80, 20];

	for (let i = 1; i < columnsStyles.length; i += 1) {
		await columnsStyles[i].click();
		debugger;

		const column1 = await page.$eval(
			'.maxi-column-block',
			block => block.style.cssText
		);

		const column2 = await page.$$eval(
			'.maxi-column-block',
			block => block[1].style.cssText
		);

		const expect1 = `position: relative; user-select: auto; width: ${expect1Column[i]}%; max-width: 100%; min-width: 1%; box-sizing: border-box;`;
		const expect2 = `position: relative; user-select: auto; width: ${expect2Column[i]}%; max-width: 100%; min-width: 1%; box-sizing: border-box;`;

		if (expect1 !== column1) {
			console.error(
				`The first column has an error with the width, with the expected with of ${expect1Column[i]}`
			);
		}
		if (expect2 !== column2) {
			console.error(
				`The first column has an error with the width, with the expected with of ${expect2Column[i]}`
			);
		}
	}
}; */

describe('ColumnPattern', () => {
	it('Check column pattern util test', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

		await page.$eval('.maxi-row-block', row => row.focus());

		const accordionControl = await openSidebarTab(
			page,
			'style',
			'column picker'
		);

		// select column
		await accordionControl.$eval(
			'.components-column-pattern .maxi-base-control__field input',
			select => select.focus()
		);
		await page.keyboard.press('Backspace');
		await page.keyboard.type('2');

		await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			click => click[0].click()
		);

		expect(await getAttributes('row-pattern-general')).toStrictEqual('1-1');

		const test = await checkColumnPicker(page);
		expect(test).toBeTruthy();
	});

	it('Check column pattern', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

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
		await page.keyboard.press('Backspace');
		await page.keyboard.type('2');

		await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			click => click[0].click()
		);

		expect(await getAttributes('row-pattern-general')).toStrictEqual('1-1');

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

		expect(await getAttributes('column-gap-general')).toStrictEqual(32);
		expect(await getAttributes('column-gap-unit-general')).toStrictEqual(
			'em'
		);

		expect(await getAttributes('row-gap-general')).toStrictEqual(14);
		expect(await getAttributes('row-gap-unit-general')).toStrictEqual('%');
	});

	it('Check responsive row-pattern', async () => {
		// s responsive
		await changeResponsive(page, 's');

		await page.$$eval(
			'.components-column-pattern__templates button',
			click => click[1].click()
		);

		const buttonClick = await page.$$eval(
			'.components-column-pattern__templates button',
			button => button[1].ariaPressed
		);

		expect(buttonClick).toBeTruthy();

		expect(await getAttributes('row-pattern-s')).toStrictEqual('1-3');

		// row gap S
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-gap-control .maxi-gap-control__row-gap'
			),
			newNumber: '6',
			newValue: 'px',
		});

		// column gap S
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-gap-control .maxi-gap-control__column-gap'
			),
			newNumber: '12',
			newValue: '%',
		});

		expect(await getAttributes('column-gap-s')).toStrictEqual(12);
		expect(await getAttributes('column-gap-unit-s')).toStrictEqual('%');

		expect(await getAttributes('row-gap-s')).toStrictEqual(6);
		expect(await getAttributes('row-gap-unit-s')).toStrictEqual('px');

		// xs responsive
		await changeResponsive(page, 'xs');

		const rowSelectedXs = await page.$$eval(
			'.components-column-pattern__templates button',
			button => button[1].ariaPressed
		);

		expect(rowSelectedXs).toBeTruthy();

		const rowGapValueXs = await page.$eval(
			'.maxi-gap-control .maxi-gap-control__row-gap input',
			input => input.value
		);
		const rowGapSelectXs = await page.$eval(
			'.maxi-gap-control .maxi-gap-control__row-gap select',
			input => input.value
		);

		const columnGapValueXs = await page.$eval(
			'.maxi-gap-control .maxi-gap-control__column-gap input',
			input => input.value
		);
		const columnGapSelectXs = await page.$eval(
			'.maxi-gap-control .maxi-gap-control__column-gap select',
			input => input.value
		);

		expect(rowGapValueXs).toStrictEqual('6');
		expect(rowGapSelectXs).toStrictEqual('px');

		expect(columnGapValueXs).toStrictEqual('12');
		expect(columnGapSelectXs).toStrictEqual('%');

		// m responsive
		await changeResponsive(page, 'm');

		const rowSelectedL = await page.$$eval(
			'.components-column-pattern__templates button',
			button => button[0].ariaPressed
		);

		expect(rowSelectedL).toBeTruthy();

		const rowGapValueM = await page.$eval(
			'.maxi-gap-control .maxi-gap-control__row-gap input',
			input => input.value
		);
		const rowGapSelectM = await page.$eval(
			'.maxi-gap-control .maxi-gap-control__row-gap select',
			input => input.value
		);

		const columnGapValueM = await page.$eval(
			'.maxi-gap-control .maxi-gap-control__column-gap input',
			input => input.value
		);
		const columnGapSelectM = await page.$eval(
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
