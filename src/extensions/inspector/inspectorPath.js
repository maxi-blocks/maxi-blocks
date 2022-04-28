/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/*
 * Internal dependencies
 */
import openSidebar from '../dom';

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
