/* eslint-disable no-await-in-loop */

/**
 * External dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';
import { isNaN, isArray } from 'lodash';

const editAxisControl = async ({
	page,
	instance,
	syncOption,
	values,
	unit,
	resetAllBefore = false,
	resetAllAfter = false,
}) => {
	if (syncOption) {
		// Traditional layout has sync buttons in the header (all/axis/none).
		// showAllSides layout replaced the header with pair-link buttons in the grid.
		const headerBtn = await instance.$(
			`.maxi-axis-control__header button[aria-label="${syncOption}"]`
		);
		if (headerBtn) {
			await headerBtn.click();
		} else if (syncOption === 'none') {
			// showAllSides: unlink the "all" toggle if currently linked, then
			// also unlink any remaining linked pair buttons.
			const linkAllBtn = await instance.$(
				'.maxi-axis-control__all-actions .maxi-axis-control__pair-link--active'
			);
			if (linkAllBtn) await linkAllBtn.click();
			const linkedPairBtns = await instance.$$(
				'.maxi-axis-control__pair-actions .maxi-axis-control__pair-link--active'
			);
			for (const btn of linkedPairBtns) await btn.click();
		} else if (syncOption === 'all') {
			// showAllSides: click the "link all" toggle if currently unlinked.
			const unlinkAllBtn = await instance.$(
				'.maxi-axis-control__all-actions .maxi-axis-control__pair-link:not(.maxi-axis-control__pair-link--active)'
			);
			if (unlinkAllBtn) await unlinkAllBtn.click();
		} else if (syncOption === 'axis') {
			// showAllSides: old axis mode maps to linked vertical and
			// horizontal pairs with the global all-sides link disabled.
			const linkAllBtn = await instance.$(
				'.maxi-axis-control__all-actions .maxi-axis-control__pair-link--active'
			);
			if (linkAllBtn) await linkAllBtn.click();

			const unlinkedPairBtns = await instance.$$(
				'.maxi-axis-control__pair-actions:not(.maxi-axis-control__pair-actions--all) .maxi-axis-control__pair-link:not(.maxi-axis-control__pair-link--active)'
			);
			for (const btn of unlinkedPairBtns) await btn.click();
		}
	}

	if (resetAllBefore)
		// reset
		await instance.$eval('.maxi-axis-control__unit-header button', button =>
			button.click()
		);

	if (unit) {
		// change unit
		const selector = await instance.$(' select');

		await selector.select(unit);
	}

	if (typeof values === 'undefined') return;

	// Change values. In the all-sides layout the visual DOM order can differ
	// from the saved attribute order, so array values should keep the legacy
	// AxisControl order: top/right/bottom/left or top-left/top-right/
	// bottom-right/bottom-left.
	const getInputs = async () => {
		if (!isArray(values)) {
			return instance.$$(
				'.maxi-axis-control__content__item input[type="number"]'
			);
		}

		const sideOrders = [
			['top-left', 'bottom-left'],
			['top', 'left'],
			['top-left', 'top-right', 'bottom-right', 'bottom-left'],
			['top', 'right', 'bottom', 'left'],
		];

		for (const sideOrder of sideOrders) {
			const sideInputs = [];

			for (const side of sideOrder) {
				const sideInput = await instance.$(
					`.maxi-axis-control__content__item__${side} input[type="number"]`
				);

				if (sideInput) sideInputs.push(sideInput);
			}

			if (sideInputs.length === values.length) return sideInputs;
		}

		return instance.$$(
			'.maxi-axis-control__content__item input[type="number"]'
		);
	};

	const inputs = await getInputs();

	// When a single (non-array) value is given, only type into the first input.
	// The axis control's sync mechanism will propagate the value to all other
	// inputs, so typing into subsequent inputs causes intermediate-digit onChange
	// calls that can trigger preserveBaseBreakpoint to write unwanted attributes.
	const inputsToType = isArray(values) ? inputs : [inputs[0]];

	for (let i = 0; i < inputsToType.length; i += 1) {
		const el = inputsToType[i];
		const newValue = isArray(values) ? values[i] : values;

		await el.focus();
		await pressKeyWithModifier('primary', 'a');

		if (newValue === 'auto') {
			await instance.$$eval(
				'.maxi-axis-control__item-auto input',
				(inputs, _i) => inputs[_i].click(),
				i
			);
		}
		// Ensure is a number
		if (!isNaN(+newValue))
			await page.keyboard.type(newValue, { delay: 350 });
	}

	if (resetAllAfter)
		await instance.$eval('.maxi-axis-control__unit-header button', button =>
			button.click()
		);
};

export default editAxisControl;
