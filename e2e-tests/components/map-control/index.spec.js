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
import { openSidebarTab, getBlockStyle, getAttributes } from '../../utils';

console.error = jest.fn();

describe('MapControl', () => {
	it('Check map control', async () => {
		await createNewPost();
		await insertBlock('Map Maxi');
		const accordionPanel = await openSidebarTab(page, 'style', 'map');

		const inputs = await accordionPanel.$$(
			'.components-base-control .components-base-control__field input'
		);

		await inputs[0].focus();
		await pressKeyTimes('Backspace', '9');
		await page.keyboard.type('52.555');

		expect(await getAttributes('map-latitude')).toStrictEqual('52.555');

		await inputs[1].focus();
		await pressKeyTimes('Backspace', '9');
		await page.keyboard.type('13.444');

		expect(await getAttributes('map-longitude')).toStrictEqual('13.444');

		// zoom
		const zoom = await accordionPanel.$$(
			'.maxi-base-control.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await zoom[0].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('8');

		expect(await getAttributes('map-zoom')).toStrictEqual(8);

		// map icon
		await accordionPanel.$$eval(
			'.maxi-map-control__markers div',
			selectIcon => selectIcon[2].click()
		);

		expect(await getAttributes('map-marker')).toStrictEqual(3);

		// Marker Opacity
		const opacity = await accordionPanel.$('.maxi-opacity-control input');

		await opacity.focus();
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('50');

		expect(await getAttributes('map-marker-opacity')).toStrictEqual(0.5);

		// Marker Scale
		const scale = await accordionPanel.$$(
			'.maxi-base-control.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await scale[4].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('5');

		expect(await getAttributes('map-marker-scale')).toStrictEqual(5);

		// custom color
		await accordionPanel.$eval(
			'.maxi-map-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$eval('.maxi-color-control input', color =>
			color.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('081219');
		await page.keyboard.press('Enter');

		expect(await getAttributes('map-marker-stroke-color')).toStrictEqual(
			'#081219'
		);

		// Marker text
		const marker = await accordionPanel.$$(
			'.maxi-map-control__full-width-text input'
		);

		await marker[0].focus();
		await pressKeyTimes('Backspace', '5');
		await page.keyboard.type('test');

		expect(await getAttributes('map-marker-text')).toStrictEqual(
			'Marker test'
		);

		// Marker text color
		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-color-control__palette-box',
			color => color[4].click()
		);

		expect(
			await getAttributes('map-marker-text-palette-color')
		).toStrictEqual(5);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
