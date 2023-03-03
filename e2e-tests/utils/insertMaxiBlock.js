import { insertBlock } from '@wordpress/e2e-test-utils';

const insertMaxiBlock = async (page, blockName) => {
	await insertBlock(blockName);

	const blockClass = `.maxi-${blockName
		.replace(' Maxi', '')
		.replace(/ /g, '-')
		.replace('Icon', 'svg-icon')
		.toLowerCase()}-block`;

	await page.waitForSelector(blockClass);

	if (blockClass === '.maxi-container-block')
		await page.waitForSelector('.maxi-row-block');
};

export default insertMaxiBlock;
