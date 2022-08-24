/**
 * WordPress dependencies
 */
import { dispatch, select, resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getIsSiteEditor } from '../fse';
import { getBreakpointFromWidth } from '../styles';

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
		ignoreMaxiBlockResponsiveWidth = false,
	}) {
		const breakpoints = await resolveSelect(
			'maxiBlocks'
		).receiveMaxiBreakpoints();

		const deviceType =
			rawDeviceType ?? getBreakpointFromWidth(width, breakpoints);

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

		const { receiveWinBreakpoint } = select('maxiBlocks');
		const winBreakpoint = receiveWinBreakpoint();

		return {
			type: 'SET_DEVICE_TYPE',
			deviceType,
			winBreakpoint,
			ignoreMaxiBlockResponsiveWidth,
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
