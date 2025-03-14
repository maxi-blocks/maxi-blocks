/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	modalMock,
	openSidebarTab,
	getAttributes,
	addResponsiveTest,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Svg width control', () => {
	it('Check svg width control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Icon Maxi');
		await modalMock(page, { type: 'svg' });

		// Close model opened automatically by the block
		await page.waitForSelector(
			'.components-modal__content .components-modal__header button'
		);
		await page.$eval(
			'.components-modal__content .components-modal__header button',
			svg => svg.click()
		);

		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'height width'
		);

		// change width and unit

		await accordionPanel.$$eval(
			'.maxi-advanced-number-control input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('37', { delay: 350 });

		expect(await getAttributes('svg-width-xl')).toStrictEqual('37');

		const unitSelector = await accordionPanel.$(
			'.maxi-advanced-number-control select'
		);

		await unitSelector.select('%');

		expect(await getAttributes('svg-width-unit-xl')).toStrictEqual('%');

		const responsiveSelectResult = await addResponsiveTest({
			page,
			instance: '.maxi-advanced-number-control select',
			selectInstance: '.maxi-advanced-number-control select',
			needSelectIndex: true,
			baseExpect: '%',
			xsExpect: 'px',
			newValue: 'px',
		});

		expect(responsiveSelectResult).toBeTruthy();
	});
});
