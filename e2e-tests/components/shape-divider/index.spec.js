/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, openSidebarTab } from '../../utils';

describe('Shape divider', () => {
	it('Checking the shape divider', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', select => select.focus());
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'shape divider'
		);

		// top shape divider
		await accordionPanel.$eval(
			'.maxi-shape-divider-control .maxi-toggle-switch.shape-divider-top-status .maxi-base-control__label',
			click => click.click()
		);

		await page.$eval(
			'.maxi-shape-divider-control__shape-selector button',
			button => button.click()
		);

		await page.waitForTimeout(300);

		// select shape
		await page.$eval(
			'.components-popover__content .maxi-shape-divider-control__shape-list .maxi-tabs-control__button-waves-top',
			button => button.click()
		);

		const expectAttributes = {
			'arrow-position-general': 50,
			'arrow-side-general': 'bottom',
			'arrow-status-general': false,
			'arrow-width-general': 80,
			'shape-divider-bottom-effects-status': false,
			'shape-divider-bottom-height-unit': 'px',
			'shape-divider-bottom-height': 100,
			'shape-divider-bottom-opacity': 1,
			'shape-divider-bottom-palette-color': 5,
			'shape-divider-bottom-palette-status': true,
			'shape-divider-bottom-status': false,
			'shape-divider-top-effects-status': false,
			'shape-divider-top-height': 100,
			'shape-divider-top-height-unit': 'px',
			'shape-divider-top-opacity': 1,
			'shape-divider-top-palette-color': 5,
			'shape-divider-top-palette-status': true,
			'shape-divider-top-shape-style': 'waves-top',
			'shape-divider-top-status': true,
		};
		const attributeResult = await getAttributes([
			'arrow-position-general',
			'arrow-side-general',
			'arrow-status-general',
			'arrow-width-general',
			'shape-divider-bottom-effects-status',
			'shape-divider-bottom-height-unit',
			'shape-divider-bottom-height',
			'shape-divider-bottom-opacity',
			'shape-divider-bottom-palette-color',
			'shape-divider-bottom-palette-status',
			'shape-divider-bottom-status',
			'shape-divider-top-effects-status',
			'shape-divider-top-height',
			'shape-divider-top-height-unit',
			'shape-divider-top-opacity',
			'shape-divider-top-palette-color',
			'shape-divider-top-palette-status',
			'shape-divider-top-shape-style',
			'shape-divider-top-status',
		]);

		expect(attributeResult).toStrictEqual(expectAttributes);
		expect(await getAttributes('background-layers')).toMatchSnapshot();

		// bottom shape
		await accordionPanel.$eval(
			'.maxi-shape-divider-control .maxi-tabs-control .maxi-tabs-control__button-Bottom',
			click => click.click()
		);

		await page.$eval(
			'.maxi-shape-divider-control .maxi-tabs-content .shape-divider-bottom-status input',
			button => button.click()
		);

		await page.$eval(
			'.maxi-shape-divider-control__shape-selector button',
			button => button.click()
		);

		await page.waitForTimeout(300);

		// select shape
		await page.$eval(
			'.components-popover__content .maxi-shape-divider-control__shape-list .maxi-tabs-control__button-waves-bottom',
			button => button.click()
		);
		expect(
			await getAttributes('shape-divider-bottom-shape-style')
		).toStrictEqual('waves-bottom');
	});
});
