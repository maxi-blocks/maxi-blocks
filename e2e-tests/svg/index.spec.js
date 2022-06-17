/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { svgFetch, openPreviewPage } from '../utils';

/**
 * External dependencies
 */
import parse from 'html-react-parser';
import { isEmpty } from 'lodash';

/**
 * Tests
 */

// Check html1 and html2 are equals
const htmlComparison = async (page, html1, html2) =>
	page.evaluate(
		(_html1, _html2) => {
			const node1 = document.createElement('div');
			node1.innerHTML = _html1;

			const node2 = document.createElement('div');
			node2.innerHTML = _html2;

			return node1.isEqualNode(node2);
		},
		html1,
		html2
	);

// Sanitizes html icons code
const iconSanitize = icon =>
	icon.replace(/ "/g, '"').replace(/enable-background="new"/g, '');

const checkSVGGroup = async (page, fetchPage = 1) => {
	await createNewPost();
	const svgHtml = [];
	const result = [];
	const resultRefresh = [];

	const svgGroup = await svgFetch(page, fetchPage);

	// First loop to generate icons
	for (let i = 0; i < svgGroup.length - 1; i += 1) {
		const svg = svgGroup[i];

		// Add block without opening the modal and adding the SVG
		await page.evaluate(_svg => {
			wp.data.dispatch('core/block-editor').insertBlock(
				wp.blocks.createBlock('maxi-blocks/svg-icon-maxi', {
					openFirstTime: false,
					content: _svg,
				})
			);
		}, svg);

		const svgBaseHtml = await page.$$eval(
			'.maxi-svg-icon-block__icon svg',
			(svg, _i) => svg[_i]?.outerHTML,
			i
		);

		svgHtml.push(svgBaseHtml);
	}

	await page.waitForTimeout(250);

	// Check FrontEnd
	const previewPage = await openPreviewPage(page);
	await previewPage.waitForSelector('.entry-content');
	await page.waitForTimeout(250);

	for (let e = 0; e < svgGroup.length - 1; e += 1) {
		const previewIcon = await previewPage.$$eval(
			'.maxi-svg-icon-block__icon svg',
			(svg, _e) => svg[_e]?.outerHTML,
			e
		);
		const previewIconHtml = parse(svgHtml[e]);

		// Check string exist
		if (typeof previewIcon !== 'string')
			result.push(previewIconHtml.props.className);
		else {
			const svgSanitize = iconSanitize(svgHtml[e]);
			const previewSanitize = iconSanitize(previewIcon);

			const compareFrontHtml = await htmlComparison(
				page,
				svgSanitize,
				previewSanitize
			);

			if (!compareFrontHtml)
				result.push(
					`${
						previewIconHtml.props.className ?? '⚠️Class not found⚠️'
					} - ${e}/${fetchPage}`
				);
		}
	}

	// Check Reload
	await page.waitForTimeout(250);
	await previewPage.close();
	await page.waitForTimeout(150);
	await page.reload();
	await page.waitForSelector('.maxi-svg-icon-block__icon svg');

	for (let i = 0; i < svgGroup.length - 1; i += 1) {
		const svgRefresh = await page.$$eval(
			'.maxi-svg-icon-block__icon svg',
			(svg, _i) => svg[_i]?.outerHTML,
			i
		);
		const previewIconHtml = parse(svgHtml[i]);

		if (typeof svgRefresh !== 'string')
			resultRefresh.push(previewIconHtml.props.className);
		else {
			const compareRefreshHtml = await htmlComparison(
				page,
				svgRefresh,
				svgHtml[i]
			);

			if (!compareRefreshHtml)
				result.push(previewIconHtml.props.className);
		}
	}

	// Return error ms
	if (!isEmpty(resultRefresh, result)) {
		console.error(
			`Comparison after refresh failed on this/these svg: ${resultRefresh.join(
				', '
			)}`
		);

		console.error(
			`Comparison on frontend failed on this/these svg: ${JSON.stringify(
				result
			)}`
		);
		return false;
	}
	return true;
};

describe('SVG checker 2100', () => {
	it('SVG icons (0 =>2100)', async () => {
		// Avoids tests to stop when a console.error appears
		console.error = jest.fn();
		console.warn = jest.fn();

		// 30min +/-
		let i = 1;
		do {
			const test = await checkSVGGroup(page, i);
			await page.waitForTimeout(250);

			await expect(test).toStrictEqual(true);

			i += 1;
			await page.waitForTimeout(50);
		} while (i <= 30);
	}, 999999999);
});

describe('SVG checker 4200', () => {
	it('SVG icons (2100 => 4200)', async () => {
		// Avoids tests to stop when a console.error appears
		console.error = jest.fn();
		console.warn = jest.fn();

		// 1h +/-
		let e = 30;

		do {
			const test = await checkSVGGroup(page, e);
			await page.waitForTimeout(250);

			await expect(test).toStrictEqual(true);

			e += 1;
			await page.waitForTimeout(50);
		} while (e <= 60);
	}, 999999999);
});
describe('SVG checker 6300', () => {
	it('SVG icons (4200 => 6300)', async () => {
		// Avoids tests to stop when a console.error appears
		console.error = jest.fn();
		console.warn = jest.fn();

		let i = 60;

		do {
			const test = await checkSVGGroup(page, i);
			await page.waitForTimeout(250);

			await expect(test).toStrictEqual(true);

			i += 1;
			await page.waitForTimeout(50);
		} while (i <= 90);
	}, 999999999);
});
describe('SVG checker 8400', () => {
	it('SVG icons (6300 => 8400)', async () => {
		// Avoids tests to stop when a console.error appears
		console.error = jest.fn();
		console.warn = jest.fn();

		let i = 90;

		do {
			const test = await checkSVGGroup(page, i);
			await page.waitForTimeout(250);

			await expect(test).toStrictEqual(true);

			i += 1;
			await page.waitForTimeout(50);
		} while (i <= 120);
	}, 999999999);
});
describe('SVG checker 8960', () => {
	it('SVG icons (8300 => 8960 +/-)', async () => {
		// Avoids tests to stop when a console.error appears
		console.error = jest.fn();
		console.warn = jest.fn();

		let i = 120;

		do {
			const test = await checkSVGGroup(page, i);
			await page.waitForTimeout(250);

			await expect(test).toStrictEqual(true);

			i += 1;
			await page.waitForTimeout(50);
		} while (i <= 130);
	}, 999999999);
	// max pag130
});
