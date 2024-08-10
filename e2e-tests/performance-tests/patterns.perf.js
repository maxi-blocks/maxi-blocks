/**
 * Internal dependencies
 */
import {
	warmupRun,
	performMeasurements,
	saveEventMeasurements,
	waitForBlocksLoad,
	prepareInsertMaxiBlock,
	PatternManager,
} from './utils';
import { PATTERNS, PERFORMANCE_TESTS_TIMEOUT } from './config';

let globalMaxiCookie = null;

/**
 * Logins if not already logged in and stores the cookie.
 *
 * @param {Page} page
 * @param {Browser} browser
 * @returns {boolean} True if it was logged in, false otherwise.
 */
const loginIfNotLoggedIn = async (page, browser) => {
	if (globalMaxiCookie) {
		await page.setCookie(globalMaxiCookie);
		return true;
	}

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
	await page.evaluate(button => {
		button.click();
	}, button);
	const loginPage = await browser.newPage();
	await loginPage.goto(
		`https://my.maxiblocks.com/login?plugin&email=${encodeURIComponent(
			process.env.REACT_APP_MAXI_BLOCKS_PRO_LOGIN
		)}`
	);
	const passwordInput = await loginPage.waitForSelector(
		'input[type="password"]'
	);
	await loginPage.evaluate(input => {
		input.focus();
	}, passwordInput);
	await loginPage.keyboard.type(
		process.env.REACT_APP_MAXI_BLOCKS_PRO_PASSWORD
	);
	await loginPage.waitForTimeout(500);
	await loginPage.evaluate(() => {
		const form = document.querySelector('form');
		if (!form) {
			throw new Error('Form not found');
		}
		form.submit();
	});
	await loginPage.waitForNavigation({ waitUntil: 'networkidle0' });
	const domain = new URL(loginPage.url()).hostname;
	const pages = await browser.pages();
	for (const page of pages) {
		const url = new URL(page.url());
		if (url.hostname === domain) {
			await page.close();
		}
	}
	await page.bringToFront();
	await page.waitForTimeout(1000);

	const cookies = await page.cookies();
	globalMaxiCookie = cookies.find(
		cookie => cookie.name === 'maxi_blocks_key'
	);

	return false;
};

/**
 * Get the callback to insert a pattern.
 *
 * @param {Page} page
 * @param {Browser} browser
 * @param {String} patternName
 * @returns {Promise<Function>} Callback to insert a pattern.
 */
const prepareInsertPattern = async (page, browser, patternName) => {
	const insertLibrary = await prepareInsertMaxiBlock(
		page,
		'Template Library Maxi'
	);
	await insertLibrary();
	await page.waitForTimeout(500);
	const loggedIn = await loginIfNotLoggedIn(page, browser);
	if (!loggedIn) {
		const closeButton = await page.waitForSelector(
			'.components-modal__header button[aria-label="Close"]'
		);
		await page.evaluate(button => {
			button.click();
		}, closeButton);
		await page.waitForTimeout(500);
		const openButton = await page.waitForSelector(
			'.maxi-block-library__modal-button__placeholder'
		);
		await page.evaluate(button => {
			button.click();
		}, openButton);
		await page.waitForTimeout(500);
	}
	const searchBox = await page.waitForSelector('.ais-SearchBox-input', {
		visible: true,
	});
	await page.evaluate(searchBox => {
		searchBox.focus();
	}, searchBox);
	await page.keyboard.type(patternName);
	await page.waitForTimeout(1000);

	while (true) {
		const cards = await page.$$('.maxi-cloud-masonry-card');
		if (cards.length > 0) {
			break;
		}
		await page.waitForTimeout(1000);
	}

	const previewButton = await page.waitForSelector(
		'.maxi-cloud-masonry-card__button',
		{ visible: true }
	);
	await page.evaluate(button => {
		button.click();
	}, previewButton);

	return async page => {
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
	const patternManager = new PatternManager(page);

	console.log('Starting Patterns performance tests');

	beforeEach(async () => {
		await warmupRun(page);
		if (globalMaxiCookie) {
			await page.setCookie(globalMaxiCookie);
		}
	});

	PATTERNS.forEach(patternName => {
		it(
			`${patternName} performance`,
			async () => {
				console.log(`Starting test for pattern: ${patternName}`);

				const patternCode = await patternManager.getPatternCodeEditor(
					patternName
				);

				try {
					const measurements = await performMeasurements({
						insert: {
							pre: async () => {
								console.log(
									`Preparing to insert pattern: ${patternName}`
								);
								// const context =
								// 	await browser.defaultBrowserContext();
								// await context.overridePermissions(page.url(), [
								// 	'clipboard-read',
								// 	'clipboard-write',
								// ]);
								// await page.evaluate(code => {
								// 	navigator.clipboard.writeText(code);
								// }, patternCode);
								const blocks = await page.evaluate(code => {
									return wp.blocks.rawHandler({
										HTML: code,
										mode: 'BLOCKS',
									});
								}, patternCode);
								const block = await page.waitForSelector(
									'.block-editor-default-block-appender__content',
									{ visible: true }
								);
								await page.evaluate(block => {
									block.focus();
								}, block);
								return blocks;
							},
							action: async blocks => {
								console.log(
									`Inserting pattern: ${patternName}`
								);

								// // Use Shift + Insert for pasting (more platform-agnostic)
								// await page.keyboard.down('Shift');
								// await page.keyboard.press('Insert');
								// await page.keyboard.up('Shift');

								// // Trigger change event
								// await page.evaluate(() => {
								// 	const input = document.activeElement;
								// 	input.dispatchEvent(
								// 		new Event('input', { bubbles: true })
								// 	);
								// 	input.dispatchEvent(
								// 		new Event('change', { bubbles: true })
								// 	);
								// });
								await page.evaluate(blocks => {
									wp.data
										.dispatch('core/block-editor')
										.insertBlocks(blocks);
								}, blocks);
								await waitForBlocksLoad(page);
							},
						},
						reload: {
							pre: async () => {
								console.log(
									`Saving draft for pattern: ${patternName}`
								);
								await page.waitForSelector(
									'.editor-post-save-draft'
								);
								await page.click('.editor-post-save-draft');
								await page.waitForTimeout(2000);
							},
							action: async () => {
								console.log(
									`Reloading page for pattern: ${patternName}`
								);
								await page.reload();
								await waitForBlocksLoad(page);
							},
						},
					});

					console.log(
						`Saving measurements for pattern: ${patternName}`
					);
					saveEventMeasurements(patternName, measurements);
					console.log(`Finished test for pattern: ${patternName}`);
				} catch (error) {
					console.error(
						`Error in test for pattern ${patternName}:`,
						error
					);
					throw error;
				}
			},
			PERFORMANCE_TESTS_TIMEOUT
		);
	});
});
