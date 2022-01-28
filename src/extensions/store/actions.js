/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

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
	setMaxiDeviceType(deviceType, width) {
		const { __experimentalSetPreviewDeviceType: setPreviewDeviceType } =
			dispatch('core/edit-post');

		const gutenbergDeviceType =
			(deviceType === 'general' && 'Desktop') ||
			(width >= 1024 && 'Desktop') ||
			(width >= 768 && 'Tablet') ||
			(width < 768 && 'Mobile');

		setPreviewDeviceType(gutenbergDeviceType);

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
};
export default actions;
