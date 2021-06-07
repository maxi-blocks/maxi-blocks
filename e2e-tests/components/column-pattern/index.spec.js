/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openSidebar } from '../../utils';

describe('arrow control', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('test column pattern', async () => {
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);
		const accordionPanel = await openSidebar(page, 'row settings');

		// Show arrow settings
		await accordionPanel.$eval(
			'.components-column-pattern .maxi-base-control.maxi-size-control input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('8');

		await accordionPanel.$eval(
			'.components-column-pattern .components-column-pattern__templates button',
			click => click.click()
		);

		const attributes = await getBlockAttributes();
		const rowNumber = attributes['row-pattern-general'];
		const expectValue = '8 columns';
		expect(rowNumber).toStrictEqual(expectValue);

		// remove gap
		await accordionPanel.$$eval(
			'.components-column-pattern .components-column-pattern__gap label',
			click => click[1].click()
		);

		const attribute = await getBlockAttributes();
		const removeGap = attribute.removeColumnGap;
		const expectDisplay = true;
		expect(removeGap).toStrictEqual(expectDisplay);
	});
});
