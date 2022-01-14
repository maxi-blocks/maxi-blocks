/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import openSidebarTab from './openSidebarTab';
import changeResponsive from './changeResponsive';
import getAttributes from './getAttributes';

const addResponsiveTest = async ({
	page,
	instance,
	selectInstance,
	baseExpect,
	xsExpect,
	newValue,
	needFocus,
	needSelectIndex,
	expectType,
	needAriaPressed,
	ariaClick,
	ariaSelect,
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
		const testing = await page.$eval(
			'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select',
			selector => selector.value
		);

		const testInstance = instance;

		/** baseExpect, instance, selectInstance, newValue, xsExpect */
		// base responsive
		await page.waitForSelector(instance);

		// const checkBaseResponsive = await page.$eval(
		// 	testInstance,
		// 	selector => selector.selectedOptions[0].value
		// );

		const CheckBaseSelect = await page.$eval(
			instance,
			selector => selector.selectedOptions[0].value
		);

		const lastTest = await page.$eval(instance, selector => selector.value);

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

		if (checkXsSelect !== xsExpect) return false;

		// change responsive m
		await changeResponsive(page, 'm');
		const checkMSelect = await page.$eval(
			instance,
			selector => selector.selectedOptions[0].value
		);

		if (checkMSelect !== baseExpect) return false;

		return true;
	}

	/* if (needDataItem) {
		await openSidebarTab(page, 'style', 'typography');

		// base responsive
		const checkBaseResponsive = await page.$eval(`${instance}`, button =>
			button.selectedOptions.getAttribute('data-item')
		);

		const test1 = checkBaseResponsive === baseExpect;

		// change responsive s
		await changeResponsive(page, 's');

		await page.$eval(`${instance}`, changeValue => changeValue.click());

		const changeSSelect = await page.$(`${selectInstance}`);

		await changeSSelect.select(`${newValue}`);

		// change responsive xs
		await changeResponsive(page, 'xs');

		const checkXsResponsive = await page.$eval(`${instance}`, button =>
			button.selectedOptions.getAttribute('data-item')
		);

		const test2 = checkXsResponsive === xsExpect;

		// change responsive m
		await changeResponsive(page, 'm');
		const checkMResponsive = await page.$eval(`${instance}`, button =>
			button.selectedOptions.getAttribute('data-item')
		);

		const test3 = checkMResponsive === baseExpect;
	}

	if (needAriaPressed) {
		await openSidebarTab(page, 'style', 'typography');

		// base responsive
		const checkBaseResponsive = await page.$$eval(
			`${instance}`,
			select => select[ariaBaseSelect].ariaPressed
		);

		const test1 = checkBaseResponsive === baseExpect;

		// change responsive s
		await changeResponsive(page, 's');
		await accordionPanel.$$eval('.maxi-alignment-control button', button =>
			button[1].click()
		);

		const responsiveSOption = await page.$$eval(
			'.maxi-alignment-control button',
			select => select[1].ariaPressed
		);

		expect(responsiveSOption).toBe('true');

		expect(await getAttributes('text-alignment-s')).toStrictEqual('center');

		// change responsive s
		await changeResponsive(page, 's');

		await page.$$eval(`${instance}`, changeValue =>
			changeValue[ariaClick].click()
		);

		// change responsive xs
		await changeResponsive(page, 'xs');

		const checkXsResponsive = await page.$$eval(
			`${instance}`,
			select => select[ariaXsSelect].ariaPressed
		);

		const test2 = checkXsResponsive === xsExpect;

		// change responsive m
		await changeResponsive(page, 'm');
		const checkMResponsive = await page.$$eval(
			`${instance}`,
			select => select[ariaBaseSelect].ariaPressed
		);

		const test3 = checkMResponsive === baseExpect;
	} */
};

/** 	it('test', async () => {
  await addResponsiveTest({
  page,
  instance: '.maxi-opacity-control .maxi-base-control__field input'
  typeExpect, = value, InnerHTML, placeholder, getAttribute('data-item')
  baseExpect: ej.'45'
  xsExpect: ej.'64'
  newValue, (newXsValue)ej.64
  needFocus, (TRUE or false)
  needSelect, (TRUE or false)
  newSelect,  ()
  });
  }); 
 */

export default addResponsiveTest;
