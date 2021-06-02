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
			'.maxi-entrance-animation-control .maxi-base-control__field select'
		);
		await animationType.select('bounce');
		// este select supongo
		const animationExpect = 'bounce';
		const animationAttributes = await getBlockAttributes();

		expect(animationAttributes['entrance-type']).toStrictEqual(
			animationExpect
		);
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
// consola 👍
