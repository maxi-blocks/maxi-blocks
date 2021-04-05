/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

const actions = {
	receiveMaxiBreakpoints() {
		return {
			type: 'RECEIVE_BREAKPOINTS',
		};
	},
	sendMaxiMotionPresets(presets) {
		return {
			type: 'SEND_MOTION_PRESETS',
			presets,
		};
	},
	receiveMaxiMotionPresets() {
		return {
			type: 'RECEIVE_MOTION_PRESETS',
		};
	},
	saveMaxiMotionPresets(presets) {
		return {
			type: 'SAVE_MOTION_PRESETS',
			presets,
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
		const {
			__experimentalSetPreviewDeviceType: setPreviewDeviceType,
		} = dispatch('core/edit-post');

		const gutenbergDeviceType =
			(deviceType === 'general' && 'Desktop') ||
			(width >= 1024 && 'Desktop') ||
			(width >= 768 && 'Tablet') ||
			(width < 768 && 'Mobile');

		setPreviewDeviceType(gutenbergDeviceType);

		return {
			type: 'SET_DEVICE_TYPE',
			deviceType,
		};
	},
	copyStyles(copiedStyles) {
		return {
			type: 'COPY_STYLES',
			copiedStyles,
		};
	},
};
export default actions;
