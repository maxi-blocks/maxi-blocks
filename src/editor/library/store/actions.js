import controls from './controls';

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
	async requestMaxiCloudLibrary(search = null) {
		const newContent = await controls.REQUEST_CLOUD_LIBRARY({
			search,
		});

		return {
			type: 'REQUEST_CLOUD_LIBRARY',
			newContent,
			objType: search.type,
		};
	},
	receiveCloudCategories() {
		return {
			type: 'RECEIVE_LIBRARY_CAT',
		};
	},
	sendCloudCategories(cloudCat) {
		return {
			type: 'SEND_LIBRARY_CAT',
			cloudCat,
		};
	},
};

export default actions;
