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
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('HoverEffectControl', () => {
	it('Checking the hover effect control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'hover effects');
		debugger;
		await accordionPanel.$$eval(
			'.maxi-hover-effect-control .maxi-fancy-radio-control .maxi-base-control__field label',
			click => click[2].click()
		);

		// duration
		await accordionPanel.$$eval(
			'.maxi-hover-effect-control .components-range-control .components-range-control__number input',
			click => click[0].focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.press('2');

		const attributes = await getBlockAttributes();
		const hoverPreview = attributes['hover-transition-duration'];
		const expectResult = 2;
		expect(hoverPreview).toStrictEqual(expectResult);

		// Amount
		await accordionPanel.$$eval(
			'.maxi-hover-effect-control .components-range-control .components-range-control__number input',
			click => click[1].focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.press('5');

		const hoverAttributes = await getBlockAttributes();
		const hoverAmount = hoverAttributes['hover-basic-zoom-in-value'];
		const expectAmount = 15;
		expect(hoverAmount).toStrictEqual(expectAmount);

		// Easing
		const easing = await accordionPanel.$$(
			'.maxi-accordion-control__item__panel .maxi-base-control select'
		);
		await easing[0].select('linear');

		const easingAttributes = await getBlockAttributes();
		const hoverEasing = easingAttributes['hover-transition-easing'];
		const expectEasing = 'linear';
		expect(hoverEasing).toStrictEqual(expectEasing);

		// Effect Type
		const effectType = await accordionPanel.$$(
			'.maxi-accordion-control__item__panel .maxi-base-control select'
		);
		await effectType[0].select('slide');

		const effectTypeAttributes = await getBlockAttributes();
		const hoverEffectType = effectTypeAttributes['hover-basic-effect-type'];
		const expectEffectType = 'slide';
		expect(hoverEffectType).toStrictEqual(expectEffectType);
	});
});
