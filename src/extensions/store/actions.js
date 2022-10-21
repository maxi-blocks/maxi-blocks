/**
 * WordPress dependencies
 */
import { dispatch, resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getIsSiteEditor } from '../fse';
import getWinBreakpoint from '../dom/getWinBreakpoint';

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
	async setMaxiDeviceType({
		deviceType: rawDeviceType,
		width,
		isGutenbergButton = false,
		changeSize = true,
	}) {
		const breakpoints = await resolveSelect(
			'maxiBlocks'
		).receiveMaxiBreakpoints();

		const deviceType =
			rawDeviceType ?? getWinBreakpoint(width, breakpoints);

		if (!isGutenbergButton) {
			const {
				__experimentalSetPreviewDeviceType: setPostPreviewDeviceType,
			} = dispatch('core/edit-post');

			const isSiteEditor = getIsSiteEditor();

			const setPreviewDeviceType = isSiteEditor
				? dispatch('core/edit-site').__experimentalSetPreviewDeviceType
				: setPostPreviewDeviceType;

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
