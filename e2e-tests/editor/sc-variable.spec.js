/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, saveDraft } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openPreviewPage,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../utils';

const scVarsSelector = '#maxi-blocks-sc-vars-inline-css';

const waitForExpandedSCVars = async currentPage => {
	await currentPage.waitForSelector(scVarsSelector);

	await currentPage.waitForFunction(
		selector => {
			const el = document.querySelector(selector);
			if (!el || !el.innerText) return false;

			const content = el.innerText.trim();
			const requiredVariables = [
				'--maxi-light-button-font-family-general:',
				'--maxi-light-button-font-family-xs:',
				'--maxi-light-button-padding-right-xs:',
				'--maxi-dark-navigation-padding-right-xs:',
				'--maxi-active-sc-color:',
			];

			return (
				content.startsWith(':root{') &&
				content.endsWith('}') &&
				requiredVariables.every(variable =>
					content.includes(variable)
				)
			);
		},
		{ timeout: 15000 },
		scVarsSelector
	);
};

describe('sc-variable', () => {
	it('Check sc-vars', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');
		await updateAllBlockUniqueIds(page);

		await page.waitForTimeout(2000);
		await saveDraft();
		await page.waitForTimeout(2000);

		await page.evaluate(() => window.location.reload());

		await page.waitForTimeout(5000);

		await waitForExpandedSCVars(page);

		const scVariable = await page.$eval(
			scVarsSelector,
			content => content.innerText.trim()
		);

		expect(scVariable).toMatchSnapshot();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');
		await waitForExpandedSCVars(page);

		const scVariableFront = await page.$eval(
			scVarsSelector,
			content => content.innerText.trim()
		);

		expect(scVariableFront).toMatchSnapshot();
	});
});
