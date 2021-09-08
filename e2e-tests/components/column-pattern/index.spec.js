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
		const expectRow = '1-1';

		expect(rowAttribute).toStrictEqual(expectRow);

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
	it('Check Responsive columnSize control', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);
		await openSidebar(page, 'width height');

		// general
		const heightInput = await page.$$(
			'.maxi-full-size-control .maxi-advanced-number-control input'
		);

		await heightInput[0].focus();
		await page.keyboard.type('50');
		const heightValue = await page.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			input => input[0].value
		);

		expect(heightValue).toStrictEqual('50');

		// responsive S
		await changeResponsive(page, 's');
		await heightInput[0].focus();
		await page.keyboard.type('7');

		const responsiveSOption = await page.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			input => input[0].value
		);

		expect(responsiveSOption).toStrictEqual('507');

		const attributes = await getBlockAttributes();
		const containerHeight = attributes['container-height-s'];

		expect(containerHeight).toStrictEqual(507);

		// responsive XS
		await changeResponsive(page, 'xs');
		const responsiveXsOption = await page.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			input => input[0].value
		);

		expect(responsiveXsOption).toStrictEqual('507');

		// responsive M
		await changeResponsive(page, 'm');
		const responsiveMOption = await page.$$eval(
			'.maxi-full-size-control .maxi-advanced-number-control input',
			input => input[0].value
		);

		expect(responsiveMOption).toStrictEqual('50');
	});
});
