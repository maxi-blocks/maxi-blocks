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
import { getBlockAttributes, openSidebar } from '../../utils';

describe('BoxShadowControl', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
	});
	it('Checking the boxShadow control', async () => {
		const accordionPanel = await openSidebar(page, 'box shadow');

		await accordionPanel.$$eval('.maxi-shadow-control button', click =>
			click[1].click()
		);

		const expectAttributes = {
			'box-shadow-blur-general': 87,
			'box-shadow-color-general': undefined,
			'box-shadow-horizontal-general': 0,
			'box-shadow-spread-general': 0,
			'box-shadow-status-hover': false,
			'box-shadow-vertical-general': 30,
		};

		const attributes = await getBlockAttributes();

		const typographyAttributes = (({
			'box-shadow-blur-general': boxShadowBlur,
			'box-shadow-color-general': boxShadowColor,
			'box-shadow-horizontal-general': boxShadowHorizontal,
			'box-shadow-spread-general': boxShadowSpread,
			'box-shadow-status-hover': boxShadowStatus,
			'box-shadow-vertical-general': boxShadowVertical,
		}) => ({
			'box-shadow-blur-general': boxShadowBlur,
			'box-shadow-color-general': boxShadowColor,
			'box-shadow-horizontal-general': boxShadowHorizontal,
			'box-shadow-spread-general': boxShadowSpread,
			'box-shadow-status-hover': boxShadowStatus,
			'box-shadow-vertical-general': boxShadowVertical,
		}))(attributes);

		expect(typographyAttributes).toStrictEqual(expectAttributes);

		// custom Horizontal, Vertical, Blur, Spread
		const inputs = await accordionPanel.$$(
			'.maxi-shadow-control .maxi-advanced-number-control input'
		);

		// Horizontal
		await inputs[2].focus();
		await pressKeyTimes('Backspace', 2);
		await page.keyboard.type('30');
		await page.keyboard.press('Enter');

		// Vertical
		await inputs[4].focus();
		await pressKeyTimes('Backspace', 2);
		await page.keyboard.type('40');
		await page.keyboard.press('Enter');

		// Blur
		await inputs[6].focus();
		await pressKeyTimes('Backspace', 2);
		await page.keyboard.type('10');
		await page.keyboard.press('Enter');

		// Spread
		await inputs[8].focus();
		await pressKeyTimes('Backspace', 2);
		await page.keyboard.type('60');
		await page.keyboard.press('Enter');

		const expectChanges = {
			'box-shadow-blur-general': 10,
			'box-shadow-horizontal-general': 30,
			'box-shadow-spread-general': 60,
			'box-shadow-vertical-general': 40,
		};

		const shadowAttributes = await getBlockAttributes();

		const boxShadow = (({
			'box-shadow-blur-general': boxShadowBlur,
			'box-shadow-horizontal-general': boxShadowHorizontal,
			'box-shadow-spread-general': boxShadowSpread,
			'box-shadow-vertical-general': boxShadowVertical,
		}) => ({
			'box-shadow-blur-general': boxShadowBlur,
			'box-shadow-horizontal-general': boxShadowHorizontal,
			'box-shadow-spread-general': boxShadowSpread,
			'box-shadow-vertical-general': boxShadowVertical,
		}))(shadowAttributes);

		expect(boxShadow).toStrictEqual(expectChanges);
	});

	it('Check hover values kept after setting normal border to none', async () => {
		const accordionPanel = await openSidebar(page, 'box shadow');
		await accordionPanel.$$eval('.maxi-shadow-control button', click =>
			click[1].click()
		);

		await accordionPanel.$$eval('.maxi-tabs-control__button', buttons =>
			buttons[1].click()
		);

		await page.$$eval(
			'.maxi-box-shadow-status-hover .maxi-radio-control__option',
			buttons => buttons[0].querySelector('label').click()
		);

		await accordionPanel.$$eval('.maxi-tabs-control__button', buttons =>
			buttons[0].click()
		);

		await accordionPanel.$$eval('.maxi-shadow-control button', click =>
			click[0].click()
		);

		const expectChanges = {
			'box-shadow-blur-general': undefined,
			'box-shadow-blur-general-hover': 87,
			'box-shadow-horizontal-general': undefined,
			'box-shadow-horizontal-general-hover': 0,
			'box-shadow-spread-general': undefined,
			'box-shadow-spread-general-hover': 0,
			'box-shadow-vertical-general': undefined,
			'box-shadow-vertical-general-hover': 30,
		};

		const shadowAttributes = await getBlockAttributes();

		const boxShadow = (({
			'box-shadow-blur-general': boxShadowBlur,
			'box-shadow-blur-general-hover': boxShadowBlurHover,
			'box-shadow-horizontal-general': boxShadowHorizontal,
			'box-shadow-horizontal-general-hover': boxShadowHorizontalHover,
			'box-shadow-spread-general': boxShadowSpread,
			'box-shadow-spread-general-hover': boxShadowSpreadHover,
			'box-shadow-vertical-general': boxShadowVertical,
			'box-shadow-vertical-general-hover': boxShadowVerticalHover,
		}) => ({
			'box-shadow-blur-general': boxShadowBlur,
			'box-shadow-blur-general-hover': boxShadowBlurHover,
			'box-shadow-horizontal-general': boxShadowHorizontal,
			'box-shadow-horizontal-general-hover': boxShadowHorizontalHover,
			'box-shadow-spread-general': boxShadowSpread,
			'box-shadow-spread-general-hover': boxShadowSpreadHover,
			'box-shadow-vertical-general': boxShadowVertical,
			'box-shadow-vertical-general-hover': boxShadowVerticalHover,
		}))(shadowAttributes);

		expect(boxShadow).toStrictEqual(expectChanges);
	});
});
