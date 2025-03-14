/**
 * WordPress dependencies
 */
import { createNewPost, getEditedPostContent } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	modalMock,
	openSidebarTab,
	getAttributes,
	changeResponsive,
	editAdvancedNumberControl,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Svg stroke width control', () => {
	it('Check svg stroke width control', async () => {
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

		await openSidebarTab(page, 'style', 'icon line width');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-advanced-number-control'),
			newNumber: '3',
		});

		expect(await getAttributes('svg-stroke-xl')).toStrictEqual(3);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
	});
	it('Check responsive svg stroke width control', async () => {
		await changeResponsive(page, 's');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'icon line width'
		);

		const baseStrokeValue = await accordionPanel.$eval(
			'.maxi-advanced-number-control input',
			input => input.placeholder
		);
		expect(baseStrokeValue).toStrictEqual('3');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-advanced-number-control'),
			newNumber: '1',
		});

		await changeResponsive(page, 'xs');

		const sStrokeValue = await accordionPanel.$eval(
			'.maxi-advanced-number-control input',
			input => input.placeholder
		);
		expect(sStrokeValue).toStrictEqual('1');

		await changeResponsive(page, 'm');

		const mStrokeValue = await accordionPanel.$eval(
			'.maxi-advanced-number-control input',
			input => input.placeholder
		);
		expect(mStrokeValue).toStrictEqual('3');
	});
});
