/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	addResponsiveTest,
	getBlockStyle,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('TransformControl', () => {
	it('Check transform control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Image Maxi');
		await updateAllBlockUniqueIds(page);
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'transform'
		);

		const buttons = await accordionPanel.$$(
			'.maxi-transform-control .maxi-settingstab-control button'
		);
		const targetSelect = await accordionPanel.$(
			'.maxi-transform-control .maxi-transform-control__target-select .maxi-base-control__field select'
		);

		await targetSelect.select('canvas');

		// Scale
		// Y
		await accordionPanel.waitForSelector(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input'
		);
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);
		await page.waitForTimeout(100);

		await page.keyboard.type('55', { delay: 100 });

		// X
		await accordionPanel.waitForSelector(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input'
		);
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);
		await page.waitForTimeout(100);

		await page.keyboard.type('44', { delay: 100 });

		expect(await getAttributes('transform-scale-xl')).toMatchSnapshot();

		// translate
		await buttons[1].click();

		// Y
		await accordionPanel.waitForSelector(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input'
		);
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);
		await page.waitForTimeout(100);
		await page.keyboard.type('55', { delay: 100 });

		const selectYUnit = await accordionPanel.$(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value select'
		);
		await selectYUnit.select('px');

		// X
		await accordionPanel.waitForSelector(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input'
		);
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);
		await page.waitForTimeout(100);
		await page.keyboard.type('66', { delay: 100 });

		const selectXUnit = await accordionPanel.$(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value select'
		);
		await selectXUnit.select('px');

		expect(await getAttributes('transform-translate-xl')).toMatchSnapshot();

		// Rotate
		await buttons[2].click();
		const rotateInputs = await accordionPanel.$$(
			'.maxi-transform-control__rotate-control .maxi-transform-control__rotate-control__item__input'
		);

		// X
		await rotateInputs[0].focus();
		await page.keyboard.type('150', { delay: 100 });

		// Y
		await rotateInputs[1].focus();
		await page.keyboard.type('200', { delay: 100 });

		// Z
		await rotateInputs[2].focus();
		await page.keyboard.type('100', { delay: 100 });

		expect(await getAttributes('transform-rotate-xl')).toMatchSnapshot();

		// Origin
		await buttons[3].click();
		// Y
		await accordionPanel.waitForSelector(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input'
		);
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);
		await page.waitForTimeout(100);

		await page.keyboard.type('81', { delay: 100 });

		// X
		await accordionPanel.waitForSelector(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input'
		);
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);
		await page.waitForTimeout(100);

		await page.keyboard.type('21', { delay: 100 });

		expect(await getAttributes('transform-origin-xl')).toMatchSnapshot();
	});

	it('Should check responsive', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'transform'
		);

		const buttons = await accordionPanel.$$(
			'.maxi-transform-control .maxi-settingstab-control button'
		);

		// check responsive scale
		await buttons[0].click();

		const responsiveResult = await addResponsiveTest({
			page,
			instance:
				'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			needFocus: true,
			baseExpect: '55',
			xsExpect: '57',
			newValue: '57',
		});

		expect(responsiveResult).toBeTruthy();

		// check responsive translate
		await accordionPanel.$$eval(
			'.maxi-transform-control .maxi-settingstab-control button',
			buttons => buttons[1].click()
		);

		const responsiveResultTranslate = await addResponsiveTest({
			page,
			instance:
				'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			needFocus: true,
			baseExpect: '55',
			xsExpect: '57',
			newValue: '57',
		});

		expect(responsiveResultTranslate).toBeTruthy();

		// check responsive rotate
		await accordionPanel.$$eval(
			'.maxi-transform-control .maxi-settingstab-control button',
			buttons => buttons[2].click()
		);

		const responsiveResultRotate = await addResponsiveTest({
			page,
			instance:
				'.maxi-transform-control .maxi-transform-control__rotate-control__item__input',
			needFocus: true,
			baseExpect: '150',
			xsExpect: '15',
			newValue: '15',
		});

		expect(responsiveResultRotate).toBeTruthy();

		// check responsive origin
		await accordionPanel.$$eval(
			'.maxi-transform-control .maxi-settingstab-control button',
			buttons => buttons[3].click()
		);

		const responsiveResultOrigin = await addResponsiveTest({
			page,
			instance:
				'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			needFocus: true,
			baseExpect: '81',
			xsExpect: '88',
			newValue: '88',
		});

		expect(responsiveResultOrigin).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
