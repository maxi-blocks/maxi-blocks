/**
 * WordPress dependencies
 */
import {
	createNewPost,
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
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Advanced Number Control', () => {
	it('Checking the advanced number control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await updateAllBlockUniqueIds(page);

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

		await page.waitForTimeout(500);

		expect(await getAttributes('letter-spacing-m')).toStrictEqual(30);

		// Min value
		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
			select => select.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('-4', { delay: 350 });

		expect(await getAttributes('letter-spacing-m')).toStrictEqual(-4);

		// Reset value
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__letter-spacing'),
			newNumber: '10',
		});

		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .maxi-reset-button',
			click => click.click()
		);

		expect(await getAttributes('letter-spacing-m')).toStrictEqual(
			undefined
		);

		// Check max value change
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__size'),
			newNumber: '300',
		});

		const selector = await page.$(
			'.maxi-typography-control .maxi-typography-control__size select'
		);

		await selector.select('em');
		expect(await getAttributes('font-size-m')).toStrictEqual(100);
	});
	it('Checking the advanced number control max value', async () => {
		await changeResponsive(page, 'base');
		await openSidebarTab(page, 'style', 'height width');

		// px max default value
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-full-size-control .maxi-full-size-control__height'
			),
			newNumber: '4000',
		});
		expect(await getAttributes('height-xl')).toStrictEqual('3999');

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

		expect(await getAttributes('height-xl')).toStrictEqual('3999');

		// vw max default value
		await heightSelector.select('vw');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-full-size-control .maxi-advanced-number-control'
			),
			newNumber: '9999',
		});

		expect(await getAttributes('height-xl')).toStrictEqual('3999');
	});

	it('Checking the advanced number control min value', async () => {
		await openSidebarTab(page, 'style', 'margin padding');

		// check px max rangue
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '998',
		});

		await page.$eval(
			'.maxi-axis-control__margin .components-range-control__slider',
			input => input.focus()
		);
		await pressKeyTimes('ArrowUp', '3');

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('999');

		// check px min rangue
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-998',
		});

		await page.$eval(
			'.maxi-axis-control__margin .components-range-control__slider',
			input => input.focus()
		);
		await pressKeyTimes('ArrowDown', '3');

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('-999');

		// px min default value
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-4000',
		});
		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('-999');

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

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('-999');

		// check em max rangue
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '298',
		});

		await page.$eval(
			'.maxi-axis-control__margin .components-range-control__slider',
			input => input.focus()
		);
		await pressKeyTimes('ArrowUp', '3');

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('300');

		// check em min rangue
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-298',
		});

		await page.$eval(
			'.maxi-axis-control__margin .components-range-control__slider',
			input => input.focus()
		);
		await pressKeyTimes('ArrowDown', '3');

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('-300');

		// vw min default value
		await marginSelector.select('vw');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-9999',
		});

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('-999');

		// check vw max rangue
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '298',
		});

		await page.$eval(
			'.maxi-axis-control__margin .components-range-control__slider',
			input => input.focus()
		);
		await pressKeyTimes('ArrowUp', '3');

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('300');

		// check vw min rangue
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-298',
		});

		await page.$eval(
			'.maxi-axis-control__margin .components-range-control__slider',
			input => input.focus()
		);
		await pressKeyTimes('ArrowDown', '3');

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('-300');

		// % min default value
		await marginSelector.select('%');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-9999',
		});

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('-999');

		// check % max rangue
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '99',
		});

		await page.$eval(
			'.maxi-axis-control__margin .components-range-control__slider',
			input => input.focus()
		);
		await pressKeyTimes('ArrowUp', '3');

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('100');

		// check % min rangue
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			newNumber: '-99',
		});

		await page.$eval(
			'.maxi-axis-control__margin .components-range-control__slider',
			input => input.focus()
		);
		await pressKeyTimes('ArrowDown', '3');

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('-100');
	});
});
