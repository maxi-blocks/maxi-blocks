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

const checkSVGGroup = async (page, fetchPage = 1) => {
	await createNewPost();
	const svgHtml = [];
	const result = [];
	const resultRefresh = [];

	const svgGroup = await svgFetch(page, fetchPage);

	for (let i = 0; i < svgGroup.length - 1; i += 1) {
		if (i === 48 && fetchPage === 96) return;

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

	// FrontEnd
	const previewPage = await openPreviewPage(page);
	await previewPage.waitForSelector('.entry-content');
	await page.waitForTimeout(250);

	for (let e = 0; e < svgGroup.length - 1; e += 1) {
		if (e === 48 && fetchPage === 96) return;

		const previewIcon = await previewPage.$$eval(
			'.maxi-svg-icon-block__icon svg',
			(svg, _e) => svg[_e]?.outerHTML,
			e
		);
		const previewIconHtml = parse(svgHtml[e]);

		// check string exist
		if (typeof previewIcon !== 'string')
			result.push(previewIconHtml.props.className);
		else {
			// check preview and svgHtml are equal

			const svgSanitize = svgHtml[e].replace(/ "/g, '"');
			const previewSanitize = previewIcon.replace(/ "/g, '"');

			const compareFrontHtml = await htmlComparison(
				page,
				svgSanitize,
				previewSanitize
			);

			// if are not equal check replace
			if (!compareFrontHtml) {
				const editedSvgHtml = svgHtml[e].replace(
					/enable-background="new"/g,
					''
				);

				const editedPreviewIcon = previewIcon.replace(
					/enable-background="new"/g,
					''
				);

				const compareEditedFrontHtml = await htmlComparison(
					page,
					editedPreviewIcon,
					editedSvgHtml
				);

				// if are not equal return error
				if (compareEditedFrontHtml !== true)
					result.push(
						`${
							previewIconHtml.props.className ??
							'⚠️Class not found⚠️'
						} - ${e}/${fetchPage}`
					);
			}
		}
	}
	// renderToString
	if (!isEmpty(result)) {
		console.error(
			`Comparison on frontend failed on this/these svg: ${JSON.stringify(
				result
			)}`
		);

		return false;
	}

	// Reload
	await page.waitForTimeout(250);
	await previewPage.close();
	await page.waitForTimeout(150);
	await page.reload();
	await page.waitForSelector('.maxi-svg-icon-block__icon svg');

	for (let i = 0; i < svgGroup.length - 1; i += 1) {
		if (i === 48 && fetchPage === 96) return;
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

			if (compareRefreshHtml !== true)
				result.push(previewIconHtml.props.className);
		}
	}

	if (!isEmpty(resultRefresh)) {
		console.error(
			`Comparison after refresh failed on this/these svg: ${resultRefresh.join(
				', '
			)}`
		);

		return false;
	}

	return true;
};

describe('SVG checker 2100', () => {
	it('SVG icons (0 =>2100)', async () => {
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
