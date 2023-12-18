/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { getBlockAttributes } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import * as defaults from './defaults/index';
import { getIsValid } from './utils';
import getBreakpointFromAttribute from './getBreakpointFromAttribute';
import { getBlockData } from '../attributes';

/**
 * External dependencies
 */
import { isString, isArray, isNil } from 'lodash';

/**
 * Returns the block name if they are all the same
 */
const getBlocksName = clientIds => {
	const blockEditorStore = select('core/block-editor');
	const { getBlockName } = blockEditorStore;

	if (clientIds.length === 1) return getBlockName(clientIds[0]);

	const isSameBlockType = clientIds.some((block1, block2) => {
		return getBlockName(block1) !== getBlockName(block2);
	});

	if (isSameBlockType) return getBlockName(clientIds[0]);

	return false;
};

/**
 * Returns default property of the block
 *
 * @param {string} clientId Block's client id
 * @param {string} prop     Claimed property to return
 */
const getDefaultAttribute = (
	prop,
	clientIds = null,
	avoidBaseBreakpoint = false
) => {
	const blockEditorStore = select('core/block-editor');
	const { getBlockName, getSelectedBlockClientIds } = blockEditorStore;

	let blockName = '';
	if (isString(clientIds)) {
		blockName = getBlockName(clientIds);
	} else if (isArray(clientIds)) {
		blockName = getBlocksName(clientIds);
	} else if (isNil(clientIds)) {
		blockName = getBlocksName(getSelectedBlockClientIds());
	}

	const isMaxiBlock = blockName && blockName.includes('maxi-blocks');
	if (!isMaxiBlock) return null;

	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const maxiBlocksStore = select('maxiBlocks');

	let response = getBlockAttributes(blockName)[prop];
	if (getBlockData(blockName)?.maxiAttributes?.[prop]) {
		response = getBlockData(blockName).maxiAttributes[prop];
	}

	const isGeneral = getBreakpointFromAttribute(prop) === 'general';
	if (getIsValid(response, true)) return response;
	if (isGeneral) {
		if (avoidBaseBreakpoint) return response;

		const baseBreakpoint = maxiBlocksStore.receiveBaseBreakpoint();
		const baseAttribute =
			getBlockAttributes(blockName)[
				prop.replace('general', baseBreakpoint)
			];

		if (getIsValid(baseAttribute, true)) return baseAttribute;
	}

	// Check default value
	if (prop in defaults) {
		response = defaults[prop].default;
	} else if (!avoidBaseBreakpoint && isNil(response) && isGeneral) {
		const baseBreakpoint = maxiBlocksStore.receiveBaseBreakpoint();
		response = getDefaultAttribute(
			prop.replace('general', baseBreakpoint, clientIds)
		);
	}

	return response;
};

export default getDefaultAttribute;
