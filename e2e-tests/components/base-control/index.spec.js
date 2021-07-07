/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebar } from '../../utils';

describe('BaseControl', () => {
	it('Check base control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		// check base control label
		const expectLabel = await accordionPanel.$eval(
			'.maxi-fancy-radio-control .maxi-base-control',
			select => select.innerHTML
		);

		expect(expectLabel).toMatchSnapshot();
	});
});
