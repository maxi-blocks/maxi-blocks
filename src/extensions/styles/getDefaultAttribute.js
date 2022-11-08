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

/**
 * External dependencies
 */
import { isString, isArray, isNil } from 'lodash';

/**
 * Returns the block name if they are all the same
 */
const getBlocksName = clientIds => {
	const { getBlockName } = select('core/block-editor');

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
	const { getBlockName, getSelectedBlockClientIds } =
		select('core/block-editor');

	let response = null;
	let blockName = '';

	if (isString(clientIds)) blockName = getBlockName(clientIds);
	else if (isArray(clientIds)) blockName = getBlocksName(clientIds);
	else if (isNil(clientIds))
		blockName = getBlocksName(getSelectedBlockClientIds());

	// Check default value on block
	if (blockName && blockName.includes('maxi-blocks'))
		response = getBlockAttributes(blockName)[prop];

	const isGeneral = getBreakpointFromAttribute(prop) === 'general';

	if (getIsValid(response, true)) return response;
	if (isGeneral) {
		if (avoidBaseBreakpoint) return response;

		const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();
		const baseAttribute =
			getBlockAttributes(blockName)[
				prop.replace('general', baseBreakpoint)
			];

		if (getIsValid(baseAttribute)) return baseAttribute;
	}

	// Check default value
	Object.values(defaults).forEach(defaultAttrs => {
		if (prop in defaultAttrs) response = defaultAttrs[prop].default;
	});

	if (
		!avoidBaseBreakpoint &&
		isNil(response) &&
		getBreakpointFromAttribute(prop) === 'general'
	) {
		const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

		response = getDefaultAttribute(
			prop.replace('general', baseBreakpoint, clientIds)
		);
	}

	return response;
};

export default getDefaultAttribute;
