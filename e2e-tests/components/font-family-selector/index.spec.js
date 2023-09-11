/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	getAttributes,
	changeResponsive,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('FontFamilySelector', () => {
	it('Checking the font family selector', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-family input',
			button => button.focus()
		);

		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		expect(await getAttributes('font-family-general')).toStrictEqual(
			'Montserrat'
		);

		// reset button
		await page.$eval(
			'.maxi-tabs-content .maxi-typography-control .maxi-base-control .maxi-reset-button',
			button => button.click()
		);

		expect(await getAttributes('font-family-general')).toStrictEqual(
			undefined
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Works on responsive', async () => {
		await changeResponsive(page, 's');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-family input',
			button => button.focus()
		);

		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		expect(await getAttributes('font-family-s')).toStrictEqual(
			'Montserrat'
		);

		const hasBeenLoaded = await page.evaluate(() =>
			document.fonts.check('12px Montserrat')
		);
		expect(hasBeenLoaded).toBeTruthy();
	});
});
