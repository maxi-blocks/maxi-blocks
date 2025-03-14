/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
	getAttributes,
	addResponsiveTest,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('FullSizeControl', () => {
	it('Checking the full size control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'height width'
		);

		await accordionPanel.$eval(
			'.maxi-toggle-switch .maxi-toggle-switch__toggle input',
			use => use.click()
		);

		expect(await getAttributes('full-width-xl')).toStrictEqual(true);

		const inputs = await accordionPanel.$(
			'.maxi-full-size-control .maxi-full-size-control__height .maxi-advanced-number-control__value'
		);

		await inputs.focus();
		await page.keyboard.type('330', { delay: 350 });

		// check responsive height
		const responsiveResult = await addResponsiveTest({
			page,
			instance:
				'.maxi-full-size-control .maxi-full-size-control__height .maxi-advanced-number-control__value',
			needFocus: true,
			baseExpect: '330',
			xsExpect: '200',
			newValue: '200',
		});
		expect(responsiveResult).toBeTruthy();

		// responsive full-width
		await changeResponsive(page, 's');

		await accordionPanel.$eval(
			'.maxi-toggle-switch .maxi-toggle-switch__toggle input',
			use => use.click()
		);
		expect(await getAttributes('full-width-s')).toStrictEqual(false);

		await changeResponsive(page, 'xs');
		const fullWidthXs = await page.$eval(
			'.maxi-toggle-switch .maxi-toggle-switch__toggle input',
			input => input.checked
		);
		expect(fullWidthXs).toStrictEqual(false);
		await changeResponsive(page, 'm');
		const fullWidthM = await page.$eval(
			'.maxi-toggle-switch .maxi-toggle-switch__toggle input',
			input => input.checked
		);
		expect(fullWidthM).toStrictEqual(true);

		await changeResponsive(page, 'base');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Checking fullSizeControl unit selector', async () => {
		await changeResponsive(page, 'base');

		await page.$eval(
			'.maxi-full-size-control .maxi-full-size-control__custom-min-max input',
			button => button.click()
		);

		const selectorHeight = await page.$(
			'.maxi-full-size-control .maxi-full-size-control__height .maxi-dimensions-control__units select'
		);
		const selectorWidth = await page.$(
			'.maxi-full-size-control .maxi-full-size-control__min-width .maxi-dimensions-control__units select'
		);

		// check that vh works in height and does not exist in width
		await selectorHeight.select('vh');
		await selectorWidth.select('vh');

		expect(await getAttributes('height-unit-xl')).toStrictEqual('vh');
		expect(await getAttributes('min-width-unit-xl')).toStrictEqual('');

		const selector = await page.$$(
			'.maxi-full-size-control .maxi-dimensions-control__units select'
		);

		for (let i = 0; i < selector.length; i += 1) {
			const selection = selector[i];

			await selection.select('em');
		}

		const expectSize = {
			'max-height-unit-xl': 'em',
			'min-height-unit-xl': 'em',
			'min-width-unit-xl': 'em',
		};

		const result = await getAttributes([
			'max-height-unit-xl',
			'min-height-unit-xl',
			'min-width-unit-xl',
		]);

		expect(result).toStrictEqual(expectSize);
	});
	it('Checking fullSizeControl force aspect ratio', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');

		// select 3 columns
		await page.waitForSelector('.maxi-row-block__template button');
		await page.waitForTimeout(100);
		await page.$$eval('.maxi-row-block__template button', button =>
			button[6].click()
		);
		await page.waitForSelector('.maxi-column-block');

		await updateAllBlockUniqueIds(page);

		await page.waitForTimeout(500);

		// select colum
		await page.$eval(
			'.maxi-row-block .maxi-column-block .block-editor-inserter',
			button => button.click()
		);

		await openSidebarTab(page, 'style', 'height width');

		// select Force Aspect Ratio
		await page.$eval(
			'.maxi-full-size-control .maxi-full-size-control__force-aspect-ratio input',
			input => input.click()
		);

		// forceAspectRatioInput
		expect(await getAttributes('force-aspect-ratio-xl')).toStrictEqual(
			true
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// check responsive
		await changeResponsive(page, 's');

		// unselect Force Aspect Ratio
		await page.$eval(
			'.maxi-full-size-control .maxi-full-size-control__force-aspect-ratio input',
			input => input.click()
		);
		expect(await getAttributes('force-aspect-ratio-s')).toStrictEqual(
			false
		);

		await changeResponsive(page, 'xs');
		const forceAspectXs = await page.$eval(
			'.maxi-full-size-control .maxi-full-size-control__force-aspect-ratio input',
			input => input.checked
		);
		expect(forceAspectXs).toStrictEqual(false);

		await changeResponsive(page, 'm');

		const forceAspectM = await page.$eval(
			'.maxi-full-size-control .maxi-full-size-control__force-aspect-ratio input',
			input => input.checked
		);
		expect(forceAspectM).toStrictEqual(true);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
