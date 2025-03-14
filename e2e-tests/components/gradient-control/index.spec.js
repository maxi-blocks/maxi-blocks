/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('GradientControl', () => {
	it('Check gradient in button background', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);
		await openSidebarTab(page, 'style', 'button background');

		await page.$eval(
			'.maxi-settingstab-control .maxi-background-control__simple .maxi-tabs-control__full-width .maxi-tabs-control__button-gradient',
			button => button.click()
		);

		await page.$eval(
			'.maxi-gradient-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('50', { delay: 350 });

		const selector = await page.$(
			'.maxi-gradient-control .components-custom-gradient-picker select'
		);

		await selector.select('radial-gradient');

		expect(
			await getAttributes('button-background-gradient-xl')
		).toStrictEqual(
			'radial-gradient(rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)'
		);

		expect(
			await getAttributes('button-background-active-media-xl')
		).toStrictEqual('gradient');
	});
});
