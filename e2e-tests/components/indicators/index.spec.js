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
import { openSidebarTab } from '../../utils';

describe('Indicators', () => {
	it('Checking the indicators', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		const selectPadding = await accordionPanel.$$(
			'.maxi-axis-control .maxi-axis-control__content'
		);

		await selectPadding[1].$$eval(
			'.maxi-axis-control__content__item input',
			select => select[0].focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('50');

		const maxiIndicator = await page.$eval(
			'.maxi-container-block .maxi-indicators',
			indicators => indicators.innerHTML
		);

		expect(maxiIndicator).toMatchSnapshot();
	});
});
