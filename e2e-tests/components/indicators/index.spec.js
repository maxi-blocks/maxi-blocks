/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	editAxisControl,
	changeResponsive,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Indicators', () => {
	it('Checking the indicators', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		const axisControlInstancePadding = await accordionPanel.$(
			'.maxi-axis-control__padding .maxi-axis-control__content__item__padding'
		);

		const axisControlInstanceMargin = await accordionPanel.$(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
		);

		await editAxisControl({
			page,
			instance: axisControlInstancePadding,
			values: '12',
			unit: '%',
		});

		await editAxisControl({
			page,
			instance: axisControlInstanceMargin,
			values: '22',
			unit: '%',
		});

		const paddingTop = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--top',
			div => div.outerHTML
		);

		const paddingRight = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--right',
			div => div.outerHTML
		);

		const paddingBottom = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--bottom',
			div => div.outerHTML
		);

		const paddingLeft = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--left',
			div => div.outerHTML
		);

		expect(paddingTop).toMatchSnapshot();
		expect(paddingRight).toMatchSnapshot();
		expect(paddingBottom).toMatchSnapshot();
		expect(paddingLeft).toMatchSnapshot();

		const marginTop = await page.$eval(
			'.maxi-block-indicators__margin.maxi-block-indicator--top',
			div => div.outerHTML
		);

		const marginBottom = await page.$eval(
			'.maxi-block-indicators__margin.maxi-block-indicator--bottom',
			div => div.outerHTML
		);

		expect(marginTop).toMatchSnapshot();
		expect(marginBottom).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Checking the indicators responsive', async () => {
		// s responsive
		await changeResponsive(page, 's');

		const axisControlInstancePaddingS = await page.$(
			'.maxi-axis-control__padding .maxi-axis-control__content__item__padding'
		);

		const axisControlInstanceMarginS = await page.$(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
		);

		await editAxisControl({
			page,
			instance: axisControlInstancePaddingS,
			values: '6',
			unit: 'px',
		});

		await editAxisControl({
			page,
			instance: axisControlInstanceMarginS,
			values: '12',
			unit: 'px',
		});
		// xs responsive
		await changeResponsive(page, 'xs');

		const paddingTopXs = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--top',
			div => div.outerHTML
		);

		const paddingRightXs = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--right',
			div => div.outerHTML
		);

		const paddingBottomXs = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--bottom',
			div => div.outerHTML
		);

		const paddingLeftXs = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--left',
			div => div.outerHTML
		);

		expect(paddingTopXs).toMatchSnapshot();
		expect(paddingRightXs).toMatchSnapshot();
		expect(paddingBottomXs).toMatchSnapshot();
		expect(paddingLeftXs).toMatchSnapshot();

		const marginTopXs = await page.$eval(
			'.maxi-block-indicators__margin.maxi-block-indicator--top',
			div => div.outerHTML
		);

		const marginBottomXs = await page.$eval(
			'.maxi-block-indicators__margin.maxi-block-indicator--bottom',
			div => div.outerHTML
		);

		expect(marginTopXs).toMatchSnapshot();
		expect(marginBottomXs).toMatchSnapshot();

		// m responsive
		await changeResponsive(page, 'm');

		const paddingTopM = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--top',
			div => div.outerHTML
		);

		const paddingRightM = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--right',
			div => div.outerHTML
		);

		const paddingBottomM = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--bottom',
			div => div.outerHTML
		);

		const paddingLeftM = await page.$eval(
			'.maxi-block-indicators__padding.maxi-block-indicator--left',
			div => div.outerHTML
		);

		expect(paddingTopM).toMatchSnapshot();
		expect(paddingRightM).toMatchSnapshot();
		expect(paddingBottomM).toMatchSnapshot();
		expect(paddingLeftM).toMatchSnapshot();

		const marginTopM = await page.$eval(
			'.maxi-block-indicators__margin.maxi-block-indicator--top',
			div => div.outerHTML
		);

		const marginBottomM = await page.$eval(
			'.maxi-block-indicators__margin.maxi-block-indicator--bottom',
			div => div.outerHTML
		);

		expect(marginTopM).toMatchSnapshot();
		expect(marginBottomM).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
