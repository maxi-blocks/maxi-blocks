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

// Helper to reliably select the row block in the editor
const selectRowBlock = async () => {
	await page.waitForSelector('.maxi-row-block', { timeout: 10000 });
	await page.click('.maxi-row-block');
	// Wait for block toolbar / selection indicator to confirm selection
	await page.waitForSelector(
		'.maxi-row-block.is-selected, .maxi-row-block.has-child-selected, .block-editor-block-list__block.is-selected .maxi-row-block',
		{ timeout: 10000 }
	).catch(() => {
		// Fallback: click again if selection didn't register
	});
	await page.waitForTimeout(500);
};

// Helper to wait for pattern template buttons inside an accordion
const waitForPatternButtons = async (accordion, minCount = 1) => {
	// Poll until buttons appear (up to 10s)
	let buttons = [];
	for (let i = 0; i < 20; i++) {
		buttons = await accordion.$$('.components-column-pattern__templates button');
		if (buttons.length >= minCount) return buttons;
		await page.waitForTimeout(500);
	}
	throw new Error(
		`Expected at least ${minCount} pattern template buttons, found ${buttons.length}`
	);
};

describe('ColumnPattern', () => {
	it('Check column pattern', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);

		await selectRowBlock();

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

		// Wait for pattern buttons to render before clicking
		const patternButtons = await waitForPatternButtons(accordionControl, 1);
		await patternButtons[0].click();

		await page.waitForTimeout(500);

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
		// Ensure the row block is still selected
		await selectRowBlock();

		// s responsive
		await changeResponsive(page, 's');

		// Wait for responsive change to take effect and sidebar to update
		await page.waitForTimeout(1000);

		let accordionControl = await openSidebarTab(
			page,
			'style',
			'column picker'
		);

		// Wait for at least 2 pattern buttons before clicking index [1]
		let patternBtns = await waitForPatternButtons(accordionControl, 2);
		await patternBtns[1].click();

		await page.waitForTimeout(300);

		const buttonClick = await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			button => button[1] && button[1].ariaPressed
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

		// Wait for responsive change to take effect and sidebar to update
		await page.waitForTimeout(1000);

		accordionControl = await openSidebarTab(page, 'style', 'column picker');

		await waitForPatternButtons(accordionControl, 2);

		const rowSelectedXs = await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			button => button[1] && button[1].ariaPressed
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

		// Wait for responsive change to take effect and sidebar to update
		await page.waitForTimeout(1000);

		accordionControl = await openSidebarTab(page, 'style', 'column picker');

		await waitForPatternButtons(accordionControl, 1);

		const rowSelectedL = await accordionControl.$$eval(
			'.components-column-pattern__templates button',
			button => button[0] && button[0].ariaPressed
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
