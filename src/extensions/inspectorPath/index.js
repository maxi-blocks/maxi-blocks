/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const { receiveInspectorPath } = select('maxiBlocks');

const ispectorPathValues = receiveInspectorPath();

export const getForcedTabFromPath = (items, depth) => {
	const { name } = ispectorPathValues[depth] ? ispectorPathValues[depth] : {};
	const tabIndex = items?.findIndex(item => item.label === name);
	return tabIndex > 0 ? tabIndex : 0;
};

export const getActiveTabName = depth => {
	return ispectorPathValues[depth]
		? ispectorPathValues[depth]?.name
		: undefined;
};

export const getActiveAccordiont = depth => {
	return ispectorPathValues[depth]?.value || 0;
};
