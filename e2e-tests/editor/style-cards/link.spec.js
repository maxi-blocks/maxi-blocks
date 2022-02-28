/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';

import {
	getStyleCardEditor,
	editGlobalStyles,
	getBlockStyle,
} from '../../utils';

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

		await page.waitForTimeout(250);
		// Link Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'link',
		});
		await page.waitForTimeout(250);

		// hover Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'hover',
		});
		await page.waitForTimeout(250);

		// active Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'active',
		});
		await page.waitForTimeout(250);

		// visited Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'visited',
		});
		debugger;
		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
	/* it('Check link global styles', async () => {
		// Paragraph Colour
		await editGlobalStyles({
			page,
			block: 'link',
			type: 'link',
			paletteColor: '3',
		});
		await page.waitForTimeout(150);
		expect(await getBlockStyle(page)).toMatchSnapshot();
	}); */
});
