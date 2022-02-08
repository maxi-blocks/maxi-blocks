/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

describe('BaseControl', () => {
	it('Check base control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		// check base control label
		const expectLabel = await accordionPanel.$eval(
			'.maxi-base-control',
			select => select.innerHTML
		);

		expect(expectLabel).toMatchSnapshot();
	});
});
