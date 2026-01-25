/**
 * Video Logic Handler for AI Chat Panel
 * Handles video-specific attributes.
 */

import { getParsedVideoUrl, parseVideo } from '@extensions/video';

const VIDEO_PROPERTY_ALIASES = {
	videoUrl: 'video_url',
	video_url: 'video_url',
	url: 'video_url',
	videoType: 'video_type',
	video_type: 'video_type',
	autoplay: 'video_autoplay',
	loop: 'video_loop',
	muted: 'video_muted',
	showControls: 'video_controls',
	videoControls: 'video_controls',
	video_controls: 'video_controls',
	startTime: 'video_start',
	endTime: 'video_end',
	video_start: 'video_start',
	video_end: 'video_end',
	aspectRatio: 'video_ratio',
	videoRatio: 'video_ratio',
	video_ratio: 'video_ratio',
	videoRatioCustom: 'video_ratio_custom',
	video_ratio_custom: 'video_ratio_custom',
	popupRatio: 'popup_ratio',
	popup_ratio: 'popup_ratio',
	popupRatioCustom: 'popup_ratio_custom',
	popup_ratio_custom: 'popup_ratio_custom',
	playerType: 'player_type',
	player_type: 'player_type',
	enableLightbox: 'enable_lightbox',
	lightboxTrigger: 'lightbox_trigger',
	overlayColor: 'overlay_color',
	'overlay-color': 'overlay_color',
	overlayOpacity: 'overlay_opacity',
	'overlay-opacity-general': 'overlay_opacity',
	overlay_opacity: 'overlay_opacity',
	overlayColorHover: 'overlay_color_hover',
	overlay_color_hover: 'overlay_color_hover',
	overlayOpacityHover: 'overlay_opacity_hover',
	overlay_opacity_hover: 'overlay_opacity_hover',
	overlayMediaUrl: 'overlay_media_url',
	overlay_media_url: 'overlay_media_url',
	overlayMediaId: 'overlay_media_id',
	overlay_media_id: 'overlay_media_id',
	overlayMediaWidth: 'overlay_media_width',
	overlay_media_width: 'overlay_media_width',
	overlayMediaWidthUnit: 'overlay_media_width_unit',
	overlay_media_width_unit: 'overlay_media_width_unit',
	overlayMediaHeight: 'overlay_media_height',
	overlay_media_height: 'overlay_media_height',
	overlayMediaHeightUnit: 'overlay_media_height_unit',
	overlay_media_height_unit: 'overlay_media_height_unit',
	overlayMediaOpacity: 'overlay_media_opacity',
	overlay_media_opacity: 'overlay_media_opacity',
	overlayHideImage: 'overlay_hide_image',
	overlay_hide_image: 'overlay_hide_image',
	lightboxColor: 'lightbox_color',
	'lightbox-color': 'lightbox_color',
	lightboxOpacity: 'lightbox_opacity',
	'lightbox-opacity-general': 'lightbox_opacity',
	lightbox_opacity: 'lightbox_opacity',
	popupAnimation: 'popup_animation',
	popup_animation: 'popup_animation',
	popupAnimationDuration: 'popup_animation_duration',
	popup_animation_duration: 'popup_animation_duration',
	popupAnimationDurationUnit: 'popup_animation_duration_unit',
	popup_animation_duration_unit: 'popup_animation_duration_unit',
	videoBorder: 'video_border',
	video_border: 'video_border',
	videoBorderRadius: 'video_border_radius',
	video_border_radius: 'video_border_radius',
	videoBoxShadow: 'video_box_shadow',
	video_box_shadow: 'video_box_shadow',
	videoWidth: 'video_width',
	video_width: 'video_width',
	videoHeight: 'video_height',
	video_height: 'video_height',
	videoMinWidth: 'video_min_width',
	video_min_width: 'video_min_width',
	videoMaxWidth: 'video_max_width',
	video_max_width: 'video_max_width',
	videoMinHeight: 'video_min_height',
	video_min_height: 'video_min_height',
	videoMaxHeight: 'video_max_height',
	video_max_height: 'video_max_height',
	videoPadding: 'video_padding',
	video_padding: 'video_padding',
	videoPaddingTop: 'video_padding_top',
	video_padding_top: 'video_padding_top',
	videoPaddingRight: 'video_padding_right',
	video_padding_right: 'video_padding_right',
	videoPaddingBottom: 'video_padding_bottom',
	video_padding_bottom: 'video_padding_bottom',
	videoPaddingLeft: 'video_padding_left',
	video_padding_left: 'video_padding_left',
	playIconColor: 'play_icon_color',
	play_icon_color: 'play_icon_color',
	playIconColorHover: 'play_icon_color_hover',
	play_icon_color_hover: 'play_icon_color_hover',
	playIconSize: 'play_icon_size',
	play_icon_size: 'play_icon_size',
	playIconSizeUnit: 'play_icon_size_unit',
	play_icon_size_unit: 'play_icon_size_unit',
	closeIconColor: 'close_icon_color',
	close_icon_color: 'close_icon_color',
	closeIconColorHover: 'close_icon_color_hover',
	close_icon_color_hover: 'close_icon_color_hover',
	closeIconSize: 'close_icon_size',
	close_icon_size: 'close_icon_size',
	closeIconSizeUnit: 'close_icon_size_unit',
	close_icon_size_unit: 'close_icon_size_unit',
	closeIconPosition: 'close_icon_position',
	close_icon_position: 'close_icon_position',
	closeIconSpacing: 'close_icon_spacing',
	close_icon_spacing: 'close_icon_spacing',
	closeIconSpacingUnit: 'close_icon_spacing_unit',
	close_icon_spacing_unit: 'close_icon_spacing_unit',
};

const normalizeBoolean = value => {
	if (typeof value === 'boolean') return value;
	if (value === null || value === undefined) return null;
	const normalized = String(value).trim().toLowerCase();
	if (['true', 'yes', 'on', '1'].includes(normalized)) return true;
	if (['false', 'no', 'off', '0'].includes(normalized)) return false;
	return Boolean(value);
};

const clamp = (value, min, max) => {
	const numeric = Number(value);
	if (Number.isNaN(numeric)) return min;
	return Math.min(Math.max(numeric, min), max);
};

const parseRatioValue = rawValue => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	const normalized = String(rawValue).trim().toLowerCase();

	if (normalized.startsWith('custom:')) {
		return { ratio: 'custom', custom: normalized.replace('custom:', '') };
	}

	if (['ar11', 'ar23', 'ar32', 'ar43', 'ar169', 'initial', 'custom'].includes(normalized)) {
		return { ratio: normalized };
	}

	if (normalized.includes('/') || normalized.includes('.')) {
		return { ratio: 'custom', custom: normalized };
	}

	return { ratio: normalized };
};

const toNumberOrNull = value => {
	if (value === undefined || value === null || value === '') return null;
	const parsed = Number.parseFloat(value);
	return Number.isNaN(parsed) ? null : parsed;
};

const applyOpacityToColor = (color, opacity) => {
	if (!color) return color;
	const alpha = clamp(opacity, 0, 1);
	const normalized = String(color).trim();

	const hexMatch = normalized.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
	if (hexMatch) {
		const hex = hexMatch[1];
		const expand = str => str.split('').map(ch => ch + ch).join('');
		const fullHex = hex.length <= 4 ? expand(hex) : hex;
		const r = parseInt(fullHex.slice(0, 2), 16);
		const g = parseInt(fullHex.slice(2, 4), 16);
		const b = parseInt(fullHex.slice(4, 6), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	const rgbMatch = normalized.match(/^rgb\s*\(\s*([^)]+)\s*\)$/i);
	if (rgbMatch) {
		const parts = rgbMatch[1].split(',').map(part => Number(part.trim()));
		if (parts.length >= 3 && parts.every(n => !Number.isNaN(n))) {
			return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
		}
	}

	const rgbaMatch = normalized.match(/^rgba\s*\(\s*([^)]+)\s*\)$/i);
	if (rgbaMatch) {
		const parts = rgbaMatch[1].split(',').map(part => part.trim());
		if (parts.length >= 4) {
			const rgbParts = parts.slice(0, 3).map(part => Number(part));
			if (rgbParts.every(n => !Number.isNaN(n))) {
				return `rgba(${rgbParts[0]}, ${rgbParts[1]}, ${rgbParts[2]}, ${alpha})`;
			}
		}
	}

	return normalized;
};

const buildPaletteColorChanges = (prefixKey, colorValue, opacityValue) => {
	const changes = {
		[`${prefixKey}background-active-media-general`]: 'color',
	};
	const hasOpacity = opacityValue !== undefined && opacityValue !== null && opacityValue !== '';

	if (typeof colorValue === 'number') {
		changes[`${prefixKey}background-palette-status-general`] = true;
		changes[`${prefixKey}background-palette-color-general`] = colorValue;
		changes[`${prefixKey}background-color-general`] = '';
		if (hasOpacity) {
			changes[`${prefixKey}background-palette-opacity-general`] = clamp(opacityValue, 0, 1);
		}
		return changes;
	}

	if (typeof colorValue === 'string') {
		changes[`${prefixKey}background-palette-status-general`] = false;
		changes[`${prefixKey}background-color-general`] = hasOpacity
			? applyOpacityToColor(colorValue, opacityValue)
			: colorValue;
		return changes;
	}

	return null;
};

const buildPaletteOpacityChanges = (attributes, prefixKey, opacityValue) => {
	const opacity = clamp(opacityValue, 0, 1);
	const paletteStatus = attributes?.[`${prefixKey}background-palette-status-general`];
	const colorValue = attributes?.[`${prefixKey}background-color-general`];

	if (paletteStatus) {
		return { [`${prefixKey}background-palette-opacity-general`]: opacity };
	}

	if (colorValue) {
		return { [`${prefixKey}background-color-general`]: applyOpacityToColor(colorValue, opacity) };
	}

	return { [`${prefixKey}background-palette-opacity-general`]: opacity };
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue && typeof rawValue === 'object' && rawValue.value !== undefined) {
		const unit = rawValue.unit || fallbackUnit;
		return { value: rawValue.value, unit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	const normalized = String(rawValue ?? '').trim();
	if (!normalized) return { value: 0, unit: fallbackUnit };

	const match = normalized.match(/^(-?\d+(?:\.\d+)?)([a-z%]*)$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(normalized);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const buildPaletteColorHoverChanges = (prefixKey, colorValue, opacityValue) => {
	const changes = {
		[`${prefixKey}background-active-media-general-hover`]: 'color',
		[`${prefixKey}background-status-hover`]: true,
	};
	const hasOpacity = opacityValue !== undefined && opacityValue !== null && opacityValue !== '';

	if (typeof colorValue === 'number') {
		changes[`${prefixKey}background-palette-status-general-hover`] = true;
		changes[`${prefixKey}background-palette-color-general-hover`] = colorValue;
		changes[`${prefixKey}background-color-general-hover`] = '';
		if (hasOpacity) {
			changes[`${prefixKey}background-palette-opacity-general-hover`] = clamp(opacityValue, 0, 1);
		}
		return changes;
	}

	if (typeof colorValue === 'string') {
		changes[`${prefixKey}background-palette-status-general-hover`] = false;
		changes[`${prefixKey}background-color-general-hover`] = hasOpacity
			? applyOpacityToColor(colorValue, opacityValue)
			: colorValue;
		return changes;
	}

	return null;
};

const buildPaletteOpacityHoverChanges = (attributes, prefixKey, opacityValue) => {
	const opacity = clamp(opacityValue, 0, 1);
	const paletteStatus = attributes?.[`${prefixKey}background-palette-status-general-hover`];
	const colorValue = attributes?.[`${prefixKey}background-color-general-hover`];

	const changes = {
		[`${prefixKey}background-status-hover`]: true,
	};

	if (paletteStatus) {
		changes[`${prefixKey}background-palette-opacity-general-hover`] = opacity;
		return changes;
	}

	if (colorValue) {
		changes[`${prefixKey}background-color-general-hover`] = applyOpacityToColor(colorValue, opacity);
		return changes;
	}

	changes[`${prefixKey}background-palette-opacity-general-hover`] = opacity;
	return changes;
};

const buildIconFillChanges = (prefixKey, colorValue, opacityValue, isHover = false) => {
	if (colorValue === undefined || colorValue === null || colorValue === '') return null;
	const suffix = isHover ? '-hover' : '';
	const changes = {};

	if (isHover) {
		changes[`${prefixKey}icon-status-hover`] = true;
	}

	if (typeof colorValue === 'number') {
		changes[`${prefixKey}icon-fill-palette-status${suffix}`] = true;
		changes[`${prefixKey}icon-fill-palette-color${suffix}`] = colorValue;
		if (opacityValue !== undefined && opacityValue !== null && opacityValue !== '') {
			changes[`${prefixKey}icon-fill-palette-opacity${suffix}`] = clamp(opacityValue, 0, 1);
		}
		changes[`${prefixKey}icon-fill-color${suffix}`] = '';
		return changes;
	}

	if (typeof colorValue === 'string') {
		changes[`${prefixKey}icon-fill-palette-status${suffix}`] = false;
		changes[`${prefixKey}icon-fill-color${suffix}`] = colorValue;
		return changes;
	}

	return null;
};

const buildIconSizeChanges = (prefixKey, rawValue, unitValue, isHover = false) => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	const parsed = parseUnitValue(rawValue, unitValue || 'px');
	const suffix = isHover ? '-hover' : '';

	return {
		[`${prefixKey}icon-height-general${suffix}`]: parsed.value,
		[`${prefixKey}icon-height-unit-general${suffix}`]: parsed.unit,
		[`${prefixKey}icon-width-general${suffix}`]: parsed.value,
		[`${prefixKey}icon-width-unit-general${suffix}`]: parsed.unit,
	};
};

const buildIconSpacingChanges = (prefixKey, rawValue, unitValue) => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	const parsed = parseUnitValue(rawValue, unitValue || 'px');
	return {
		[`${prefixKey}icon-spacing-general`]: parsed.value,
		[`${prefixKey}icon-spacing-unit-general`]: parsed.unit,
	};
};

const buildOverlayMediaSizeChanges = (property, rawValue, unitValue) => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	const parsed = parseUnitValue(rawValue, unitValue || '%');
	return {
		[`overlay-media-${property}-general`]: parsed.value,
		[`overlay-media-${property}-unit-general`]: parsed.unit,
	};
};

const buildOverlayMediaOpacityChanges = rawValue => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	return { 'overlay-media-opacity-general': clamp(rawValue, 0, 1) };
};

const buildVideoPaddingChanges = (side, rawValue, unitValue) => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	const parsed = parseUnitValue(rawValue, unitValue || 'px');

	if (side === 'all') {
		return {
			'video-padding-top-general': String(parsed.value),
			'video-padding-right-general': String(parsed.value),
			'video-padding-bottom-general': String(parsed.value),
			'video-padding-left-general': String(parsed.value),
			'video-padding-top-unit-general': parsed.unit,
			'video-padding-right-unit-general': parsed.unit,
			'video-padding-bottom-unit-general': parsed.unit,
			'video-padding-left-unit-general': parsed.unit,
			'video-padding-sync-general': 'all',
		};
	}

	const key = `video-padding-${side}-general`;
	const unitKey = `video-padding-${side}-unit-general`;

	return {
		[key]: String(parsed.value),
		[unitKey]: parsed.unit,
		'video-padding-sync-general': 'none',
	};
};

const buildVideoSizeChanges = (property, rawValue) => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	const parsed = parseUnitValue(rawValue, 'px');
	return {
		[`video-${property}-general`]: String(parsed.value),
		[`video-${property}-unit-general`]: parsed.unit,
	};
};

const parseAnimationDuration = rawValue => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: null };
	}

	const normalized = String(rawValue).trim();
	if (!normalized) return null;

	const match = normalized.match(/^(-?\d+(?:\.\d+)?)(ms|s)$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] };
	}

	const parsed = Number.parseFloat(normalized);
	if (Number.isNaN(parsed)) return null;
	return { value: parsed, unit: null };
};

const buildVideoBorderRadiusChanges = (prefixKey, rawValue) => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	const valueString = String(rawValue).trim();
	const unit = valueString.includes('%') ? '%' : 'px';
	const numericValue = Number.parseFloat(valueString.replace('%', ''));
	if (Number.isNaN(numericValue)) return null;

	return {
		[`${prefixKey}border-top-left-radius-general`]: numericValue,
		[`${prefixKey}border-top-right-radius-general`]: numericValue,
		[`${prefixKey}border-bottom-right-radius-general`]: numericValue,
		[`${prefixKey}border-bottom-left-radius-general`]: numericValue,
		[`${prefixKey}border-sync-radius-general`]: 'all',
		[`${prefixKey}border-unit-radius-general`]: unit,
	};
};

const buildVideoBorderChanges = (prefixKey, rawValue) => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	if (rawValue === 'none' || rawValue === 'remove') {
		return {
			[`${prefixKey}border-style-general`]: 'none',
			[`${prefixKey}border-top-width-general`]: 0,
			[`${prefixKey}border-bottom-width-general`]: 0,
			[`${prefixKey}border-left-width-general`]: 0,
			[`${prefixKey}border-right-width-general`]: 0,
			[`${prefixKey}border-sync-width-general`]: 'all',
			[`${prefixKey}border-unit-width-general`]: 'px',
		};
	}

	let width = 1;
	let style = 'solid';
	let color = '';

	if (typeof rawValue === 'string') {
		const parts = rawValue.trim().split(/\s+/);
		if (parts.length >= 3) {
			width = Number.parseFloat(parts[0]);
			style = parts[1];
			color = parts.slice(2).join(' ');
		}
	} else if (typeof rawValue === 'object') {
		width = Number.parseFloat(rawValue.width);
		style = rawValue.style || style;
		color = rawValue.color ?? color;
	}

	if (Number.isNaN(width)) width = 1;
	const isPalette = typeof color === 'number';

	return {
		[`${prefixKey}border-style-general`]: style,
		[`${prefixKey}border-top-width-general`]: width,
		[`${prefixKey}border-bottom-width-general`]: width,
		[`${prefixKey}border-left-width-general`]: width,
		[`${prefixKey}border-right-width-general`]: width,
		[`${prefixKey}border-sync-width-general`]: 'all',
		[`${prefixKey}border-unit-width-general`]: 'px',
		[`${prefixKey}border-palette-status-general`]: isPalette,
		[`${prefixKey}border-palette-color-general`]: isPalette ? color : '',
		[`${prefixKey}border-color-general`]: isPalette ? '' : color,
	};
};

const buildVideoBoxShadowChanges = (prefixKey, rawValue) => {
	if (rawValue === undefined || rawValue === null || rawValue === '') return null;
	if (rawValue === 'none' || rawValue === 'remove') {
		return { [`${prefixKey}box-shadow-status-general`]: false };
	}

	if (typeof rawValue !== 'object') return null;

	const x = Number.parseFloat(rawValue.x ?? 0);
	const y = Number.parseFloat(rawValue.y ?? 0);
	const blur = Number.parseFloat(rawValue.blur ?? 0);
	const spread = Number.parseFloat(rawValue.spread ?? 0);
	const color = rawValue.color ?? '';
	const isPalette = typeof color === 'number';

	return {
		[`${prefixKey}box-shadow-status-general`]: true,
		[`${prefixKey}box-shadow-horizontal-general`]: Number.isNaN(x) ? 0 : x,
		[`${prefixKey}box-shadow-vertical-general`]: Number.isNaN(y) ? 0 : y,
		[`${prefixKey}box-shadow-blur-general`]: Number.isNaN(blur) ? 0 : blur,
		[`${prefixKey}box-shadow-spread-general`]: Number.isNaN(spread) ? 0 : spread,
		[`${prefixKey}box-shadow-inset-general`]: false,
		[`${prefixKey}box-shadow-palette-status-general`]: isPalette,
		[`${prefixKey}box-shadow-palette-color-general`]: isPalette ? color : '',
		[`${prefixKey}box-shadow-color-general`]: isPalette ? '' : color,
	};
};

export const VIDEO_PATTERNS = [
	{
		regex: /\bunmute\b|\bsound\s*on\b|\benable\s*sound\b|\bwith\s*sound\b/i,
		property: 'video_muted',
		value: false,
		selectionMsg: 'Unmuted the selected video.',
		pageMsg: 'Unmuted all videos on the page.',
		target: 'video',
	},
	{
		regex: /\bmute\b|\bsilence\b|\bno\s*sound\b|\bsound\s*off\b/i,
		property: 'video_muted',
		value: true,
		selectionMsg: 'Muted the selected video.',
		pageMsg: 'Muted all videos on the page.',
		target: 'video',
	},
	{
		regex: /border|frame|stroke|outline/i,
		property: 'flow_video_border',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'video',
	},
	{
		regex: /\bvideo\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\bvideo\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the video background?',
		pageMsg: 'Which colour for the video background?',
		target: 'video',
		colorTarget: 'video',
	},
];

export const handleVideoUpdate = (block, property, value, prefix, context = {}) => {
	const isVideo = block?.name?.includes('video');
	if (!isVideo) return null;

	const normalizedProperty = VIDEO_PROPERTY_ALIASES[property] || property;
	const videoPrefix = 'video-';

	switch (normalizedProperty) {
		case 'flow_video_border': {
			if (!context.border_color) {
				return { action: 'ask_palette', target: 'border_color', msg: 'Which colour for the video border?' };
			}
			if (!context.border_style) {
				return {
					action: 'ask_options',
					target: 'border_style',
					msg: 'Which border style?',
					options: [
						{ label: 'Solid Thin', value: 'solid-1px' },
						{ label: 'Solid Medium', value: 'solid-2px' },
						{ label: 'Solid Thick', value: 'solid-4px' },
						{ label: 'Dashed', value: 'dashed-2px' },
						{ label: 'Dotted', value: 'dotted-2px' },
					],
				};
			}

			const [styleRaw, widthRaw] = String(context.border_style || '').split('-');
			const style = styleRaw || 'solid';
			const width = Number.parseFloat(String(widthRaw || '1px').replace('px', ''));
			const color = context.border_color;

			const changes = buildVideoBorderChanges(videoPrefix, { width, style, color });
			if (!changes) return null;

			return { action: 'apply', attributes: changes, done: true, message: 'Applied border to the video.' };
		}
		case 'video_url': {
			const urlValue =
				typeof value === 'object' && value
					? value.url || value.videoUrl || value.video_url
					: value;
			if (!urlValue) return null;
			const nextUrl = String(urlValue).trim();
			const parsed = parseVideo(nextUrl);
			const nextValues = { url: nextUrl, videoType: parsed.type };
			return {
				...nextValues,
				embedUrl: getParsedVideoUrl({ ...block.attributes, ...nextValues }),
			};
		}
		case 'video_type': {
			if (!value) return null;
			const nextValues = { videoType: String(value).trim() };
			return {
				...nextValues,
				embedUrl: getParsedVideoUrl({ ...block.attributes, ...nextValues }),
			};
		}
		case 'video_start': {
			const nextStart = toNumberOrNull(value);
			const nextValues = { startTime: nextStart !== null ? String(nextStart) : '' };
			return {
				...nextValues,
				embedUrl: getParsedVideoUrl({ ...block.attributes, ...nextValues }),
			};
		}
		case 'video_end': {
			const nextEnd = toNumberOrNull(value);
			const nextValues = { endTime: nextEnd !== null ? String(nextEnd) : '' };
			return {
				...nextValues,
				embedUrl: getParsedVideoUrl({ ...block.attributes, ...nextValues }),
			};
		}
		case 'video_autoplay':
		case 'video_loop':
		case 'video_muted':
		case 'video_controls': {
			const nextValues = {};
			if (normalizedProperty === 'video_autoplay') nextValues.isAutoplay = normalizeBoolean(value);
			if (normalizedProperty === 'video_loop') nextValues.isLoop = normalizeBoolean(value);
			if (normalizedProperty === 'video_muted') nextValues.isMuted = normalizeBoolean(value);
			if (normalizedProperty === 'video_controls') nextValues.showPlayerControls = normalizeBoolean(value);
			return {
				...nextValues,
				embedUrl: getParsedVideoUrl({ ...block.attributes, ...nextValues }),
			};
		}
		case 'player_type': {
			if (!value) return null;
			return { playerType: String(value).trim() };
		}
		case 'enable_lightbox': {
			const enabled = normalizeBoolean(value);
			return { playerType: enabled ? 'popup' : 'video' };
		}
		case 'lightbox_trigger': {
			const trigger = String(value || '').trim().toLowerCase();
			if (!trigger) return null;
			return {
				playerType: 'popup',
				hideImage: trigger === 'button',
			};
		}
		case 'video_ratio': {
			const ratioValue = parseRatioValue(value);
			if (!ratioValue) return null;
			return {
				videoRatio: ratioValue.ratio,
				...(ratioValue.custom ? { videoRatioCustom: ratioValue.custom } : {}),
			};
		}
		case 'video_ratio_custom':
			if (!value) return null;
			return { videoRatio: 'custom', videoRatioCustom: String(value) };
		case 'popup_ratio': {
			const ratioValue = parseRatioValue(value);
			if (!ratioValue) return null;
			return {
				popupRatio: ratioValue.ratio,
				...(ratioValue.custom ? { popupRatioCustom: ratioValue.custom } : {}),
			};
		}
		case 'popup_ratio_custom':
			if (!value) return null;
			return { popupRatio: 'custom', popupRatioCustom: String(value) };
		case 'overlay_media_url': {
			const urlValue =
				typeof value === 'object' && value
					? value.url || value.overlay_media_url || value.overlayMediaUrl
					: value;
			if (!urlValue || urlValue === 'none' || urlValue === 'remove') {
				return {
					'overlay-mediaID': null,
					'overlay-mediaURL': '',
					'overlay-mediaAlt': '',
				};
			}
			return {
				hideImage: false,
				'overlay-mediaURL': String(urlValue),
			};
		}
		case 'overlay_media_id':
			if (value === undefined || value === null || value === '') return null;
			return { 'overlay-mediaID': Number(value) };
		case 'overlay_hide_image':
			return { hideImage: normalizeBoolean(value) };
		case 'overlay_media_width':
			return buildOverlayMediaSizeChanges('width', value, null);
		case 'overlay_media_width_unit':
			return { 'overlay-media-width-unit-general': String(value) };
		case 'overlay_media_height':
			return buildOverlayMediaSizeChanges('height', value, null);
		case 'overlay_media_height_unit':
			return { 'overlay-media-height-unit-general': String(value) };
		case 'overlay_media_opacity':
			return buildOverlayMediaOpacityChanges(value);
		case 'overlay_color': {
			const colorValue = typeof value === 'object' ? value.color : value;
			const opacityValue = typeof value === 'object' ? value.opacity : null;
			return buildPaletteColorChanges('overlay-', colorValue, opacityValue);
		}
		case 'overlay_opacity':
			return buildPaletteOpacityChanges(block.attributes, 'overlay-', value);
		case 'overlay_color_hover': {
			const colorValue = typeof value === 'object' ? value.color : value;
			const opacityValue = typeof value === 'object' ? value.opacity : null;
			return buildPaletteColorHoverChanges('overlay-', colorValue, opacityValue);
		}
		case 'overlay_opacity_hover':
			return buildPaletteOpacityHoverChanges(block.attributes, 'overlay-', value);
		case 'lightbox_color': {
			const colorValue = typeof value === 'object' ? value.color : value;
			const opacityValue = typeof value === 'object' ? value.opacity : null;
			return buildPaletteColorChanges('lightbox-', colorValue, opacityValue);
		}
		case 'lightbox_opacity':
			return buildPaletteOpacityChanges(block.attributes, 'lightbox-', value);
		case 'popup_animation': {
			if (value === undefined || value === null) return null;
			const normalized = String(value).trim().toLowerCase();
			if (!normalized || normalized === 'none') return { popAnimation: '' };
			return { popAnimation: normalized };
		}
		case 'popup_animation_duration': {
			const parsed = parseAnimationDuration(value);
			if (!parsed) return null;
			const changes = { popupAnimationDuration: parsed.value };
			if (parsed.unit) {
				changes.popupAnimationDurationUnit = parsed.unit;
			}
			return changes;
		}
		case 'popup_animation_duration_unit': {
			if (!value) return null;
			const unit = String(value).trim().toLowerCase();
			if (!['s', 'ms'].includes(unit)) return null;
			return { popupAnimationDurationUnit: unit };
		}
		case 'video_border':
			return buildVideoBorderChanges(videoPrefix, value);
		case 'video_border_radius':
			return buildVideoBorderRadiusChanges(videoPrefix, value);
		case 'video_box_shadow':
			return buildVideoBoxShadowChanges(videoPrefix, value);
		case 'video_width':
			return buildVideoSizeChanges('width', value);
		case 'video_height':
			return buildVideoSizeChanges('height', value);
		case 'video_min_width':
			return buildVideoSizeChanges('min-width', value);
		case 'video_max_width':
			return buildVideoSizeChanges('max-width', value);
		case 'video_min_height':
			return buildVideoSizeChanges('min-height', value);
		case 'video_max_height':
			return buildVideoSizeChanges('max-height', value);
		case 'video_padding':
			return buildVideoPaddingChanges('all', value, null);
		case 'video_padding_top':
			return buildVideoPaddingChanges('top', value, null);
		case 'video_padding_right':
			return buildVideoPaddingChanges('right', value, null);
		case 'video_padding_bottom':
			return buildVideoPaddingChanges('bottom', value, null);
		case 'video_padding_left':
			return buildVideoPaddingChanges('left', value, null);
		case 'play_icon_color': {
			const colorValue = typeof value === 'object' ? value.color : value;
			const opacityValue = typeof value === 'object' ? value.opacity : null;
			return buildIconFillChanges('play-', colorValue, opacityValue, false);
		}
		case 'play_icon_color_hover': {
			const colorValue = typeof value === 'object' ? value.color : value;
			const opacityValue = typeof value === 'object' ? value.opacity : null;
			return buildIconFillChanges('play-', colorValue, opacityValue, true);
		}
		case 'play_icon_size':
			return buildIconSizeChanges('play-', value, null, false);
		case 'play_icon_size_unit':
			return {
				'play-icon-height-unit-general': String(value),
				'play-icon-width-unit-general': String(value),
			};
		case 'close_icon_color': {
			const colorValue = typeof value === 'object' ? value.color : value;
			const opacityValue = typeof value === 'object' ? value.opacity : null;
			return buildIconFillChanges('close-', colorValue, opacityValue, false);
		}
		case 'close_icon_color_hover': {
			const colorValue = typeof value === 'object' ? value.color : value;
			const opacityValue = typeof value === 'object' ? value.opacity : null;
			return buildIconFillChanges('close-', colorValue, opacityValue, true);
		}
		case 'close_icon_size':
			return buildIconSizeChanges('close-', value, null, false);
		case 'close_icon_size_unit':
			return {
				'close-icon-height-unit-general': String(value),
				'close-icon-width-unit-general': String(value),
			};
		case 'close_icon_position':
			return { 'close-icon-position': String(value) };
		case 'close_icon_spacing':
			return buildIconSpacingChanges('close-', value, null);
		case 'close_icon_spacing_unit':
			return { 'close-icon-spacing-unit-general': String(value) };
	}

	return null;
};
