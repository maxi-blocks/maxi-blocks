import { insertBlock } from '@wordpress/e2e-test-utils';
import getEditorFrame from './getEditorFrame';

const insertMaxiBlock = async (page, blockName) => {
	await insertBlock(blockName);

	const blockClass = `.maxi-${blockName
		.replace(' Maxi', '')
		.replace(/ /g, '-')
		.replace('Icon', 'svg-icon')
		.toLowerCase()}-block`;

	const frame = await getEditorFrame(page);
	await frame.waitForSelector(blockClass);

	if (blockClass === '.maxi-container-block')
		await frame.waitForSelector('.maxi-row-block');
};

export default insertMaxiBlock;
