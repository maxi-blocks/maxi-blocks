/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const { getSelectedBlockClientId } = select('core/block-editor');

const actions = {
	sendContentBackup(contentBackup, clientId) {
		return {
			type: 'SEND_CONTENT_BACKUP',
			contentBackup,
			clientId: clientId || getSelectedBlockClientId(),
		};
	},
	removeContentBackup(clientId) {
		return {
			type: 'REMOVE_CONTENT_BACKUP',
			clientId: clientId || getSelectedBlockClientId(),
		};
	},
};
export default actions;
