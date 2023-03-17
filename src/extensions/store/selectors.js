/**
 * Internal dependencies
 */
import getWinBreakpoint from '../dom/getWinBreakpoint';

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

		return getWinBreakpoint(editorContentWidth, state.breakpoints);
	},
	receiveDeprecatedBlock(state, uniqueID) {
		if (state) return state.deprecatedBlocks?.[uniqueID] ?? null;

		return false;
	},
	canBlockRender(state, uniqueID) {
		if (state)
			return (
				state.isPageLoaded ||
				state.blocksToRender.indexOf(uniqueID) === 0
			);

		return false;
	},
	allBlocksHaveBeenRendered(state) {
		if (state) return state.blocksToRender.length === 0;

		return false;
	},
	getIsPageLoaded(state) {
		if (state) return state.isPageLoaded;

		return false;
	},
};

export default selectors;
