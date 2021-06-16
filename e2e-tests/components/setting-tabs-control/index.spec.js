/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebar,
	openAdvancedSidebar,
} from '../../utils';

describe('SettingsTabsControl', () => {
	it('Checking the settings tabs control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const stylePanel = await openSidebar(page, 'alignment');
		const accordionItem = await stylePanel.$$(
			'.maxi-settingstab-control .maxi-accordion-control.is-secondary .maxi-accordion-control__item'
		);
		expect(accordionItem).toMatchSnapshot();

		/* const advanced = await openAdvancedSidebar(page, 'display');
		await advanced.$$eval('.maxi-display-control label', button =>
			button[2].click()
		);

		const attribute = await getBlockAttributes();
		const expectDisplay = attribute['display-general'];
		const expectSelection = 'none';
		expect(expectDisplay).toStrictEqual(expectSelection); */
	});
});
