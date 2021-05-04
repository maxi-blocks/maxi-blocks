/* eslint-disable import/prefer-default-export */
/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const { getSelectedBlockClientId } = select('core/block-editor');

export const getContentBackup = (state, clientId) => {
	const selectedClientId = clientId || getSelectedBlockClientId();

	if (state.contentBackup && state.contentBackup[selectedClientId])
		return state.contentBackup[selectedClientId];

	return {};
};
