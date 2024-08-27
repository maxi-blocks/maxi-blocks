/**
 * Dependencies
 */
const path = require('path');
const { writeFile, readFile } = require('fs').promises;
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
	await new Promise(resolve => setTimeout(resolve, 1000));

	return page.evaluate(() => {
		const allBlocks = wp.blocks.getBlockTypes();
		return JSON.stringify(
			allBlocks.filter(block => block.category === 'maxi-blocks')
		);
	});
}

async function updateBlockJson(blockName, blockData) {
	const blockFolderPaths = [
		`src/blocks/${blockName}`,
		`build/blocks/${blockName}`,
	];
	const blockFile = 'block.json';

	for (const folderPath of blockFolderPaths) {
		const blockPath = path.join(folderPath, blockFile);
		if (!existsSync(blockPath)) continue;

		const blockFileContent = JSON.parse(await readFile(blockPath, 'utf8'));
		Object.assign(blockFileContent, blockData);

		await writeFile(blockPath, JSON.stringify(blockFileContent, null, 2));
		return blockName;
	}

	if (!BLOCKS_WITHOUT_JSON_FILE.includes(blockName)) {
		console.error(`❌ block.json file does not exist for ${blockName}`);
	}
	return null;
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
	const writePromises = Object.entries(parsedAttributes).map(
		([key, value]) => {
			const filePath = path.join('group-attributes', `${key}.json`);
			mkdirSync(path.dirname(filePath), { recursive: true });
			return writeFile(filePath, JSON.stringify(value, null, 2));
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
			const blockData = { attributes, customCss, scProps, transition };
			return updateBlockJson(blockName, blockData);
		});

		const updatedBlocks = (await Promise.all(updatePromises)).filter(
			Boolean
		);
		console.log(
			`✅ block.json files updated for ${updatedBlocks.join(', ')}`
		);

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
