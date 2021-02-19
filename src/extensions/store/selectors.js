const selectors = {
	receiveMaxiBreakpoints(state) {
		if (state) return state.breakpoints;
		return false;
	},
	receiveMaxiMotionPresets(state) {
		if (state) return state.presets;
		return false;
	},
	receiveMaxiDeviceType(state) {
		if (state) return state.deviceType;
		return false;
	},
	receiveCopiedStyles(state) {
		if (state) return state.copiedStyles;
		return false;
	},
};

export default selectors;
