/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * WordPress dependencies
 */
import {
	getBlockAttributes,
	openSidebar,
	openAdvancedSidebar,
} from '../../utils';

describe('Settings Tabs Control', () => {
	it('Checking the settings tabs control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const stylePanel = await openSidebar(page, 'alignment');
		await stylePanel.$$eval('.maxi-alignment-control label', button =>
			button[1].click()
		);

		const attributes = await getBlockAttributes();
		const expectSelector = attributes['text-alignment-general'];
		const expectAttributes = 'center';
		expect(expectSelector).toStrictEqual(expectAttributes);

		const advanced = await openAdvancedSidebar(page, 'display');
		await advanced.$$eval('.maxi-display-control label', button =>
			button[2].click()
		);

		const attribute = await getBlockAttributes();
		const expectDisplay = attribute['display-general'];
		const expectSelection = 'none';
		expect(expectDisplay).toStrictEqual(expectSelection);
	});
});
