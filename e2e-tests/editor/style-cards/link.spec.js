/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
	copySCToEdit,
} from '../../utils';

describe('SC Link', () => {
	it('Checking link accordion', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'link',
		});
		await copySCToEdit(page, `copy - ${Date.now()}`);

		// Link Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'link',
			clickToActive: false,
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
