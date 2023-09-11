/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('BaseControl', () => {
	it('Check base control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		// check base control label
		const expectLabel = await accordionPanel.$eval(
			'.maxi-base-control.maxi-color-control__palette-label',
			select => select.outerHTML
		);

		expect(expectLabel).toMatchSnapshot();
	});
});
