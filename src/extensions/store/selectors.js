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
		if (state && state.settings?.editorContent?.width) {
			const { width: editorContentWidth } = state.settings.editorContent;

			return editorContentWidth >= state.breakpoints.xl
				? editorContentWidth
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
	receiveBaseBreakpoint(state) {
		if (!state) return false;

		const editorContentWidth = state?.settings?.editorContent?.width;

		if (!editorContentWidth) return false;

		const breakpoints = !isEmpty(state.breakpoints)
			? state.breakpoints
			: {
					xs: 480,
					s: 767,
					m: 1024,
					l: 1366,
					xl: 1920,
			  };

		if (editorContentWidth > breakpoints.xl) return 'xxl';

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

		return getBreakpointRange(breakpoints, editorContentWidth);
	},
	receiveDeprecatedBlock(state, uniqueID) {
		if (state) return state.deprecatedBlocks?.[uniqueID] ?? null;

		return false;
	},
};

export default selectors;
