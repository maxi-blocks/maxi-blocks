/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	changeResponsive,
	editAdvancedNumberControl,
} from '../../utils';

describe('Advanced Number Control', () => {
	it('Checking the advanced number control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		await changeResponsive(page, 'm');

		// Max value
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__letter-spacing '),
			newNumber: '31',
		});

		expect(await getAttributes('letter-spacing-m')).toStrictEqual(30);

		// Min value
		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
			select => select.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		// TODO: AdvancedNumberControl doesn't allow to empty the input and write '-' (minus),
		// so, made a cheat to test negative values
		await page.keyboard.type('0');
		await page.keyboard.press('ArrowDown');
		await pressKeyTimes('Backspace', 2);
		await page.keyboard.type('4');

		expect(await getAttributes('letter-spacing-m')).toStrictEqual(-3);

		// reset value
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__letter-spacing'),
			newNumber: '10',
		});

		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .components-maxi-control__reset-button',
			click => click.click()
		);

		expect(await getAttributes('letter-spacing-m')).toStrictEqual('');
	});
	it('Checking the advanced number control max value', async () => {
		await changeResponsive(page, 'base');

		// px max default value
		await openSidebarTab(page, 'style', 'height width');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-full-size-control .maxi-advanced-number-control'
			),
			newNumber: '4000',
		});
		expect(await getAttributes('height-general')).toStrictEqual(3999);

		// em max default value

		const heightSelector = await page.$(
			'.maxi-full-size-control .maxi-advanced-number-control select'
		);

		await heightSelector.select('em');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-full-size-control .maxi-advanced-number-control'
			),
			newNumber: '9999',
		});

		expect(await getAttributes('height-general')).toStrictEqual(999);

		// vw max default value
		await heightSelector.select('vw');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-full-size-control .maxi-advanced-number-control'
			),
			newNumber: '9999',
		});

		expect(await getAttributes('height-general')).toStrictEqual(999);
	});

	it('Checking the advanced number control min value', async () => {
		await openSidebarTab(page, 'style', 'margin padding');

		// px min default value

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-4000',
		});
		expect(await getAttributes('height-general')).toStrictEqual(-999);

		// em min default value
		const marginSelector = await page.$(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin select'
		);

		await marginSelector.select('em');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-9999',
		});

		expect(await getAttributes('height-general')).toStrictEqual(-999);

		// vw min default value
		await marginSelector.select('vw');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-9999',
		});

		expect(await getAttributes('height-general')).toStrictEqual(-999);
	});
});
