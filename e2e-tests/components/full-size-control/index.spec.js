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
	addResponsiveTest,
} from '../../utils';

describe('FullSizeControl', () => {
	it('Checking the full size control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'height width'
		);

		await accordionPanel.$eval(
			'.maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		expect(await getAttributes('full-width-general')).toStrictEqual('full');

		// responsive
		await accordionPanel.$eval(
			'.maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		const inputs = await accordionPanel.$(
			'.maxi-full-size-control .maxi-full-size-control__height .maxi-advanced-number-control__value'
		);

		await inputs.focus();
		await page.keyboard.type('330', { delay: 100 });

		// check responsive
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

		expect(await getAttributes('height-unit-general')).toStrictEqual('vh');
		expect(await getAttributes('min-width-unit-general')).toStrictEqual('');

		const selector = await page.$$(
			'.maxi-full-size-control .maxi-dimensions-control__units select'
		);

		for (let i = 0; i < selector.length; i += 1) {
			const selection = selector[i];

			await selection.select('em');
		}

		const expectSize = {
			'max-height-unit-general': 'em',
			'max-width-unit-general': 'em',
			'min-height-unit-general': 'em',
			'min-width-unit-general': 'em',
		};

		const result = await getAttributes([
			'max-height-unit-general',
			'max-width-unit-general',
			'min-height-unit-general',
			'min-width-unit-general',
		]);

		expect(result).toStrictEqual(expectSize);
	});
});
