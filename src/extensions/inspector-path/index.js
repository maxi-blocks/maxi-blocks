/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const { receiveInspectorPath } = select('maxiBlocks');

export const getActiveTabName = depth => receiveInspectorPath()?.[depth]?.name;

export const getForcedTabFromPath = (items, depth) => {
	const name = getActiveTabName(depth) ?? '';
	const tabIndex = items?.findIndex(item => item.label === name);

	return tabIndex > 0 ? tabIndex : 0;
};

export const getActiveaccordion = depth => {
	return receiveInspectorPath()?.[depth]?.value || 0;
};
