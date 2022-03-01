/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setBrowserViewport,
	insertBlock,
} from '@wordpress/e2e-test-utils';

import { getStyleCardEditor, editGlobalStyles } from '../../utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};
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

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
