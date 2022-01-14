/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getAttributes, openSidebarTab, addResponsiveTest } from '../../utils';

describe('TransformControl', () => {
	it('Check transform control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'transform'
		);

		const buttons = await accordionPanel.$$(
			'.maxi-transform-control .maxi-button-group-control button'
		);

		// Scale
		// Y
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('55');

		expect(await getAttributes('transform-scale-y-general')).toStrictEqual(
			55
		);

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('44');

		expect(await getAttributes('transform-scale-x-general')).toStrictEqual(
			44
		);

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

		expect(
			await getAttributes('transform-translate-y-general')
		).toStrictEqual(55);

		expect(
			await getAttributes('transform-translate-y-unit-general')
		).toStrictEqual('px');

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

		expect(
			await getAttributes('transform-translate-x-general')
		).toStrictEqual(66);

		expect(
			await getAttributes('transform-translate-x-unit-general')
		).toStrictEqual('px');

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

		// expect
		const colorResult = await getAttributes([
			'transform-rotate-x-general',
			'transform-rotate-y-general',
			'transform-rotate-z-general',
		]);

		const expectedAttributes = {
			'transform-rotate-x-general': 150,
			'transform-rotate-y-general': 200,
			'transform-rotate-z-general': 100,
		};

		expect(colorResult).toStrictEqual(expectedAttributes);

		// Origin
		await buttons[3].click();
		// Y
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('80');

		expect(await getAttributes('transform-origin-y-general')).toStrictEqual(
			'80'
		);

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('20');

		expect(await getAttributes('transform-origin-x-general')).toStrictEqual(
			'20'
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
		await buttons[1].click();

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
		await buttons[2].click();

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
		await buttons[3].click();

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
	});
});
