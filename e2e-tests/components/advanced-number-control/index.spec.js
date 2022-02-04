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
			instance:
				'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
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
			instance:
				'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
			newNumber: '10',
		});

		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .components-maxi-control__reset-button',
			click => click.click()
		);

		expect(await getAttributes('letter-spacing-m')).toStrictEqual('');
	});
});
