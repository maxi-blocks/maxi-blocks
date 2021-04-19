const actions = {
	receiveFormatValue() {
		return {
			type: 'RECEIVE_FORMAT_VALUE',
		};
	},
	sendFormatValue(formatValue) {
		return {
			type: 'SEND_FORMAT_VALUE',
			formatValue,
		};
	},
};
export default actions;
