/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes, openSidebar } from '../../utils';

describe('parallax control', () => {
	it('test the parallax control', async () => {
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
			'.maxi-parallax-control .components-base-control.components-range-control input',
			click => click[1].focus()
		);
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('7');

		const groupAttribute = await getBlockAttributes();
		const parallaxSpeed = groupAttribute['parallax-speed'];
		const expectSpeed = 7;
		expect(parallaxSpeed).toStrictEqual(expectSpeed);
	});
});
