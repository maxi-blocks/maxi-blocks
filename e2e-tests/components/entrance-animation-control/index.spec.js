/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('animation control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the animation control', async () => {
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(
			page,
			'entrance animation'
		);

		const animationType = await accordionPanel.$(
			'.maxi-entrance-animation-control .components-select-control__input'
		);
		await animationType.select('bounce');

		const animationExpect = 'bounce';
		const animationAttributes = await getBlockAttributes();

		expect(animationAttributes['entrance-type']).toStrictEqual(
			animationExpect
		);
		// duration and delay
		const animationSettings = await accordionPanel.$$(
			'.maxi-entrance-animation-control .maxi-size-control input'
		);
		const duration = await animationSettings[0];
		const delay = await animationSettings[2];

		await duration.focus();
		await page.keyboard.press('1');

		await delay.focus();
		await page.keyboard.press('3');

		const expectedSettings = {
			'entrance-delay': 13,
			'entrance-duration': 11,
		};
		const animationSettingsAttributes = await getBlockAttributes();
		const pageSettings = (({
			'entrance-delay': entranceDelay,
			'entrance-duration': entranceDuration,
		}) => ({
			'entrance-delay': entranceDelay,
			'entrance-duration': entranceDuration,
		}))(animationSettingsAttributes);

		expect(pageSettings).toStrictEqual(expectedSettings);
	});
});
