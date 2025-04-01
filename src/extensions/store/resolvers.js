/**
 * Internal dependencies
 */
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
};

export default resolvers;
