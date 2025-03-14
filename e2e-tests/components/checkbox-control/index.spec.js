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
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('CheckBoxControl', () => {
	it('checking the checkbox control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'height width'
		);

		// use checkbox
		await accordionPanel.$eval(
			'.maxi-full-size-control .maxi-full-width-toggle .maxi-toggle-switch__toggle input',
			checkBox => checkBox.click()
		);

		// use checkbox
		await page.$eval(
			'.maxi-full-size-control .maxi-full-size-control__force-aspect-ratio input',
			checkBox => checkBox.click()
		);

		expect(await getAttributes('full-width-xl')).toStrictEqual(true);
		expect(await getAttributes('force-aspect-ratio-xl')).toStrictEqual(
			true
		);
	});
});
