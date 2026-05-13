/* eslint-disable no-await-in-loop */

/**
 * External dependencies
 */
import { isNaN } from 'lodash';

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
		const syncButton = instance.locator(
			`.maxi-axis-control__header button[aria-label="${syncOption}"]`
		);

		if ((await syncButton.count()) > 0) await syncButton.click();
		else if (syncOption === 'none') {
			const linkAllButton = instance.locator(
				'.maxi-axis-control__all-actions .maxi-axis-control__pair-link--active'
			);

			if ((await linkAllButton.count()) > 0) await linkAllButton.click();

			const linkedPairButtons = instance.locator(
				'.maxi-axis-control__pair-actions:not(.maxi-axis-control__pair-actions--all) .maxi-axis-control__pair-link--active:not(.maxi-axis-control__pair-link--muted)'
			);

			let linkedPairButtonCount = await linkedPairButtons.count();
			const maxIterations = Math.max(linkedPairButtonCount + 2, 4);

			for (
				let iteration = 0;
				linkedPairButtonCount > 0;
				iteration += 1
			) {
				if (iteration >= maxIterations) {
					throw new Error(
						[
							'editAxisControl: linkedPairButtons.count() stayed above 0',
							`after ${iteration} linkedPairButtons.first().click() attempts;`,
							`last count was ${linkedPairButtonCount}.`,
						].join(' ')
					);
				}

				try {
					await linkedPairButtons.first().click();
				} catch (error) {
					throw new Error(
						[
							'editAxisControl: linkedPairButtons.first().click() failed',
							`while linkedPairButtons.count() was ${linkedPairButtonCount}:`,
							error.message,
						].join(' ')
					);
				}

				const nextLinkedPairButtonCount =
					await linkedPairButtons.count();

				if (nextLinkedPairButtonCount >= linkedPairButtonCount) {
					throw new Error(
						[
							'editAxisControl: linkedPairButtons.count() did not decrease',
							'after linkedPairButtons.first().click()',
							`(before: ${linkedPairButtonCount}, after: ${nextLinkedPairButtonCount}).`,
						].join(' ')
					);
				}

				linkedPairButtonCount = nextLinkedPairButtonCount;
			}
		}
	}

	if (resetAllBefore) {
		// reset
		await instance
			.locator('.maxi-axis-control__unit-header button')
			.click();
	}

	if (unit) {
		// change unit
		const selector = instance.locator('select');
		await selector.first().selectOption(unit);
	}

	// Change values
	const inputs = await instance
		.locator('.maxi-axis-control__content__item input[type="number"]')
		.all();

	for (let i = 0; i < inputs.length; i += 1) {
		const el = inputs[i];

		const newValue = Array.isArray(values) ? values[i] : values;

		if (newValue === 'auto') {
			await instance
				.locator('.maxi-axis-control__item-auto input')
				.nth(i)
				.click();
		} else if (!isNaN(+newValue)) {
			// Ensure is a number
			await el.fill(String(newValue));
		}
	}

	if (resetAllAfter) {
		await instance
			.locator('.maxi-axis-control__unit-header button')
			.click();
	}
};

export default editAxisControl;
