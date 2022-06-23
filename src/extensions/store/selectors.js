/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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
	},
	receiveWinBreakpoint(state) {
		if (!state) return false;

		const winWidth = state?.settings?.window?.width ?? window.innerWidth;

		const breakpoints = !isEmpty(state.breakpoints)
			? state.breakpoints
			: {
					xs: 480,
					s: 767,
					m: 1024,
					l: 1366,
					xl: 1920,
			  };

		if (winWidth > breakpoints.xl) return 'xxl';

		// Objects are unordered collection of properties, so as we can't rely on
		// its own order, we need to iterate over an ordered array
		const getBreakpointRange = (obj, minWidth) => {
			let result;

			['xl', 'l', 'm', 's', 'xs'].forEach(breakpoint => {
				if (obj[breakpoint] >= minWidth) {
					result = breakpoint;
				}
			});

			return result;
		};

		return getBreakpointRange(breakpoints, winWidth);
	},
};

export default selectors;
