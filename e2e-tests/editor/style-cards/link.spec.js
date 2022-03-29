/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';

import {
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
} from '../../utils';

describe('SC Link', () => {
	it('Checking link accordion', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'link',
		});

		// Link Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'link',
		});

		// hover Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'hover',
		});

		// active Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'active',
		});

		// visited Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'visited',
		});

		expect(await checkSCResult(page)).toMatchSnapshot();
	});
});
