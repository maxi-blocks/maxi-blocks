/**
 * Internal dependencies
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
	needFocusPlaceholder,
}) => {
	if (needFocus) {
		try {
			await page.locator(instance).first().waitFor({ state: 'visible' });
		} catch (err) {
			console.error(`No instance found. Error: ${err}`);
		}

		// base responsive
		const baseInput = page.locator(instance).first();
		const checkBaseResponsive = await baseInput.inputValue();

		if (checkBaseResponsive !== baseExpect) {
			console.error(
				'Error on `addResponsiveTest` for Base',
				checkBaseResponsive,
				baseExpect
			);
			return false;
		}

		// change responsive s
		await changeResponsive(page, 's');
		const sInput = page.locator(instance).first();
		await sInput.fill(newValue);

		// change responsive xs
		await changeResponsive(page, 'xs');
		const xsInput = page.locator(instance).first();
		const checkXsResponsive = await xsInput.inputValue();

		if (checkXsResponsive !== xsExpect) {
			console.error(
				'Error on `addResponsiveTest` for Xs',
				checkXsResponsive,
				xsExpect
			);
			return false;
		}

		// change responsive m
		await changeResponsive(page, 'm');
		const mInput = page.locator(instance).first();
		const checkMResponsive = await mInput.inputValue();

		if (checkMResponsive !== baseExpect) {
			console.error(
				'Error on `addResponsiveTest` for M',
				checkMResponsive,
				baseExpect
			);
			return false;
		}

		return true;
	}

	if (needFocusPlaceholder) {
		// base responsive
		const baseInput = page.locator(instance).first();
		const checkBaseResponsive = await baseInput.getAttribute('placeholder');

		if (checkBaseResponsive !== baseExpect) return false;

		// change responsive s
		await changeResponsive(page, 's');
		const sInput = page.locator(instance).first();
		await sInput.fill(newValue);

		// change responsive xs
		await changeResponsive(page, 'xs');
		const xsInput = page.locator(instance).first();
		const checkXsResponsive = await xsInput.getAttribute('placeholder');

		if (checkXsResponsive !== xsExpect) return false;

		// change responsive m
		await changeResponsive(page, 'm');
		const mInput = page.locator(instance).first();
		const checkMResponsive = await mInput.getAttribute('placeholder');

		if (checkMResponsive !== baseExpect) return false;

		return true;
	}

	if (needSelectIndex) {
		const baseSelect = page.locator(instance).first();
		const checkBaseSelect = await baseSelect.inputValue();

		if (checkBaseSelect !== baseExpect) return false;

		// change responsive s
		await changeResponsive(page, 's');
		const sSelect = page.locator(selectInstance).first();
		await sSelect.selectOption(newValue);

		// change responsive xs
		await changeResponsive(page, 'xs');
		const xsSelect = page.locator(instance).first();
		const checkXsSelect = await xsSelect.inputValue();

		if (checkXsSelect !== xsExpect) return false;

		// change responsive m
		await changeResponsive(page, 'm');
		const mSelect = page.locator(instance).first();
		const checkMSelect = await mSelect.inputValue();

		if (checkMSelect !== baseExpect) return false;

		return true;
	}

	return false;
};

export default addResponsiveTest;
