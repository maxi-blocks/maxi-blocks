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
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Button', () => {
	it('Check button', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await openSidebarTab(page, 'style', 'typography');

		await page.$$eval('.maxi-alignment-control button', click =>
			click[1].click()
		);

		expect(await getAttributes('text-alignment-general')).toStrictEqual(
			'center'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
