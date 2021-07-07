/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('ColumnPattern', () => {
	it('Check column pattern', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		const accordionControl = await openSidebar(page, 'row settings');
		debugger;

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
});
