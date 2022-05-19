import openSidebarTab from './openSidebarTab';
import { insertBlock } from '@wordpress/e2e-test-utils';

const checkInspector = async ({ page, block, tab, item, editContent }) => {
	// insert block
	await insertBlock(block);

	// accordion
	const accordion = await openSidebarTab(page, tab, item);

	// edit accordion
	await editContent;
};

export default checkInspector;
