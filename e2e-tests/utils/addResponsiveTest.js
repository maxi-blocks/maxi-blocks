/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import changeResponsive from './changeResponsive';

const addResponsiveTest = async ({
	page,
	instance,
	selectInstance,
	baseExpect,
	xsExpect,
	newValue,
	needFocus,
	needSelectIndex,
}) => {
	if (needFocus) {
		// base responsive
		await page.$eval(`${instance}`, base => base.focus());

		const checkBaseResponsive = await page.$eval(
			`${instance}`,
			base => base.value
		);

		if (checkBaseResponsive !== baseExpect) return false;

		// change responsive s
		await changeResponsive(page, 's');

		await page.$eval(`${instance}`, changeValue => changeValue.focus());

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(`${newValue}`);

		// change responsive xs
		await changeResponsive(page, 'xs');

		await page.$eval(`${instance}`, xs => xs.focus());

		const checkXsResponsive = await page.$eval(
			`${instance}`,
			xs => xs.value
		);

		if (checkXsResponsive !== xsExpect) return false;

		// change responsive m
		await changeResponsive(page, 'm');
		await page.$eval(`${instance}`, m => m.focus());

		const checkMResponsive = await page.$eval(`${instance}`, m => m.value);

		if (checkMResponsive !== baseExpect) return false;

		return true;
	}

	if (needSelectIndex) {
		debugger;
		const CheckBaseSelect = await page.$eval(
			instance,
			selector => selector.selectedOptions[0].value
		);

		await page.$eval(instance, selector => selector.value);

		debugger;
		if (CheckBaseSelect !== baseExpect) return false;

		// change responsive s
		await changeResponsive(page, 's');

		const changeSSelect = await page.$(`${selectInstance}`);

		await changeSSelect.select(`${newValue}`);

		// change responsive xs
		await changeResponsive(page, 'xs');

		const checkXsSelect = await page.$eval(
			instance,
			selector => selector.selectedOptions[0].value
		);

		debugger;
		if (checkXsSelect !== xsExpect) return false;

		// change responsive m
		await changeResponsive(page, 'm');
		const checkMSelect = await page.$eval(
			instance,
			selector => selector.selectedOptions[0].value
		);

		debugger;
		if (checkMSelect !== baseExpect) return false;

		debugger;
		return true;
	}
};

export default addResponsiveTest;
