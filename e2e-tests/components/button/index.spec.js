/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	getAttributes,
	insertMaxiBlock,
} from '../../utils';

describe('Button', () => {
	it('Check button', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await openSidebarTab(page, 'style', 'alignment');

		await page.$$eval('.maxi-alignment-control button', click =>
			click[1].click()
		);

		expect(await getAttributes('_ta-g')).toStrictEqual('center');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
