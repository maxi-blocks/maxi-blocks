import actions from './actions';

const resolvers = {
	*receiveMaxiSettings() {
		const maxiSettings = yield actions.receiveMaxiSettings();
		return actions.sendMaxiSettings(maxiSettings);
	},
	*receiveMaxiBreakpoints() {
		const maxiBreakpoints = yield actions.receiveMaxiBreakpoints();
		return actions.sendMaxiBreakpoints(maxiBreakpoints);
	},
	*receiveMaxiMotionPresets() {
		const maxiMotionPresets = yield actions.receiveMaxiMotionPresets();
		return actions.sendMaxiMotionPresets(maxiMotionPresets);
	},
	*receiveMaxiDeviceType() {
		const maxiDeviceType = yield actions.receiveMaxiDeviceType();
		return actions.sendMaxiDeviceType(maxiDeviceType);
	},
	*receiveMaxiUniqueID(blockName) {
		const maxiUniqueID = yield actions.receiveMaxiUniqueID(blockName);
		console.log('maxiUniqueID', maxiUniqueID);
		console.log(actions.sendMaxiUniqueID(maxiUniqueID));
		console.log('=========================');
		return actions.sendMaxiUniqueID(maxiUniqueID);
	},
};

export default resolvers;
