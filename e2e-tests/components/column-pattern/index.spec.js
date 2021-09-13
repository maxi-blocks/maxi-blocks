/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar, changeResponsive } from '../../utils';

describe('ColumnPattern', () => {
	it('Check column pattern', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		const accordionControl = await openSidebar(page, 'row settings');

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

		const rowPattern = await getBlockAttributes();
		const rowAttribute = rowPattern['row-pattern-general'];

		expect(rowAttribute).toStrictEqual('1-1');

		// remove Gap
		await accordionControl.$eval(
			'.components-column-pattern__gap .maxi-radio-control__option label',
			click => click.click()
		);

		const removeGapAttributes = await getBlockAttributes();
		const gapAttribute = removeGapAttributes.removeColumnGap;
		const expectGap = true;

		expect(gapAttribute).toStrictEqual(expectGap);
	});

	it('Check responsive row-pattern', async () => {
		const accordionControl = await openSidebar(page, 'row settings');

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

		const rowPattern = await getBlockAttributes();
		const rowAttribute = rowPattern['row-pattern-s'];

		expect(rowAttribute).toStrictEqual('1-3');

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
	});
});
