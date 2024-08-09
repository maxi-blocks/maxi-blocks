/**
 * Internal dependencies
 */
import {
	warmupRun,
	performMeasurements,
	saveEventMeasurements,
	waitForBlocksLoad,
	prepareInsertMaxiBlock,
} from './utils';
import { PATTERNS } from './config';

/**
 * Logins if not already logged in.
 *
 * @param {Page} page
 * @param {Browser} browser
 * @returns {boolean} True if it was logged in, false otherwise.
 */
const loginIfNotLoggedIn = async (page, browser) => {
	const button = await page.$(
		'.maxi-cloud-container__patterns__top-menu__button-connect-pro'
	);
	if (!button) {
		return true;
	}

	await page.type(
		'.maxi-text-control__input',
		process.env.REACT_APP_MAXI_BLOCKS_PRO_LOGIN
	);
	await button.click();
	const loginPage = await browser.newPage();
	await loginPage.goto(
		`https://my.maxiblocks.com/login?plugin&email=${encodeURIComponent(
			process.env.REACT_APP_MAXI_BLOCKS_PRO_LOGIN
		)}`
	);
	const passwordInput = await loginPage.waitForSelector(
		'input[type="password"]'
	);
	await passwordInput.focus();
	await loginPage.keyboard.type(
		process.env.REACT_APP_MAXI_BLOCKS_PRO_PASSWORD
	);
	const submitButton = await loginPage.waitForSelector(
		'button[type="submit"]'
	);
	await submitButton.click();
	await loginPage.waitForTimeout(1000);
	await loginPage.close();
	await page.bringToFront();
	await page.waitForSelector(
		'.maxi-cloud-container__patterns__top-menu__text_pro'
	);
	return false;
};

/**
 * Get the callback to insert a pattern.
 *
 * @param {Page} page
 * @param {Browser} browser
 * @param {string} patternName
 * @returns {Promise<Function>} Callback to insert a pattern.
 */
const prepareInsertPattern = async (page, browser, patternName) => {
	const insertLibrary = await prepareInsertMaxiBlock(
		page,
		'Template Library Maxi'
	);
	await insertLibrary();
	const loggedIn = await loginIfNotLoggedIn(page, browser);
	if (!loggedIn) {
		const closeButton = await page.waitForSelector(
			'.components-modal__header button[aria-label="Close"]'
		);
		await page.evaluate(button => {
			button.click();
		}, closeButton);
		const openButton = await page.waitForSelector(
			'.maxi-block-library__modal-button__placeholder'
		);
		await page.evaluate(button => {
			button.click();
		}, openButton);
	}
	await page.waitForSelector('.ais-SearchBox-input');
	await page.type('.ais-SearchBox-input', patternName);
	await page.waitForTimeout(500);

	const previewButton = await page.waitForSelector(
		'.maxi-cloud-masonry-card__button',
		{ visible: true }
	);
	await page.evaluate(button => {
		button.click();
	}, previewButton);

	return async () => {
		const insertButton = await page.waitForSelector(
			'.maxi-cloud-toolbar__buttons-group_close .maxi-cloud-toolbar__button',
			{ visible: true }
		);
		await page.evaluate(button => {
			button.click();
		}, insertButton);
	};
};

describe('Patterns performance', () => {
	beforeEach(async () => {
		await warmupRun(page);
	});

	PATTERNS.forEach(patternName => {
		it(`${patternName} performance`, async () => {
			let insertPattern = null;

			const measurements = await performMeasurements({
				insert: {
					pre: async () => {
						insertPattern = await prepareInsertPattern(
							page,
							browser,
							patternName
						);
					},
					action: async () => {
						await insertPattern();
						await waitForBlocksLoad(page);
					},
				},
				reload: {
					pre: async () => {
						await page.waitForSelector('.editor-post-save-draft');
						await page.click('.editor-post-save-draft');
						await page.waitForTimeout(1000);
					},
					action: async () => {
						await page.reload();
						await waitForBlocksLoad(page);
					},
				},
			});

			saveEventMeasurements(patternName, measurements);
		}, 1000000);
	});
});
