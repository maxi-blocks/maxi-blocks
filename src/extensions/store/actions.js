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
		};
	},
	setWindowSize(winSize) {
		return {
			type: 'SET_WINDOW_SIZE',
			winSize,
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
};
export default actions;
