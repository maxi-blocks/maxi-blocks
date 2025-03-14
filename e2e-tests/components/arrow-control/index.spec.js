/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyTimes } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
	getAttributes,
	editAdvancedNumberControl,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('ArrowControl', () => {
	it('Check the arrow control', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);
		await page.$eval('.maxi-container-block', container =>
			container.focus()
		);

		// add arrow
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'callout arrow'
		);

		await accordionPanel.$eval(
			'.maxi-arrow-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		const values = ['top', 'bottom', 'right', 'left'];

		for (let i = 0; i < values.length; i += 1) {
			await page.$$eval(
				'.maxi-arrow-control .maxi-settingstab-control button',
				(buttons, i) => buttons[i].click(),
				i
			);
			const attributes = await getBlockAttributes();
			const arrowAttributeX = attributes['arrow-side-xl'];
			expect(arrowAttributeX).toStrictEqual(values[i]);
		}

		// Use Position
		const selectInput = await accordionPanel.$$(
			'.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-advanced-number-control .maxi-base-control__field'
			),
			newNumber: '59',
		});

		expect(await getAttributes('arrow-position-xl')).toStrictEqual(59);

		// Use Arrow Size
		await selectInput[2].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('120', { delay: 350 });

		expect(await getAttributes('arrow-width-xl')).toStrictEqual(120);
	});

	it('Check the responsive arrow control', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'callout arrow'
		);

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-settingstab-control button',
			openArrowControl => openArrowControl[0].click()
		);

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-settingstab-control button',
			select => select[3].click()
		);

		const isItemChecked = await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-settingstab-control button',
			select => select[3].ariaPressed
		);

		expect(isItemChecked).toBe('true');

		// responsive S
		await changeResponsive(page, 's');

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-settingstab-control button',
			select => select[2].click()
		);

		await page.waitForTimeout(100);
		const responsiveSOption = await page.$$eval(
			'.maxi-arrow-control .maxi-settingstab-control button',
			select => select[2].ariaPressed
		);

		expect(responsiveSOption).toBe('true');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-advanced-number-control .maxi-base-control__field'
			),
			newNumber: '33',
		});
		expect(await getAttributes('arrow-position-s')).toStrictEqual(33);

		expect(await getAttributes('arrow-side-s')).toStrictEqual('right');

		// responsive XS
		await changeResponsive(page, 'xs');
		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-settingstab-control button',
			select => select[3].click()
		);
		await page.waitForTimeout(100);
		const responsiveXsOption = await page.$$eval(
			'.maxi-arrow-control .maxi-settingstab-control button',
			select => select[3].ariaPressed
		);

		expect(responsiveXsOption).toBe('true');

		// arrow position
		const xsPosition = await page.$eval(
			'.maxi-advanced-number-control .maxi-base-control__field input',
			input => input.value
		);

		expect(xsPosition).toBe('33');

		// responsive M
		await changeResponsive(page, 'm');

		await accordionPanel.$$eval(
			'.maxi-arrow-control .maxi-settingstab-control button',
			select => select[2].click()
		);
		await page.waitForTimeout(100);
		const responsiveMOption = await page.$$eval(
			'.maxi-arrow-control .maxi-settingstab-control button',
			select => select[2].ariaPressed
		);

		expect(responsiveMOption).toBe('true');

		// arrow position
		const mPosition = await page.$eval(
			'.maxi-advanced-number-control .maxi-base-control__field input',
			input => input.value
		);

		expect(mPosition).toBe('59');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
