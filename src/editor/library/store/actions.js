/**
 * Actions
 */
const actions = {
	receiveMaxiCloudLibrary(type) {
		return {
			type: 'RECEIVE_CLOUD_LIBRARY',
			objType: type,
		};
	},
	sendMaxiCloudLibrary(cloudLibrary, objType) {
		return {
			type: 'SEND_CLOUD_LIBRARY',
			cloudLibrary,
			objType,
		};
	},
};

export default actions;
