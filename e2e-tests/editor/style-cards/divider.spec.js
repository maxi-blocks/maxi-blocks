/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setBrowserViewport,
	insertBlock,
} from '@wordpress/e2e-test-utils';

import {
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
} from '../../utils';

describe('SC Divider', () => {
	it('Checking divider accordion', async () => {
		await createNewPost();
		await insertBlock('Divider Maxi');
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'divider',
		});

		await editGlobalStyles({
			page,
			block: 'divider',
		});

		expect(await checkSCResult(page)).toMatchSnapshot();
	});
});
