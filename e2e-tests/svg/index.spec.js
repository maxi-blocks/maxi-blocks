import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { setAttributes, svgFetch } from '../utils';

const checkSVGGroup = async (page, fetchPage = 1) => {
	await createNewPost();

	debugger;

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

		await page.waitForTimeout(100);

		await setAttributes(page, { content: svg });
	}

	debugger;
};

describe('SVG checker', () => {
	it('SVG icons', async () => {
		let i = 1;

		do {
			await checkSVGGroup(page, i);

			i += 1;
		} while (i <= 3);
	}, 999999999);
});
