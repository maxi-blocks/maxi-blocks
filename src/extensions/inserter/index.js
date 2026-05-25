/**
 * WordPress dependencies
 */
import { dispatch, select, subscribe } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { restrictColumnMaxiToRow } from './columnMaxiParentGuard';
import {
	getSelectedBlockInserterRootClientId,
} from './selectedBlockInserterRoot';

const EDITOR_STORE_NAMES = ['core/editor', 'core/edit-post', 'core/edit-site'];

const getInserterStoreName = () =>
	EDITOR_STORE_NAMES.find(storeName => {
		const editorSelect = select(storeName);
		const editorDispatch = dispatch(storeName);

		return (
			typeof editorSelect?.isInserterOpened === 'function' &&
			typeof editorDispatch?.setIsInserterOpened === 'function'
		);
	});

const filterColumnMaxiInsertion = (
	canInsert,
	blockType,
	rootClientId,
	{ getBlock } = {}
) =>
	restrictColumnMaxiToRow({
		canInsert,
		blockName: blockType?.name,
		rootClientId,
		getBlock,
	});

addFilter(
	'blockEditor.__unstableCanInsertBlockType',
	'maxi-blocks/column-maxi-parent-guard',
	filterColumnMaxiInsertion
);

let currentSelectedInserterRootClientId = null;

const syncSelectedBlockInserterRoot = () => {
	const blockEditor = select('core/block-editor');
	const inserterStoreName = getInserterStoreName();
	const editor = inserterStoreName ? select(inserterStoreName) : null;

	if (!editor?.isInserterOpened?.()) {
		currentSelectedInserterRootClientId = null;
		return;
	}

	const selectedClientId = blockEditor.getSelectedBlockClientId();
	const selectedBlockName = selectedClientId
		? blockEditor.getBlockName(selectedClientId)
		: null;
	const rootClientId = getSelectedBlockInserterRootClientId({
		selectedBlockName,
		selectedClientId,
	});

	if (!rootClientId) {
		currentSelectedInserterRootClientId = null;
		return;
	}

	if (currentSelectedInserterRootClientId === rootClientId) return;

	currentSelectedInserterRootClientId = rootClientId;

	dispatch(inserterStoreName).setIsInserterOpened({
		rootClientId,
		insertionIndex: blockEditor.getBlockOrder(rootClientId).length,
	});
};

subscribe(syncSelectedBlockInserterRoot);
