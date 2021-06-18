/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Interactive dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('ParallaxControl', () => {
	it('Test the parallax control', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-base-control label',
			button => button[6].click()
		);

		// display parallax
		await accordionPanel.$$eval('.maxi-parallax-control label', click =>
			click[1].click()
		);

		const attributes = await getBlockAttributes();
		const parallaxStatus = attributes['parallax-status'];
		const expectStatus = true;
		expect(parallaxStatus).toStrictEqual(expectStatus);

		// direction
		await accordionPanel.$$eval('.maxi-parallax-control label', click =>
			click[5].click()
		);

		const groupAttributes = await getBlockAttributes();
		const parallaxDirection = groupAttributes['parallax-direction'];
		const expectDirection = 'down';
		expect(parallaxDirection).toStrictEqual(expectDirection);

		// speed
		await accordionPanel.$$eval(
			'.maxi-parallax-control .maxi-advanced-number-control input',
			click => click[1].focus()
		);
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('4');

		const groupAttribute = await getBlockAttributes();
		const parallaxSpeed = groupAttribute['parallax-speed'];
		const expectSpeed = 4;
		expect(parallaxSpeed).toStrictEqual(expectSpeed);
	});
});
