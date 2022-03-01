/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';

import { getStyleCardEditor, editGlobalStyles } from '../../utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};
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

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
