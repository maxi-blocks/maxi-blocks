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

	it('cheking the arrow control', async () => {
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);
		const accordionPanel = await openSidebar(page, 'arrow');

		await accordionPanel.$$eval('.maxi-arrow-control label', button =>
			button[1].click()
		);

		await accordionPanel.$eval(
			'.maxi-arrow-control .maxi-size-control input',
			button => button.focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('500');

		const Attributes = await getBlockAttributes();
		const arrowSize = Attributes['arrow-width-general'];
		const expectArrowSize = 500;
		expect(arrowSize).toStrictEqual(expectArrowSize);

		// reset button
		await accordionPanel.$eval(
			'.maxi-arrow-control .maxi-size-control button',
			button => button.click()
		);

		const defaultAttribute = await getBlockAttributes();
		const defaultArrowSize = defaultAttribute['arrow-width-general'];
		const expectDefaultArrowSize = 80;
		expect(defaultArrowSize).toStrictEqual(expectDefaultArrowSize);
	});
});
