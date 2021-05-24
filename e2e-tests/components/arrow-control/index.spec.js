/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

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
		const showArrow = await accordionPanel.$$eval(
			'.maxi-accordion-control__item__panel .maxi-arrow-control .components-base-control__field label',
			button => button[0].click()
		);
		// Click on arrow position
		const positionWrapper = showArrow.$$('.maxi-fancy-radio-control input');

		debugger;

		const values = ['top', 'bottom', 'right', 'left'];

		for (let i = 0; i < positionWrapper.length; i++) {
			const setting = positionWrapper[i];

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
