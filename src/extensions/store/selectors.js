/**
 * External dependencies
 */
import { isEmpty, inRange } from 'lodash';

const selectors = {
	receiveMaxiSettings(state) {
		if (state) return state.settings;
		return false;
	},
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
	receiveXXLSize(state) {
		if (state && state.settings?.window?.width) {
			const { width: winWidth } = state.settings.window;

			return winWidth >= state.breakpoints.xl
				? winWidth
				: state.breakpoints.xl + 1;
		}

		return false;
	},
	receiveCopiedStyles(state) {
		if (state) return state.copiedStyles;
		return false;
	},
	receiveCopiedBlocks(state) {
		if (state) return state.copiedBlocks;
		return false;
	},
	receiveInspectorPath(state) {
		if (state) return state.inspectorPath;
		return false;
	},
	receiveTabsPath(state) {
		if (state) return state.tabsPath;
		return false;
	receiveWinBreakpoint(state) {
		if (!state) return false;

		const winWidth = state?.settings?.window?.width ?? window.innerWidth;

		const breakpoints = !isEmpty(state.breakpoints)
			? state.breakpoints
			: {
					xs: 480,
					s: 768,
					m: 1024,
					l: 1366,
					xl: 1920,
			  };

		if (winWidth > breakpoints.xl) return 'xxl';

		return Object.entries(breakpoints)
			.reduce(([prevKey, prevValue], [currKey, currValue]) => {
				if (!prevValue) return [prevKey];
				if (inRange(winWidth, prevValue, currValue + 1))
					return [currKey];

				return [prevKey, prevValue];
			})[0]
			.toLowerCase();
	},
};

export default selectors;
