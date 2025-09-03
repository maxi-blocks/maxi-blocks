/**
 * Internal dependencies
 */
import getWinBreakpoint from '@extensions/dom/getWinBreakpoint';

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
	receiveDeprecatedBlock(state, uniqueID, isSave = false) {
		if (state)
			return isSave
				? state.deprecatedBlocksSave?.[uniqueID] || {}
				: state.deprecatedBlocks?.[uniqueID] || {};

		return false;
	},
	canBlockRender(state, uniqueID) {
		if (state) {
			const { isPageLoaded } = state;
			const blocksToRender = state.blocksToRender || [];
			const isFirstInQueue = blocksToRender.indexOf(uniqueID) === 0;
			const canRender = isPageLoaded || isFirstInQueue;

			return canRender;
		}

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
	getIsIframeObserverSet(state) {
		if (state) return state.isIframeObserverSet;

		return false;
	},
};

export default selectors;
