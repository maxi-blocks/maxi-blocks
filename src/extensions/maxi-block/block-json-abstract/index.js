/**
 * Dependencies
 */
const path = require('path');
const { writeFile, readFile } = require('fs').promises;
const { existsSync } = require('fs');
const puppeteer = require('puppeteer-core');
const { createURL } = require('@wordpress/e2e-test-utils');

const username = 'admin';
const password = 'password';

const blockJsonAbstracter = async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Login
	await page.goto(createURL('wp-login.php'));

	await page.focus('#user_login');
	await page.type('#user_login', username);
	await page.focus('#user_pass');
	await page.type('#user_pass', password);

	await Promise.all([page.waitForNavigation(), page.click('#wp-submit')]);

	// New post
	await page.goto(`${page.url()}post-new.php?post_type=page`);
	await page.waitForTimeout(1000);

	// Get `maxi-blocks` blocks
	const maxiBlocks = JSON.parse(
		await page.evaluate(() => {
			const maxiBlocks = [];

			// Get all blocks
			const allBlocks = wp.blocks.getBlockTypes();

			// Iterate over all blocks
			for (const block of allBlocks) {
				// In case the block is a `maxi-blocks` block, push it to the `maxi-blocks` array
				if (block.category === 'maxi-blocks') {
					maxiBlocks.push(block);
				}
			}

			return JSON.stringify(maxiBlocks);
		})
	);

	// In case there are no `maxi-blocks` blocks, end the process
	if (!maxiBlocks.length) {
		console.error('❌ No `maxi-blocks` blocks found');

		// End the process
		await browser.close();
		return;
	}

	// Iterate over the `maxi-blocks` blocks
	for (const maxiBlock of maxiBlocks) {
		const { attributes: blockAttributes } = maxiBlock;
		const blockName = maxiBlock.name.replace('maxi-blocks/', '');

		// Get the block.json file path
		const blockFolderPath = path.join(`src/blocks/${blockName}`);
		const blockFile = 'block.json';
		const blockPath = path.join(blockFolderPath, blockFile);

		// In case the block.json file does not exist, continue to the next block
		if (!existsSync(blockPath)) {
			console.error('❌ block.json file does not exist for ', blockName);

			// eslint-disable-next-line no-continue
			continue;
		}

		// Get the block.json file content as an object
		// eslint-disable-next-line no-await-in-loop
		const blockFileContent = JSON.parse(await readFile(blockPath, 'utf8'));

		// Replace the attributes of the block.json file
		blockFileContent.attributes = blockAttributes;

		// Write the new block.json file
		writeFile(blockPath, JSON.stringify(blockFileContent, null, 2))
			.catch(err => console.error(err))
			// eslint-disable-next-line no-console
			.then(() =>
				// eslint-disable-next-line no-console
				console.log(`✅ ${blockFile} file updated for ${blockName}`)
			);
	}

	await browser.close();
};

blockJsonAbstracter();

module.exports = blockJsonAbstracter;
