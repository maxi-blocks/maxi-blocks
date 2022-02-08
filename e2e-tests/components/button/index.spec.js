/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, getBlockStyle, getAttributes } from '../../utils';

describe('Button', () => {
	it('Check button', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openSidebarTab(page, 'style', 'alignment');

		await page.$$eval('.maxi-alignment-control button', click =>
			click[1].click()
		);

		expect(await getAttributes('text-alignment-general')).toStrictEqual(
			'center'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
