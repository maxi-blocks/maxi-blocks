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
	getEditorFrame,
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

		expect(await getAttributes('font-family-s')).toStrictEqual(
			'Montserrat'
		);

		// Wait for the font link to appear (async network request, can take >500ms)
		const fontSelector =
			'link[id*="maxi-blocks-styles-font-montserrat"]';
		let hasBeenLoaded = false;
		try {
			await page.waitForFunction(
				sel => !!document.querySelector(sel),
				{ timeout: 10000 },
				fontSelector
			);
			hasBeenLoaded = true;
		} catch {
			// Check in iframe as fallback
			const frame = await getEditorFrame(page);
			hasBeenLoaded = await frame.evaluate(
				sel => !!document.querySelector(sel),
				fontSelector
			);
		}

		expect(hasBeenLoaded).toBeTruthy();
	});
});
