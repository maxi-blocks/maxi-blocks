/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openCanvasSidebar,
	changeResponsive,
} from '../../utils';

describe('OverflowControl', () => {
	it('Checking the overflow control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openCanvasSidebar(page, 'overflow');
		debugger;
		const selector = await page.$$('.maxi-overflow-control select');

		await selector[0].select('hidden');

		const attributes = await getBlockAttributes();
		const generalOverflow = attributes['overflow-x-general'];

		expect(generalOverflow).toStrictEqual('hidden');
		await page.waitForTimeout(250);
		await selector[1].select('clip');

		const generalAttributes = await getBlockAttributes();
		const generalYOverflow = generalAttributes['overflow-y-general'];

		expect(generalYOverflow).toStrictEqual('clip');
	});

	/* it('Checking the overflow responsive', async () => {
		await changeResponsive(page, 's');

		const responsiveSOverflowX = await page.$$eval(
			'.maxi-overflow-control select',
			selectorS => selectorS[0].value
		);

		expect(responsiveSOverflowX).toStrictEqual('hidden');

		// change overflow
		const selector = await page.$$('.maxi-overflow-control select');

		await selector[0].select('clip');

		const sAttributes = await getBlockAttributes();
		const sYOverflow = sAttributes['overflow-x-s'];

		expect(sYOverflow).toStrictEqual('clip');

		// responsive xs
		await changeResponsive(page, 'xs');
		const responsiveXsOverflowX = await page.$$eval(
			'.maxi-overflow-control select',
			selectorXs => selectorXs[0].value
		);

		expect(responsiveXsOverflowX).toStrictEqual('clip');

		// responsive m
		await changeResponsive(page, 'm');

		const responsiveMOverflowX = await page.$$eval(
			'.maxi-overflow-control select',
			selectorM => selectorM[0].value
		);

		expect(responsiveMOverflowX).toStrictEqual('hidden');
	}); */
});
