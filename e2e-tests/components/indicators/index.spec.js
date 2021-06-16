/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebar } from '../../utils';

describe('Indicators', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('Checking the indicators', async () => {
		await insertBlock('Container Maxi');

		const accordionPanel = await openSidebar(page, 'padding margin');

		await accordionPanel.$$eval(
			'.maxi-axis-control .maxi-axis-control__content__item__input',
			select => select[4].focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('50');

		const maxiIndicator = await page.$(
			'.maxi-indicators .maxi-indicators__padding--top'
		);
		expect(maxiIndicator).toMatchSnapshot();
	});
});
