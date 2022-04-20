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

		expect(await getAttributes('blockFullWidth')).toStrictEqual('full');

		// responsive
		await accordionPanel.$eval(
			'.maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		const inputs = await accordionPanel.$$(
			'.maxi-full-size-control .maxi-advanced-number-control .maxi-advanced-number-control__value'
		);

		await inputs[0].focus();
		await page.keyboard.type('330', { delay: 100 });

		// check responsive
		const responsiveResult = await addResponsiveTest({
			page,
			instance:
				'.maxi-full-size-control .maxi-advanced-number-control .maxi-advanced-number-control__value',
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

		await page.$$eval(
			'.maxi-full-size-control .maxi-toggle-switch input',
			button => button[1].click()
		);

		const selector = await page.$$(
			'.maxi-full-size-control .maxi-dimensions-control__units select'
		);

		// check that vh works in height and does not exist in width
		await selector[0].select('vh');
		await selector[1].select('vh');

		expect(await getAttributes('height-unit-general')).toStrictEqual('vh');
		expect(await getAttributes('max-width-unit-general')).toStrictEqual('');

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
