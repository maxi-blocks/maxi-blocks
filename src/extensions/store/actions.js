/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

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
	setMaxiDeviceType({ deviceType, width, isGutenbergButton = false }) {
		if (!isGutenbergButton) {
			const { __experimentalSetPreviewDeviceType: setPreviewDeviceType } =
				dispatch('core/edit-post');

			const breakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

			const gutenbergDeviceType =
				(deviceType === 'general' && 'Desktop') ||
				(width >= breakpoints.m && 'Desktop') ||
				(width >= breakpoints.s && 'Tablet') ||
				(width < breakpoints.s && 'Mobile');

			if (gutenbergDeviceType) setPreviewDeviceType(gutenbergDeviceType);
		}

		return {
			type: 'SET_DEVICE_TYPE',
			deviceType,
			width,
			isGutenbergButton,
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
	saveDeprecatedBlock({ uniqueID, attributes }) {
		return {
			type: 'SAVE_DEPRECATED_BLOCK',
			uniqueID,
			attributes,
		};
	},
	removeDeprecatedBlock(uniqueID) {
		return {
			type: 'REMOVE_DEPRECATED_BLOCK',
			uniqueID,
		};
	},
};
export default actions;
