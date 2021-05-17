/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
// import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';
import { getBlockAttributes } from '../../utils';

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

		// Show arrow settings
		await accordionPanel.$eval(
			'.maxi-fancy-radio-control .components-radio-control__option input',
			button => button.click()
		);
		// Click on arrow position
		const positionWrapper = Array.from(
			await accordionPanel.$$('.maxi-fancy-radio-control')
		)[1];
		debugger;

		const valuesSettings = await positionWrapper.$$(
			'.components-radio-control__option'
		);

		const values = ['top', 'bottom', 'right', 'left'];

		for (let i = 0; i < valuesSettings.length; i++) {
			const setting = valuesSettings[i];

			await setting.click();

			const attributes = await getBlockAttributes();

			expect(attributes['arrow-side-general']).toStrictEqual(values[i]);
		}

		// Use Position dragAndResize
		const rangeControls = await accordionPanel.$$(
			'.components-base-control .components-range-control .components-range-control__slider'
		);

		await rangeInput.dragAndResize();

		for (let i = 0; i < rangeControls.length; i++) {
			const rangeInput = await rangeControls[i];

			const expectAttributes = {
				'arrow-position-general': 30,
				'arrow-width-general': 30,
			};

			/* await rangeInput.focus();
			await pressKeyTimes('Backspace', '2');
			await await page.keyboard.type('30'); */
			const attributes = await getBlockAttributes();

			Object.entries(expectedAttributes).forEach(([key, value]) => {
				expect(attributes[key].toString()).toBe(value);
			});
		}
	});
});
