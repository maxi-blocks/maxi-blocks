/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/*
 * Internal dependencies
 */
import { openSidebar } from '@extensions/dom';
import { getBlockDataByUniqueID } from '@extensions/styles/migrators/utils';

const { receiveInspectorPath } = select('maxiBlocks');

export const getActiveTabName = depth => receiveInspectorPath()?.[depth]?.name;

export const getForcedTabFromPath = (items, depth) => {
	const name = getActiveTabName(depth) ?? '';
	const tabIndex = items?.findIndex(item => item.label === name);

	return tabIndex > 0 ? tabIndex : 0;
};

export const getActiveAccordion = depth => {
	return receiveInspectorPath()?.[depth]?.value || 0;
};

export const openSidebarAccordion = (tab, accordionName) => {
	const { openGeneralSidebar } = dispatch('core/edit-post');
	openGeneralSidebar('edit-post/block')
		.then(() =>
			dispatch('maxiBlocks').updateInspectorPath({
				depth: 0,
				value: tab,
			})
		)
		.then(() => openSidebar(accordionName));
};

export const openTransitions = () => {
	const tabNumber = () => {
		const { uniqueID } =
			select('core/block-editor').getSelectedBlock().attributes;
		const checkForCanvas =
			getBlockDataByUniqueID(uniqueID)?.customCss?.categories;
		if (Array.isArray(checkForCanvas) && checkForCanvas.includes('canvas'))
			return 2;
		return 1;
	};

	const { openGeneralSidebar } = dispatch('core/edit-post');
	openGeneralSidebar('edit-post/block')
		.then(() =>
			dispatch('maxiBlocks').updateInspectorPath({
				depth: 0,
				name: 'Advanced',
				value: tabNumber,
			})
		)
		.then(() => openSidebar('hover transition'));
};
