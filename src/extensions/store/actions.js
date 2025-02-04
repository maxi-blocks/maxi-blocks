/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getIsSiteEditor } from '@extensions/fse';
import getWinBreakpoint from '@extensions/dom/getWinBreakpoint';

const actions = {
	receiveMaxiSettings() {
		return {
			type: 'RECEIVE_GENERAL_SETTINGS',
		};
	},
	receiveMaxiBreakpoints() {
		return {
			type: 'RECEIVE_BREAKPOINTS',
		};
	},
	sendMaxiSettings(settings) {
		return {
			type: 'SEND_GLOBAL_SETTINGS',
			settings,
		};
	},
	saveMaxiSetting(setting, value) {
		return {
			type: 'SAVE_GENERAL_SETTING',
			setting,
			value,
		};
	},
	sendMaxiBreakpoints(breakpoints) {
		return {
			type: 'SEND_BREAKPOINTS',
			breakpoints,
		};
	},
	receiveMaxiDeviceType() {
		return {
			type: 'RECEIVE_DEVICE_TYPE',
		};
	},
	sendMaxiDeviceType(deviceType) {
		return {
			type: 'SEND_DEVICE_TYPE',
			deviceType,
		};
	},
	setMaxiDeviceType({
		deviceType: rawDeviceType,
		width,
		isGutenbergButton = false,
		changeSize = true,
	}) {
		const { receiveBaseBreakpoint, receiveMaxiBreakpoints } =
			select('maxiBlocks');
		const breakpoints = receiveMaxiBreakpoints();

		const getDeviceType = () => {
			if (rawDeviceType) {
				return rawDeviceType;
			}
			const winBreakpoint = getWinBreakpoint(width, breakpoints);
			const baseBreakpoint = receiveBaseBreakpoint();
			if (winBreakpoint === baseBreakpoint) {
				return 'general';
			}
			return winBreakpoint;
		};
		const deviceType = getDeviceType();

		if (!isGutenbergButton) {
			const setPreviewDeviceType = deviceType => {
				// First, try to use the new preferred method if it exists
				if (
					dispatch('core/editor') &&
					dispatch('core/editor').setDeviceType
				) {
					dispatch('core/editor').setDeviceType(deviceType);
				} else {
					// Determine if we are in the site editor or post editor as a fallback
					const isSiteEditor = getIsSiteEditor(); // Ensure you have implemented this check
					const editorStore = isSiteEditor
						? 'core/edit-site'
						: 'core/edit-post';

					// Check and call the deprecated method if available
					const storeDispatch = dispatch(editorStore);
					if (storeDispatch.__experimentalSetPreviewDeviceType) {
						storeDispatch.__experimentalSetPreviewDeviceType(
							deviceType
						);
					} else {
						console.error(
							__(
								'Unable to set the preview device type. The required method is not available.',
								'maxi-blocks'
							)
						);
					}
				}
			};

			setPreviewDeviceType('Desktop');
		}

		return {
			type: 'SET_DEVICE_TYPE',
			deviceType,
			isGutenbergButton,
			changeSize,
		};
	},
	setEditorContentSize(editorContentSize) {
		return {
			type: 'SET_EDITOR_CONTENT_SIZE',
			editorContentSize,
		};
	},
	copyStyles(copiedStyles) {
		return {
			type: 'COPY_STYLES',
			copiedStyles,
		};
	},
	copyNestedBlocks(copiedBlocks) {
		return {
			type: 'COPY_BLOCKS',
			copiedBlocks,
		};
	},
	updateInspectorPath(inspectorPath) {
		return {
			type: 'UPDATE_INSPECTOR_PATH',
			inspectorPath,
		};
	},
	saveDeprecatedBlock({ uniqueID, attributes, ignoreAttributesForSave }) {
		return {
			type: 'SAVE_DEPRECATED_BLOCK',
			uniqueID,
			attributes,
			ignoreAttributesForSave,
		};
	},
	removeDeprecatedBlock(uniqueID) {
		return {
			type: 'REMOVE_DEPRECATED_BLOCK',
			uniqueID,
		};
	},
	blockHasBeenRendered(uniqueID) {
		return {
			type: 'BLOCK_HAS_BEEN_RENDERED',
			uniqueID,
		};
	},
	removeBlockHasBeenRendered(uniqueID, clientId) {
		return {
			type: 'REMOVE_BLOCK_HAS_BEEN_RENDERED',
			uniqueID,
			clientId,
		};
	},
	setIsPageLoaded(isPageLoaded = true) {
		return {
			type: 'SET_IS_PAGE_LOADED',
			isPageLoaded,
		};
	},
	setIsIframeObserverSet(isIframeObserverSet = true) {
		return {
			type: 'SET_IS_IFRAME_OBSERVER_SET',
			isIframeObserverSet,
		};
	},
};
export default actions;
