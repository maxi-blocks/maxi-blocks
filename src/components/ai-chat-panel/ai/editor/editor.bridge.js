/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

export const getSelectedClientIds = () =>
	select('core/block-editor')?.getSelectedBlockClientIds?.() || [];

export const getBlockAttributes = clientId =>
	select('core/block-editor')?.getBlockAttributes?.(clientId) || {};

export const updateBlockAttributes = (clientId, attributes) =>
	dispatch('core/block-editor')?.updateBlockAttributes?.(clientId, attributes);

export const getBlocks = () =>
	select('core/block-editor')?.getBlocks?.() || [];

export default {
	getSelectedClientIds,
	getBlockAttributes,
	updateBlockAttributes,
	getBlocks,
};
