/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	setBrowserViewport,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

// describe('GradientControl', () => {
// Needs to be fixed with #1931
// it('Checking the gradient control', async () => {
// 	await createNewPost();
// 	await setBrowserViewport('large');
// 	await insertBlock('Group Maxi');
// 	const accordionPanel = await openSidebarTab(page, 'style', 'background');
// 	await accordionPanel.$$eval(
// 		'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
// 		select => select[4].click()
// 	);
// 	await page.$eval('.maxi-sidebar', sideBar =>
// 		sideBar.scrollTo(0, sideBar.scrollHeight)
// 	);
// 	const { x, y } = await page.$eval(
// 		'.maxi-background-control .maxi-gradient-control .maxi-gradient-control__gradient .components-custom-gradient-picker__markers-container',
// 		gradientBar => {
// 			const { x, y, width, height } =
// 				gradientBar.getBoundingClientRect();
// 			const xPos = x + width / 2;
// 			const yPos = y + height / 2;
// 			return { x: xPos, y: yPos };
// 		}
// 	);
// 	await page.mouse.click(x, y, { delay: 1000 });
// 	await page.waitForSelector(
// 		'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover'
// 	);
// 	const colorPickerPopover = await page.$(
// 		'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover'
// 	);
// 	await colorPickerPopover.$eval(
// 		'.components-color-picker__inputs-fields input',
// 		select => select.focus()
// 	);
// 	await pressKeyTimes('Backspace', '6');
// 	await page.keyboard.type('24a319');
// 	await page.keyboard.press('Enter');
// 	await page.waitForTimeout(500);
// 	const expectAttribute = await getBlockAttributes();
// 	const gradient = expectAttribute['background-gradient'];
// 	const expectGradient =
// 		'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(36,163,25) 46%,rgb(155,81,224) 100%)';
// 	expect(gradient).toStrictEqual(expectGradient);
// });
// });
