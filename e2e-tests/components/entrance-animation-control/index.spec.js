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

describe('EntranceAnimationControl', () => {
	it('Checking the animation control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(
			page,
			'entrance animation'
		);

		const animationType = await accordionPanel.$(
			'.maxi-entrance-animation-control .maxi-base-control__field select'
		);

		await animationType.select('bounce');

		const animationAttributes = await getBlockAttributes();
		const entranceType = animationAttributes['entrance-type'];
		const animationExpect = 'bounce';

		expect(entranceType).toStrictEqual(animationExpect);

		// duration and delay
		const animationSettings = await accordionPanel.$$(
			'.maxi-base-control.maxi-size-control .maxi-base-control__field input'
		);

		const duration = await animationSettings[0];
		const delay = await animationSettings[2];

		await duration.focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.press('7');

		await delay.focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.press('5');

		const expectedSettings = {
			'entrance-delay': 5,
			'entrance-duration': 7,
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
