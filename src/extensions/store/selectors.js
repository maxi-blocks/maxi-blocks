/**
 * Internal dependencies
 */
import { getBreakpointFromWidth } from '../styles';
import { getIsSiteEditor } from '../fse';

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

		return getBreakpointFromWidth(breakpoints, editorContentWidth);
	},
};

export default selectors;
