/**
 * WordPress dependencies
 */

const actions = {
	getMaxiBlocksSavedStyles() {
		return {
			type: 'GET_MAXI_BLOCKS_SAVED_STYLES',
		};
	},
	setMaxiBlocksSavedStyles(styles) {
		return {
			type: 'SET_MAXI_BLOCKS_SAVED_STYLES',
			styles,
		};
	},
};

export default actions;
