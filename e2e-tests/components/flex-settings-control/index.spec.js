/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getBlockStyle,
	editAdvancedNumberControl,
	getAttributes,
} from '../../utils';

describe('FlexSettings', () => {
	it('Checking the flex options', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebarTab(page, 'advanced', 'flex');

		const wrapSelector = await accordionPanel.$('.maxi-flex__wrap select');
		await wrapSelector.select('wrap');

		const directionSelector = await accordionPanel.$(
			'.maxi-flex__direction select'
		);
		await directionSelector.select('row');

		const justifyContentSelector = await accordionPanel.$(
			'.maxi-flex__justify-content select'
		);
		await justifyContentSelector.select('flex-end');

		const alignItemSelector = await accordionPanel.$(
			'.maxi-flex__align-items select'
		);
		await alignItemSelector.select('flex-end');

		const alignContentSelector = await accordionPanel.$(
			'.maxi-flex__align-content select'
		);
		await alignContentSelector.select('flex-start');

		const flowSelector = await accordionPanel.$('.maxi-flex__flow select');
		await flowSelector.select('wrap');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__row-gap'),
			newNumber: '55',
			newValue: 'vw',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__column-gap'),
			newNumber: '77',
			newValue: 'em',
		});

		// expect
		const attributeParent = await getAttributes([
			'flex-direction-general',
			'flex-flow-general',
			'flex-wrap-general',
			'justify-content-general',
			'align-content-general',
			'align-items-general',
			'column-gap-general',
			'column-gap-unit-general',
			'row-gap-general',
			'row-gap-unit-general',
		]);

		const expectedParentAttribute = {
			'flex-direction-general': 'row',
			'flex-flow-general': 'wrap',
			'flex-wrap-general': 'wrap',
			'justify-content-general': 'flex-end',
			'align-content-general': 'flex-start',
			'align-items-general': 'flex-end',
			'column-gap-general': 77,
			'column-gap-unit-general': 'em',
			'row-gap-general': 55,
			'row-gap-unit-general': 'vw',
		};
		expect(attributeParent).toStrictEqual(expectedParentAttribute);

		// check warning box
		await accordionPanel.$$eval(
			'.maxi-settingstab-control_has-border-left-right button',
			button => button[1].click()
		);

		const warningBox = await accordionPanel.$eval(
			'.maxi-warning-box',
			content => content.innerHTML
		);
		expect(warningBox).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();

		// flex-child
		await page.$$eval('.block-editor-inserter button', addBlock =>
			addBlock[1].click()
		);

		await page.keyboard.type('Text Maxi');

		await page.$eval(
			'.block-editor-inserter__panel-content .block-editor-block-types-list__list-item button',
			button => button.click()
		);

		await accordionPanel.$$eval(
			'.maxi-settingstab-control_has-border-left-right button',
			button => button[1].click()
		);
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__order'),
			newNumber: '4',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__flex-grow'),
			newNumber: '10',
		});

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-typography-control__flex-shrink'),
			newNumber: '6',
		});
		await page.waitForTimeout(100);

		const flexBasisSelector = await page.$(
			'.maxi-typography-control__flex-basis select'
		);
		await page.waitForTimeout(100);

		await flexBasisSelector.select('max-content');

		// expect
		const attributeResult = await getAttributes([
			'flex-basis-general',
			'flex-grow-general',
			'flex-shrink-general',
			'order-general',
		]);

		const expectedAttributes = {
			'flex-basis-general': 'max-content',
			'flex-grow-general': 10,
			'flex-shrink-general': 6,
			'order-general': 4,
		};

		expect(attributeResult).toStrictEqual(expectedAttributes);

		// expect custom flex-basis
		const flexBasisCustomSelector = await page.$(
			'.maxi-typography-control__flex-basis select'
		);
		await flexBasisCustomSelector.select('custom');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-typography-control__custom-flex-basis'
			),
			newNumber: '33',
			newValue: '%',
		});

		expect(await getAttributes('flex-basis-general')).toStrictEqual('33');
		expect(await getAttributes('flex-basis-unit-general')).toStrictEqual(
			'%'
		);

		// warning box
		const warningBoxFlex = await accordionPanel.$eval(
			'.maxi-warning-box',
			content => content.innerHTML
		);
		expect(warningBoxFlex).toMatchSnapshot();
	});
});
