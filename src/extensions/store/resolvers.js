import actions from './actions';

const resolvers = {
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
