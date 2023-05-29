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
} from '../../utils';

describe('TransformControl', () => {
	it('Check transform control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Image Maxi');
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
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('55');

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('44');

		expect(await getAttributes('transform-scale-g')).toMatchSnapshot();

		// translate
		await buttons[1].click();

		// Y
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);
		await page.keyboard.type('55');

		const selectYUnit = await accordionPanel.$(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value select'
		);
		await selectYUnit.select('px');

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);
		await page.keyboard.type('66');

		const selectXUnit = await accordionPanel.$(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value select'
		);
		await selectXUnit.select('px');

		expect(await getAttributes('transform-translate-g')).toMatchSnapshot();

		// Rotate
		await buttons[2].click();
		const rotateInputs = await accordionPanel.$$(
			'.maxi-transform-control__rotate-control .maxi-transform-control__rotate-control__item__input'
		);

		// X
		await rotateInputs[0].focus();
		await page.keyboard.type('150');

		// Y
		await rotateInputs[1].focus();
		await page.keyboard.type('200');

		// Z
		await rotateInputs[2].focus();
		await page.keyboard.type('100');

		expect(await getAttributes('transform-rotate-g')).toMatchSnapshot();

		// Origin
		await buttons[3].click();
		// Y
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('80');

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('20');

		expect(await getAttributes('transform-origin-g')).toMatchSnapshot();

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
			baseExpect: '80',
			xsExpect: '88',
			newValue: '88',
		});

		expect(responsiveResultOrigin).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
