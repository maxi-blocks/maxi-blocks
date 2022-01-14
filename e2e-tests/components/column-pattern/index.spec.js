/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	addResponsiveTest,
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
	getAttributes,
} from '../../utils';

describe('ColumnPattern', () => {
	it('Check column pattern', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
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

		// remove Gap
		await accordionControl.$eval(
			'.components-column-pattern__gap .maxi-toggle-switch .maxi-base-control__label',
			click => click.click()
		);

		expect(await getAttributes('removeColumnGap')).toStrictEqual(true);

		// test responsive util
		debugger;
		await addResponsiveTest({
			page,
			instance:
				'.components-column-pattern .maxi-base-control__field input',
			needFocus: true,
			baseExpect: '2',
			xsExpect: '55',
			newValue: '55',
		});
	});

	it('Check responsive row-pattern', async () => {
		const accordionControl = await openSidebarTab(
			page,
			'style',
			'column picker'
		);

		// general
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

		// s
		await changeResponsive(page, 's');

		await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			click => click[1].click()
		);

		const buttonClick = await page.$$eval(
			'.components-column-pattern__templates button',
			button => button[1].ariaPressed
		);

		expect(buttonClick).toBeTruthy();

		expect(await getAttributes('row-pattern-s')).toStrictEqual('1-3');

		// xs
		await changeResponsive(page, 'xs');

		const rowSelectedXs = await page.$$eval(
			'.components-column-pattern__templates button',
			button => button[1].ariaPressed
		);

		expect(rowSelectedXs).toBeTruthy();

		// l
		await changeResponsive(page, 'l');

		const rowSelectedL = await page.$$eval(
			'.components-column-pattern__templates button',
			button => button[0].ariaPressed
		);

		expect(rowSelectedL).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
