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
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('SC Divider', () => {
	it('Checking divider accordion', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');
		await updateAllBlockUniqueIds(page);

		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'divider',
		});
		await copySCToEdit(page, `copy - ${Date.now()}`);

		await editGlobalStyles({
			page,
			block: 'divider',
		});

		expect(await checkSCResult(page)).toMatchSnapshot();
	});
});
