/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	changeResponsive,
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
		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
			select => select.focus()
		);
		await page.keyboard.type('31');

		const maxAttributes = await getBlockAttributes();
		const maxAttribute = maxAttributes['letter-spacing-m'];
		const expectMaxNum = 30;

		expect(maxAttribute).toStrictEqual(expectMaxNum);

		// Min value
		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('-4');

		const minAttributes = await getBlockAttributes();
		const minAttribute = minAttributes['letter-spacing-m'];
		const expectMinNum = -3;

		expect(minAttribute).toStrictEqual(expectMinNum);

		// reset value
		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .maxi-advanced-number-control__value',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('10');

		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing .components-maxi-control__reset-button',
			click => click.click()
		);

		const resetAttributes = await getBlockAttributes();
		const resetAttribute = resetAttributes['letter-spacing-m'];
		const expectAuto = '';

		expect(resetAttribute).toStrictEqual(expectAuto);
	});
});
