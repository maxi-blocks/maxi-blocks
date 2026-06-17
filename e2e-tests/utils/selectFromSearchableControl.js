/**
 * Selects an option from a MaxiBlocks SearchableSelectControl.
 *
 * The control renders a button trigger plus a popover listbox instead of a
 * native `<select>`, so tests open the trigger and click the option whose
 * `data-value` matches.
 *
 * @param {Page}   page              - Puppeteer page
 * @param {string} containerSelector - Selector scoping the control (e.g. '.maxi-dc-type')
 * @param {string} value             - The option value to select
 */
const selectFromSearchableControl = async (page, containerSelector, value) => {
	const triggerSelector = `${containerSelector} .maxi-searchable-select-control__trigger`;
	await page.waitForSelector(triggerSelector);
	await page.$eval(triggerSelector, button => button.click());

	const optionSelector = `${containerSelector} .maxi-searchable-select-control__option[data-value="${value}"]`;
	await page.waitForSelector(optionSelector);
	await page.$eval(optionSelector, option => option.click());
};

export default selectFromSearchableControl;
