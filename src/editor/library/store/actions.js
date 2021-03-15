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
	receiveMaxiCloudInfo() {
		return {
			type: 'RECEIVE_CLOUD_INFO',
		};
	},
	sendMaxiCloudInfo(cloudInfo) {
		return {
			type: 'SEND_CLOUD_INFO',
			cloudInfo,
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
	async receiveMaxiCloudSearchItems(search = null) {
		const searchItems = await controls.REQUEST_CLOUD_LIBRARY_NUM({
			search,
		});

		return {
			type: 'REQUEST_CLOUD_LIBRARY_NUM',
			searchItems,
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
