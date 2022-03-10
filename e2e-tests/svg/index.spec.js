/* eslint-disable no-await-in-loop */

import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { setAttributes, svgFetch, openPreviewPage } from '../utils';
import parse from 'html-react-parser';

const checkSVGGroup = async (page, fetchPage = 1) => {
	await createNewPost();
	let checker = true;
	const checkRefresh = true;
	const svgHtml = [];

	const svgGroup = await svgFetch(page, fetchPage);

	for (let i = 0; i < svgGroup.length; i += 1) {
		const svg = svgGroup[i];

		await insertBlock('SVG Icon Maxi');

		// Close model opened automatically by the block
		await page.waitForSelector(
			'.components-modal__content .components-modal__header button'
		);
		await page.$eval(
			'.components-modal__content .components-modal__header button',
			svg => svg.click()
		);

		await setAttributes(page, { content: svg });

		const svgBaseHtml = await page.$$eval(
			'.block-editor-block-list__layout .maxi-svg-icon-block__icon svg',
			(svg, _i) => svg[_i].outerHTML,
			i
		);
		svgHtml.push(svgBaseHtml);
	}

	// FrontEnd
	const previewPage = await openPreviewPage(page);
	await previewPage.waitForSelector('.entry-content');

	for (let e = 0; e < svgGroup.length; e += 1) {
		const previewIcon = await previewPage.$$eval(
			'.wp-block-post-content .maxi-svg-icon-block__icon svg',
			(svg, _e) => svg[_e].outerHTML,
			e
		);

		const frontEndHtml = parse(previewIcon);
		const previewIconHtml = parse(svgHtml[e]);

		if (previewIconHtml === frontEndHtml) {
			checker = true;
			break;
		}
	}
	if (!checker) return false;

	// Reload
	await page.waitForTimeout(250);

	await previewPage.close();

	await page.waitForTimeout(150);

	await page.reload();
	await page.waitForTimeout(150);

	for (let i = 0; i < svgGroup.length; i += 1) {
		const svgRefresh = await page.$$eval(
			'.block-editor-block-list__layout .maxi-svg-icon-block__icon svg',
			(svg, _i) => svg[_i].outerHTML,
			i
		);

		const frontEndHtml = parse(svgRefresh);
		const previewIconHtml = parse(svgHtml[i]);

		if (previewIconHtml === frontEndHtml) {
			checker = true;
			break;
		}
	}
	if (!checkRefresh) return false;

	return true;
};

describe('SVG checker', () => {
	it('SVG icons', async () => {
		let i = 1;

		do {
			const test = await checkSVGGroup(page, i);
			await page.waitForTimeout(250);
			await expect(test).toBeTruthy();

			i += 1;
			await page.waitForTimeout(50);
		} while (i <= 3);
	}, 999999999);
});
