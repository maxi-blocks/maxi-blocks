/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Interactive dependencies
 */
import {
	modalMock,
	openSidebarTab,
	getAttributes,
	changeResponsive,
	addResponsiveTest,
} from '../../utils';

describe('Svg width control', () => {
	it('Check svg width control', async () => {
		await createNewPost();
		await insertBlock('SVG Icon Maxi');
		await modalMock(page, { type: 'svg' });

		// Close model opened automatically by the block
		await page.waitForSelector(
			'.components-modal__content .maxi-cloud-container .ais-InfiniteHits-list .maxi-cloud-masonry-card__svg-container'
		);
		await page.$$eval(
			'.components-modal__content .maxi-cloud-container .ais-InfiniteHits-list .maxi-cloud-masonry-card__svg-container',
			svg => svg[0].click()
		);

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
		await page.keyboard.type('37');

		expect(await getAttributes('svg-width-general')).toStrictEqual(37);

		const unitSelector = await accordionPanel.$(
			'.maxi-advanced-number-control select'
		);

		await unitSelector.select('%');

		expect(await getAttributes('svg-width-unit-general')).toStrictEqual(
			'%'
		);

		// check responsive
		/* const responsiveResult = await addResponsiveTest({
			page,
			instance: '.maxi-advanced-number-control input',
			needFocus: true,
			baseExpect: '37',
			xsExpect: '12',
			newValue: '12',
		});

		expect(responsiveResult).toBeTruthy(); */

		const responsiveSelectResult = await addResponsiveTest({
			page,
			instance: '.maxi-advanced-number-control select',
			SelectInstance: '.maxi-advanced-number-control select',
			needSelectIndex: true,
			baseExpect: '%',
			xsExpect: 'px',
			newValue: 'px',
		});

		expect(responsiveSelectResult).toBeTruthy();
	});

	/* it('Check responsive svg width control', async () => {
		await changeResponsive(page, 's');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'height width'
		);

		// base values
		const baseWidthValue = await accordionPanel.$$eval(
			'.maxi-advanced-number-control input',
			input => input[1].value
		);
		expect(baseWidthValue).toStrictEqual('37');

		const baseWidthUnit = await accordionPanel.$eval(
			'.maxi-advanced-number-control select',
			input => input.value
		);
		expect(baseWidthUnit).toStrictEqual('%');

		// change S values
		await accordionPanel.$$eval(
			'.maxi-advanced-number-control input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('12');

		const unitSelector = await accordionPanel.$(
			'.maxi-advanced-number-control select'
		);

		await unitSelector.select('px');

		// check xs responsive
		await changeResponsive(page, 'xs');

		const sWidthValue = await accordionPanel.$$eval(
			'.maxi-advanced-number-control input',
			input => input[1].value
		);
		expect(sWidthValue).toStrictEqual('12');

		const sWidthUnit = await accordionPanel.$eval(
			'.maxi-advanced-number-control select',
			input => input.value
		);
		expect(sWidthUnit).toStrictEqual('px');

		// check m responsive
		await changeResponsive(page, 'm');

		const mWidthValue = await accordionPanel.$$eval(
			'.maxi-advanced-number-control input',
			input => input[1].value
		);
		expect(mWidthValue).toStrictEqual('37');

		const xsWidthUnit = await accordionPanel.$eval(
			'.maxi-advanced-number-control select',
			input => input.value
		);
		expect(xsWidthUnit).toStrictEqual('%');
	}); */
});
