/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const { getSelectedBlockClientId } = select('core/block-editor');

const actions = {
	sendFormatValue(formatValue, clientId) {
		return {
			type: 'SEND_FORMAT_VALUE',
			formatValue,
			clientId: clientId || getSelectedBlockClientId(),
		};
	},
	removeFormatValue(clientId) {
		return {
			type: 'REMOVE_FORMAT_VALUE',
			clientId: clientId || getSelectedBlockClientId(),
		};
	},
	updateFonts(fonts) {
		return {
			type: 'UPDATE_FONTS',
			fonts,
		};
	},
};
export default actions;
