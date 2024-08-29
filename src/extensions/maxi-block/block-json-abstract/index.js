/* eslint-disable no-console */
/**
 * Dependencies
 */
const path = require('path');
const { writeFile } = require('fs').promises;
const { existsSync, mkdirSync } = require('fs');
const puppeteer = require('puppeteer');
const { createURL } = require('@wordpress/e2e-test-utils');

const BLOCKS_WITHOUT_JSON_FILE = ['maxi-cloud'];
const username = 'admin';
const password = 'password';

async function loginToWordPress(page) {
	await page.goto(createURL('wp-login.php'));
	await page.type('#user_login', username);
	await page.type('#user_pass', password);
	await Promise.all([page.waitForNavigation(), page.click('#wp-submit')]);
}

async function activateMaxiBlocks(page) {
	await page.goto(createURL('wp-admin/plugins.php'));
	const activateButton = await page.$('#activate-maxi-blocks');
	if (activateButton) {
		await Promise.all([page.waitForNavigation(), activateButton.click()]);
	}
}

async function getMaxiBlocks(page) {
	await page.goto(createURL('wp-admin/post-new.php'));
	await new Promise(resolve => {
		setTimeout(resolve, 1000);
	});

	return page.evaluate(() => {
		const allBlocks = wp.blocks.getBlockTypes();
		return JSON.stringify(
			allBlocks.filter(block => block.category === 'maxi-blocks')
		);
	});
}

async function updateBlockJson(blockName, blockData) {
	const metadataFolder = path.join('metadata', 'blocks');
	mkdirSync(metadataFolder, { recursive: true });
	const blockJsonPath = path.join(metadataFolder, `${blockName}.json`);

	await writeFile(blockJsonPath, `${JSON.stringify(blockData, null, 2)}\n`);
	return blockName;
}

async function updateGroupAttributes(page) {
	const defaultGroupAttributes = await page.evaluate(() =>
		JSON.stringify(
			wp.data.select('maxiBlocks/styles').getDefaultGroupAttributes()
		)
	);

	if (!defaultGroupAttributes) {
		throw new Error('No default group attributes found');
	}

	const parsedAttributes = JSON.parse(defaultGroupAttributes);
	const metadataGroupFolder = path.join('metadata', 'groups');
	mkdirSync(metadataGroupFolder, { recursive: true });

	const writePromises = Object.entries(parsedAttributes).map(
		([key, value]) => {
			const filePath = path.join(metadataGroupFolder, `${key}.json`);
			return writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
		}
	);

	await Promise.all(writePromises);
	return writePromises.length;
}

async function blockJsonAbstracter() {
	if (!existsSync('build')) {
		console.error(
			'❌ Error: The build folder does not exist. Please run "npm run build" or "npm run start" before running this script.'
		);
		process.exit(1);
	}

	const browser = await puppeteer.launch({ headless: 'new' });
	const page = await browser.newPage();

	try {
		console.log('Attempting to log in to WordPress...');
		await loginToWordPress(page);
		console.log('Login successful.');

		console.log('Activating MaxiBlocks plugin...');
		await activateMaxiBlocks(page);
		console.log('MaxiBlocks plugin activated.');

		console.log('Fetching MaxiBlocks...');
		const maxiBlocks = JSON.parse(await getMaxiBlocks(page));
		if (!maxiBlocks.length) {
			throw new Error('No `maxi-blocks` blocks found');
		}
		console.log(`Found ${maxiBlocks.length} MaxiBlocks.`);

		const updatePromises = maxiBlocks.map(block => {
			const { attributes, customCss, scProps, transition, name } = block;
			const blockName = name.replace('maxi-blocks/', '');
			if (BLOCKS_WITHOUT_JSON_FILE.includes(blockName)) {
				return null;
			}
			const blockData = { attributes, customCss, scProps, transition };
			return updateBlockJson(blockName, blockData);
		});

		const updatedBlocks = (await Promise.all(updatePromises)).filter(
			Boolean
		);
		console.log(`✅ JSON files updated for ${updatedBlocks.join(', ')}`);

		const groupAttributesCount = await updateGroupAttributes(page);
		console.log(
			`✅ ${groupAttributesCount} group attributes files created`
		);
	} catch (error) {
		console.error('❌ Error:', error.message);
	} finally {
		await browser.close();
	}
}

blockJsonAbstracter();

module.exports = blockJsonAbstracter;
