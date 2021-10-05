/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openAdvancedSidebar,
	changeResponsive,
} from '../../utils';

describe('OverflowControl', () => {
	it('Checking the overflow control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openAdvancedSidebar(page, 'overflow');

		const selector = await page.$$('.maxi-position-control select');

		await selector[1].select('hidden');

		const attributes = await getBlockAttributes();
		const generalOverflow = attributes['overflow-x-general'];

		expect(generalOverflow).toStrictEqual('hidden');

		await selector[2].select('clip');

		const generalAttributes = await getBlockAttributes();
		const generalYOverflow = generalAttributes['overflow-y-general'];

		expect(generalYOverflow).toStrictEqual('clip');
	});

	it('Checking the overflow responsive', async () => {
		await changeResponsive(page, 's');

		const responsiveSOverflowX = await page.$$eval(
			'.maxi-position-control select',
			selectorS => selectorS[1].value
		);

		expect(responsiveSOverflowX).toStrictEqual('hidden');

		// change overflow
		const selector = await page.$$('.maxi-position-control select');

		await selector[1].select('clip');

		const sAttributes = await getBlockAttributes();
		const sYOverflow = sAttributes['overflow-x-s'];

		expect(sYOverflow).toStrictEqual('clip');

		// responsive xs
		await changeResponsive(page, 's');
		const responsiveXsOverflowX = await page.$$eval(
			'.maxi-position-control select',
			selectorXs => selectorXs[1].value
		);

		expect(responsiveXsOverflowX).toStrictEqual('clip');

		// responsive m
		await changeResponsive(page, 'm');

		const responsiveMOverflowX = await page.$$eval(
			'.maxi-position-control select',
			selectorM => selectorM[1].value
		);

		expect(responsiveMOverflowX).toStrictEqual('hidden');
	});
});
