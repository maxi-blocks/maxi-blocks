/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getAttributes,
	changeResponsive,
	getBlockAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('OverflowControl', () => {
	it('Checking the overflow control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await openSidebarTab(page, 'advanced', 'overflow');

		const selectorX = await page.$$('.maxi-overflow-control select');

		await selectorX[0].select('hidden');

		expect(await getAttributes('overflow-x-xl')).toStrictEqual('hidden');

		const selectorY = await page.$$('.maxi-overflow-control select');
		await selectorY[1].select('auto');

		expect(await getAttributes('overflow-y-xl')).toStrictEqual('auto');
	});

	it('Checking the overflow responsive', async () => {
		await changeResponsive(page, 's');

		const responsiveSOverflowX = await page.$$eval(
			'.maxi-overflow-control select',
			selectorS => selectorS[0].value
		);

		expect(responsiveSOverflowX).toStrictEqual('auto');

		const responsiveSOverflowY = await page.$$eval(
			'.maxi-overflow-control select',
			selectorS => selectorS[1].value
		);

		expect(responsiveSOverflowY).toStrictEqual('auto');

		// change overflow X Y
		const selector = await page.$$('.maxi-overflow-control select');

		await selector[0].select('clip');

		const sAttributes = await getBlockAttributes();
		const sYOverflow = sAttributes['overflow-x-s'];

		expect(sYOverflow).toStrictEqual('clip');

		const selectorY = await page.$$('.maxi-overflow-control select');
		await selectorY[1].select('clip');

		expect(await getAttributes('overflow-y-s')).toStrictEqual('clip');

		// responsive xs
		await changeResponsive(page, 'xs');
		const responsiveXsOverflowX = await page.$$eval(
			'.maxi-overflow-control select',
			selectorXs => selectorXs[0].value
		);

		expect(responsiveXsOverflowX).toStrictEqual('clip');

		const responsiveXsOverflowY = await page.$$eval(
			'.maxi-overflow-control select',
			selectorS => selectorS[1].value
		);

		expect(responsiveXsOverflowY).toStrictEqual('clip');

		// responsive m
		await changeResponsive(page, 'm');

		const responsiveMOverflowX = await page.$$eval(
			'.maxi-overflow-control select',
			selectorM => selectorM[0].value
		);

		expect(responsiveMOverflowX).toStrictEqual('auto');

		const responsiveMOverflowY = await page.$$eval(
			'.maxi-overflow-control select',
			selectorS => selectorS[1].value
		);

		expect(responsiveMOverflowY).toStrictEqual('auto');
	});
});
