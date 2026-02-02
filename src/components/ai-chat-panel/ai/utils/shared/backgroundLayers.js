import { cloneDeep } from 'lodash';
import { getDefaultLayerWithBreakpoint, getLayerLabel } from '@components/background-control/utils';
import {
	extractBreakpointToken,
	extractNumericValue,
	parsePaletteColor,
} from './attributeParsers';

const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/;

const SAME_LABEL_KEYS = new Set([
	'type',
	'isHover',
	'background-video-mediaID',
	'background-video-mediaURL',
	'background-video-startTime',
	'background-video-endTime',
	'background-video-loop',
	'background-video-reduce-border',
	'background-svg-SVGElement',
	'background-svg-SVGData',
	'background-image-mediaURL',
	'background-image-mediaID',
	'background-image-parallax-status',
	'background-image-parallax-speed',
	'background-image-parallax-direction',
	'background-image-parallax-alt',
	'background-image-parallax-alt-selector',
]);

const COLOR_WORDS = [
	'black',
	'white',
	'red',
	'blue',
	'green',
	'yellow',
	'orange',
	'purple',
	'pink',
	'gray',
	'grey',
	'brown',
	'teal',
	'cyan',
	'magenta',
];

const clampOpacity = value => Math.min(1, Math.max(0, value));

const extractHexColor = message => {
	if (!message) return null;
	const match = message.match(HEX_COLOR_REGEX);
	return match ? match[0] : null;
};

const extractColorWord = message => {
	const lower = String(message || '').toLowerCase();
	return COLOR_WORDS.find(word => new RegExp(`\\b${word}\\b`).test(lower)) || null;
};

const extractOpacityValue = message => {
	if (!message) return null;
	const percentMatch = message.match(/(\d+(?:\.\d+)?)\s*(%|percent|percentage)/);
	if (percentMatch) {
		const percent = Number.parseFloat(percentMatch[1]);
		if (Number.isFinite(percent)) return clampOpacity(percent / 100);
	}
	const rawMatch = message.match(/\bopacity\b[^0-9]*(-?\d+(?:\.\d+)?)/i);
	if (rawMatch) {
		const raw = Number.parseFloat(rawMatch[1]);
		if (!Number.isFinite(raw)) return null;
		return clampOpacity(raw > 1 ? raw / 100 : raw);
	}
	if (/\bsemi-transparent\b|\btranslucent\b/i.test(message)) return 0.5;
	return null;
};

const extractSizeValue = (message, keyword) =>
	extractNumericValue(message, [
		new RegExp(
			`${keyword}\\s*(?:to|=|is)?\\s*(\\d+(?:\\.\\d+)?)\\s*(px|%|percent|percentage|em|rem|vh|vw)?`,
			'i'
		),
	]);

const extractSizeUnit = message => {
	const match = message.match(
		/\b(\d+(?:\.\d+)?)\s*(px|%|percent|percentage|em|rem|vh|vw)\b/i
	);
	if (!match) return null;
	if (match[2] === 'percent' || match[2] === 'percentage') return '%';
	return match[2];
};

const extractDirectionValue = message =>
	extractNumericValue(message, [
		/\b(?:top|bottom|left|right|up|down)\b[^\d]*(\d+(?:\.\d+)?)/i,
	]);

const extractDirectionUnit = message => {
	const match = message.match(
		/\b(?:top|bottom|left|right|up|down)\b[^\d]*(\d+(?:\.\d+)?)\s*(px|%|percent|percentage|em|rem|vh|vw)\b/i
	);
	if (!match) return null;
	if (match[2] === 'percent' || match[2] === 'percentage') return '%';
	return match[2];
};

const extractGradientAngle = message => {
	const lower = String(message || '').toLowerCase();
	const degMatch = lower.match(/(\d{1,3})\s*deg/);
	if (degMatch) {
		const angle = Number.parseInt(degMatch[1], 10);
		if (Number.isFinite(angle) && angle >= 0 && angle <= 360) return angle;
	}
	if (lower.includes('diagonal')) return 135;
	if (lower.includes('to left')) return 270;
	if (lower.includes('to top')) return 0;
	if (lower.includes('vertical') || lower.includes('to bottom')) return 180;
	if (lower.includes('horizontal') || lower.includes('to right')) return 90;
	return null;
};

const extractGradientColors = message => {
	const lower = String(message || '').toLowerCase();
	const match = lower.match(/from\s+([a-z#0-9]+)\s+to\s+([a-z#0-9]+)/i);
	if (!match) return null;
	const [, rawStart, rawEnd] = match;
	return [rawStart, rawEnd];
};

const normalizeColorValue = raw => {
	if (!raw) return null;
	if (raw.startsWith('#')) return raw;
	if (raw === 'transparent') return 'transparent';
	if (COLOR_WORDS.includes(raw)) return raw;
	return raw;
};

const buildGradientValue = message => {
	const isRadial = /\bradial\b/i.test(message);
	const angle = extractGradientAngle(message) ?? 90;
	const colors = extractGradientColors(message);
	const [start, end] = colors || ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)'];
	if (isRadial) {
		return `radial-gradient(circle, ${normalizeColorValue(start)}, ${normalizeColorValue(end)})`;
	}
	return `linear-gradient(${angle}deg, ${normalizeColorValue(start)}, ${normalizeColorValue(end)})`;
};

const extractLayerType = message => {
	const lower = String(message || '').toLowerCase();
	if (/\bgradient\b/.test(lower)) return 'gradient';
	if (/\bvideo\b|\byoutube\b|\bvimeo\b/.test(lower)) return 'video';
	if (/\bimage\b|\bphoto\b|\bpicture\b/.test(lower)) return 'image';
	if (/\bsvg\b|\bshape\b|\bpattern\b/.test(lower)) return 'shape';
	if (/\bcolor\b|\bcolour\b|\bsolid\b|\boverlay\b|\bpalette\b/.test(lower))
		return 'color';
	if (/\btransparent\b|\bopacity\b/.test(lower)) return 'color';
	return null;
};

const extractLayerTarget = message => {
	const lower = String(message || '').toLowerCase();
	if (/\blayer\s*(\d+)\b/.test(lower)) {
		const match = lower.match(/\blayer\s*(\d+)\b/);
		const index = Number.parseInt(match[1], 10);
		return Number.isFinite(index) ? index - 1 : null;
	}
	if (/\bsecond\b/.test(lower)) return 1;
	if (/\bfirst\b/.test(lower)) return 0;
	if (/\btop\b|\blast\b|\bactive\b|\bselected\b/.test(lower)) return 'top';
	if (/\bbottom\b/.test(lower)) return 'bottom';
	return null;
};

const extractMoveDirection = message => {
	const lower = String(message || '').toLowerCase();
	if (/\bmove\b.*\bup\b|\bbring\b.*\bforward\b|\braise\b/.test(lower))
		return 'up';
	if (/\bmove\b.*\bdown\b|\bsend\b.*\bback\b|\blower\b/.test(lower))
		return 'down';
	return null;
};

const extractReorderIntent = message => {
	const lower = String(message || '').toLowerCase();
	const match = lower.match(
		/\b(color|image|gradient|video|svg|shape)\b.*\b(behind|below|under|above|over|in\s+front\s+of)\b.*\b(color|image|gradient|video|svg|shape)\b/
	);
	if (!match) return null;
	const position = /behind|below|under/.test(match[2]) ? 'behind' : 'above';
	return {
		subject: match[1] === 'svg' ? 'shape' : match[1],
		relative: match[3] === 'svg' ? 'shape' : match[3],
		position,
	};
};

const extractImageSize = message => {
	const lower = String(message || '').toLowerCase();
	if (/\bcover\b/.test(lower)) return 'cover';
	if (/\bcontain\b/.test(lower)) return 'contain';
	if (/\boriginal\b|\bauto\b/.test(lower)) return 'auto';
	if (/\bstretch\b/.test(lower)) return '100% 100%';
	return null;
};

const extractImagePosition = message => {
	const lower = String(message || '').toLowerCase();
	if (/\bcenter\b|\bcentre\b/.test(lower) && !/\btop\b|\bbottom\b|\bleft\b|\bright\b/.test(lower)) {
		return 'center center';
	}
	if (/\btop\b/.test(lower) && /\bleft\b/.test(lower)) return 'left top';
	if (/\btop\b/.test(lower) && /\bright\b/.test(lower)) return 'right top';
	if (/\bbottom\b/.test(lower) && /\bleft\b/.test(lower)) return 'left bottom';
	if (/\bbottom\b/.test(lower) && /\bright\b/.test(lower)) return 'right bottom';
	if (/\btop\b/.test(lower)) return 'center top';
	if (/\bbottom\b/.test(lower)) return 'center bottom';
	if (/\bleft\b/.test(lower)) return 'left center';
	if (/\bright\b/.test(lower)) return 'right center';
	return null;
};

const extractRepeat = message => {
	const lower = String(message || '').toLowerCase();
	if (/\bno\s+repeat\b|\bdon't\s+repeat\b|\bdo\s+not\s+repeat\b/.test(lower))
		return 'no-repeat';
	if (/\brepeat\b.*\bhorizontal\b|\brepeat-x\b/.test(lower)) return 'repeat-x';
	if (/\brepeat\b.*\bvertical\b|\brepeat-y\b/.test(lower)) return 'repeat-y';
	if (/\brepeat\b/.test(lower)) return 'repeat';
	return null;
};

const extractAttachment = message => {
	const lower = String(message || '').toLowerCase();
	if (/\bfixed\b/.test(lower)) return 'fixed';
	if (/\blocal\b/.test(lower)) return 'local';
	if (/\bscroll\b/.test(lower)) return 'scroll';
	return null;
};

const extractClipPath = message => {
	const lower = String(message || '').toLowerCase();
	if (/\bremove\b.*\bclip\b|\bno\s+clip\b|\bclear\b.*\bclip\b/.test(lower))
		return { value: 'none', status: false };
	if (/\bcircle\b/.test(lower))
		return { value: 'circle(50% at 50% 50%)', status: true };
	if (/\bdiagonal\b/.test(lower))
		return {
			value: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)',
			status: true,
		};
	if (/\bwave\b/.test(lower))
		return {
			value: 'polygon(0 30%, 20% 40%, 40% 35%, 60% 45%, 80% 40%, 100% 50%, 100% 100%, 0 100%)',
			status: true,
		};
	return null;
};

const extractWrapperIntent = message =>
	/\bwrapper\b|\bcontainer\b|\blayer\s+wrapper\b|\bimage\s+wrapper\b/i.test(
		message
	);

const buildLayerKey = (baseKey, { breakpoint, isHover }) => {
	if (SAME_LABEL_KEYS.has(baseKey)) return baseKey;
	const suffix = breakpoint ? `-${breakpoint}` : '';
	return `${baseKey}${suffix}${isHover ? '-hover' : ''}`;
};

const buildLayerUpdates = (message, { layerType, breakpoint, isHover }) => {
	const updates = {};
	const key = baseKey => buildLayerKey(baseKey, { breakpoint, isHover });
	const palette = parsePaletteColor(message);
	const hexColor = extractHexColor(message);
	const colorWord = extractColorWord(message);
	const wantsTransparent = /\btransparent\b/.test(
		String(message || '').toLowerCase()
	);
	const opacity = extractOpacityValue(message);
	const clipPath = extractClipPath(message);

	if (layerType === 'color') {
		if (Number.isFinite(palette)) {
			updates[key('background-palette-status')] = true;
			updates[key('background-palette-color')] = palette;
			updates[key('background-color')] = `var(--maxi-color-${palette})`;
		} else if (hexColor || colorWord || wantsTransparent) {
			const colorValue = wantsTransparent
				? 'transparent'
				: hexColor || colorWord;
			updates[key('background-palette-status')] = false;
			updates[key('background-color')] = colorValue;
		}
		if (Number.isFinite(opacity)) {
			updates[key('background-palette-opacity')] = opacity;
		}
		if (clipPath) {
			updates[key('background-color-clip-path')] = clipPath.value;
			updates[key('background-color-clip-path-status')] = clipPath.status;
		}
	}

	if (layerType === 'gradient') {
		if (/\bgradient\b/i.test(message)) {
			updates[key('background-gradient')] = buildGradientValue(message);
		}
		if (Number.isFinite(opacity)) {
			updates[key('background-gradient-opacity')] = opacity;
		}
		if (clipPath) {
			updates[key('background-gradient-clip-path')] = clipPath.value;
			updates[key('background-gradient-clip-path-status')] = clipPath.status;
		}
	}

	if (layerType === 'image') {
		const size = extractImageSize(message);
		if (size) {
			updates[key('background-image-size')] = size;
		}
		const width = extractSizeValue(message, 'width');
		const height = extractSizeValue(message, 'height');
		if (Number.isFinite(width)) {
			const unit = extractSizeUnit(message) || '%';
			updates[key('background-image-width')] = width;
			updates[key('background-image-width-unit')] = unit;
		}
		if (Number.isFinite(height)) {
			const unit = extractSizeUnit(message) || '%';
			updates[key('background-image-height')] = height;
			updates[key('background-image-height-unit')] = unit;
		}
		const position = extractImagePosition(message);
		if (position) {
			updates[key('background-image-position')] = position;
		}
		const positionValue = extractDirectionValue(message);
		if (Number.isFinite(positionValue)) {
			const unit = extractDirectionUnit(message) || '%';
			const lower = String(message || '').toLowerCase();
			if (/\bleft\b|\bright\b/.test(lower)) {
				updates[key('background-image-position-width')] = positionValue;
				updates[key('background-image-position-width-unit')] = unit;
			}
			if (/\btop\b|\bbottom\b|\bup\b|\bdown\b/.test(lower)) {
				updates[key('background-image-position-height')] = positionValue;
				updates[key('background-image-position-height-unit')] = unit;
			}
		}
		const repeat = extractRepeat(message);
		if (repeat) {
			updates[key('background-image-repeat')] = repeat;
		}
		const attachment = extractAttachment(message);
		if (attachment) {
			updates[key('background-image-attachment')] = attachment;
		}
		if (Number.isFinite(opacity)) {
			updates[key('background-image-opacity')] = opacity;
		}
		if (clipPath) {
			updates[key('background-image-clip-path')] = clipPath.value;
			updates[key('background-image-clip-path-status')] = clipPath.status;
		}
		if (/\bpadding\s*box\b/i.test(message)) {
			updates[key('background-image-clip')] = 'padding-box';
		}
		if (/\bborder\s*box\b/i.test(message)) {
			updates[key('background-image-clip')] = 'border-box';
		}
		if (/\bcontent\s*box\b/i.test(message)) {
			updates[key('background-image-clip')] = 'content-box';
		}
		if (/\bparallax\b/i.test(message)) {
			if (/\bdisable\b|\bturn\s*off\b/.test(message)) {
				updates['background-image-parallax-status'] = false;
			} else {
				updates['background-image-parallax-status'] = true;
			}
			const speed = extractNumericValue(message, [/\bspeed\b[^\d]*(\d+(?:\.\d+)?)/i]);
			if (Number.isFinite(speed)) {
				updates['background-image-parallax-speed'] = speed;
			}
			if (/\bup\b/.test(message)) {
				updates['background-image-parallax-direction'] = 'up';
			} else if (/\bdown\b/.test(message)) {
				updates['background-image-parallax-direction'] = 'down';
			}
		}
	}

	if (layerType === 'video') {
		if (/\bloop\b/.test(message)) {
			if (/\bno\b|\bdisable\b|\bdo\s+not\b/.test(message)) {
				updates['background-video-loop'] = false;
			} else {
				updates['background-video-loop'] = true;
			}
		}
		const startTime = extractNumericValue(message, [
			/\bstart(?:ing)?\s*(?:at|from)?\s*(\d+(?:\.\d+)?)/i,
		]);
		if (Number.isFinite(startTime)) {
			updates['background-video-startTime'] = String(startTime);
		}
		const endTime = extractNumericValue(message, [
			/\bstop(?:ping)?\s*(?:at|by)?\s*(\d+(?:\.\d+)?)/i,
			/\bend\s*(?:at|by)?\s*(\d+(?:\.\d+)?)/i,
		]);
		if (Number.isFinite(endTime)) {
			updates['background-video-endTime'] = String(endTime);
		}
		if (/\bmobile\b/.test(message)) {
			if (/\bdisable\b|\bturn\s*off\b/.test(message)) {
				updates[key('background-video-playOnMobile')] = false;
			} else if (/\benable\b|\ballow\b/.test(message)) {
				updates[key('background-video-playOnMobile')] = true;
			}
		}
		if (/\breduce\b.*\bborder\b|\bno\s+border\b/.test(message)) {
			updates['background-video-reduce-border'] = true;
		}
		if (Number.isFinite(opacity)) {
			updates[key('background-video-opacity')] = opacity;
		}
		if (clipPath) {
			updates[key('background-video-clip-path')] = clipPath.value;
			updates[key('background-video-clip-path-status')] = clipPath.status;
		}
	}

	if (layerType === 'shape') {
		if (Number.isFinite(palette)) {
			updates[key('background-svg-palette-status')] = true;
			updates[key('background-svg-palette-color')] = palette;
		} else if (hexColor || colorWord || wantsTransparent) {
			const colorValue = wantsTransparent
				? 'transparent'
				: hexColor || colorWord;
			updates[key('background-svg-palette-status')] = false;
			updates[key('background-svg-color')] = colorValue;
		}
		if (Number.isFinite(opacity)) {
			updates[key('background-svg-palette-opacity')] = opacity;
		}
	}

	const wantsWrapper = extractWrapperIntent(message);
	if (wantsWrapper && layerType) {
		const wrapperPrefix =
			layerType === 'shape'
				? 'background-svg-'
				: `background-${layerType}-wrapper-`;
		const wrapperWidth = extractSizeValue(message, 'width');
		const wrapperHeight = extractSizeValue(message, 'height');
		if (Number.isFinite(wrapperWidth)) {
			const unit = extractSizeUnit(message) || '%';
			updates[key(`${wrapperPrefix}width`)] = wrapperWidth;
			updates[key(`${wrapperPrefix}width-unit`)] = unit;
		}
		if (Number.isFinite(wrapperHeight)) {
			const unit = extractSizeUnit(message) || '%';
			updates[key(`${wrapperPrefix}height`)] = wrapperHeight;
			updates[key(`${wrapperPrefix}height-unit`)] = unit;
		}
		const positionValue = extractDirectionValue(message);
		if (Number.isFinite(positionValue)) {
			const unit = extractDirectionUnit(message) || 'px';
			const lower = String(message || '').toLowerCase();
			let side = null;
			if (/\btop\b|\bup\b/.test(lower)) side = 'top';
			else if (/\bbottom\b|\bdown\b/.test(lower)) side = 'bottom';
			else if (/\bleft\b/.test(lower)) side = 'left';
			else if (/\bright\b/.test(lower)) side = 'right';
			if (side) {
				updates[key(`${wrapperPrefix}position-${side}`)] = positionValue;
				updates[key(`${wrapperPrefix}position-${side}-unit`)] = unit;
			}
		}
	}

	return updates;
};

const createLayer = ({ layerType, isHover }) => {
	const label = getLayerLabel(layerType);
	if (!label) return null;
	const layer = getDefaultLayerWithBreakpoint(label, 'general', isHover);
	const nextLayer = {
		...layer,
		type: layerType,
	};
	if (
		layerType === 'shape' &&
		!nextLayer['background-svg-SVGElement']
	) {
		nextLayer['background-svg-SVGElement'] =
			'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100"/></svg>';
		nextLayer['background-svg-SVGData'] = {};
	}
	return nextLayer;
};

const getOrderRange = layers => {
	const orders = layers
		.map(layer => layer.order)
		.filter(val => Number.isFinite(val));
	if (!orders.length) return { min: 0, max: -1 };
	return { min: Math.min(...orders), max: Math.max(...orders) };
};

const getNextId = layers => {
	const ids = layers
		.map(layer => layer.id)
		.filter(val => Number.isFinite(val));
	return ids.length ? Math.max(...ids) + 1 : 1;
};

const sortByOrder = layers =>
	layers.slice().sort((a, b) => {
		const aOrder = Number.isFinite(a.order) ? a.order : 0;
		const bOrder = Number.isFinite(b.order) ? b.order : 0;
		return aOrder - bOrder;
	});

const resolveTargetIndex = (layers, target, layerType) => {
	if (!layers.length) return -1;
	const sorted = sortByOrder(layers);
	if (typeof target === 'number') {
		return target >= 0 && target < sorted.length ? target : -1;
	}
	if (target === 'bottom' || target === 'first') return 0;
	if (target === 'top' || target === 'last' || target === 'active') {
		if (layerType) {
			for (let i = sorted.length - 1; i >= 0; i -= 1) {
				if (sorted[i].type === layerType) return i;
			}
		}
		return sorted.length - 1;
	}
	if (target === 1) return 1;
	if (layerType) {
		for (let i = sorted.length - 1; i >= 0; i -= 1) {
			if (sorted[i].type === layerType) return i;
		}
	}
	return sorted.length - 1;
};

const reorderLayers = (layers, { subject, relative, position }) => {
	const sorted = sortByOrder(layers);
	const subjectIndex = sorted.findIndex(layer => layer.type === subject);
	if (subjectIndex === -1) return layers;

	const [subjectLayer] = sorted.splice(subjectIndex, 1);
	const relativeIndex = sorted.findIndex(layer => layer.type === relative);
	if (relativeIndex === -1) {
		sorted.splice(subjectIndex, 0, subjectLayer);
		return sorted;
	}

	const insertIndex = position === 'above' ? relativeIndex + 1 : relativeIndex;
	sorted.splice(Math.min(insertIndex, sorted.length), 0, subjectLayer);
	return sorted;
};

const reindexLayers = layers => {
	const sorted = sortByOrder(layers);
	const { min } = getOrderRange(sorted);
	let nextId = getNextId(sorted);
	return sorted.map((layer, index) => ({
		...layer,
		order: min + index,
		id: Number.isFinite(layer.id) ? layer.id : nextId++,
	}));
};

const isBackgroundLayerCommand = value => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	if (Array.isArray(value.layers) && !value.action && !value.op) return false;
	return Boolean(
		value.kind === 'background-layer-command' ||
			value.action ||
			value.op ||
			value.direction ||
			value.reorder ||
			value.relativeTo ||
			value.position ||
			value.updates ||
			value.layerType ||
			value.type
	);
};

const parseBackgroundLayerCommand = message => {
	const lower = String(message || '').toLowerCase();
	const hasBackground = /\bbackground\b|\bbg\b/.test(lower);
	const hasLayerKeyword = /\blayer\b|\boverlay\b/.test(lower);
	const hasMediaKeyword = /(image|gradient|video|svg|shape|parallax|clip|repeat|attachment)/.test(lower);

	if (!hasLayerKeyword && !(hasBackground && hasMediaKeyword)) {
		return null;
	}

	const isHover = /\bhover\b/.test(lower);
	const breakpoint = extractBreakpointToken(message) || 'general';
	const layerType = extractLayerType(message);
	const reorder = extractReorderIntent(message);
	const moveDirection = extractMoveDirection(message);
	const target = extractLayerTarget(message);

	const wantsClear =
		/(turn\s*off|remove|clear|disable).*(background|layers)/.test(lower) &&
		!/\blayer\b/.test(lower);
	const wantsRemove = /\bremove\b|\bdelete\b|\bclear\b/.test(lower);
	const wantsAdd = /\badd\b|\banother\b|\bextra\b|\bsecond\b|\bthird\b|\bmultiple\b|\bnew\b/.test(
		lower
	);

	let action = null;
	if (wantsClear) action = 'clear';
	else if (reorder) action = 'reorder';
	else if (moveDirection) action = 'move';
	else if (wantsRemove) action = 'remove';
	else if (wantsAdd) action = 'add';

	const updates = buildLayerUpdates(message, {
		layerType: layerType || (hasMediaKeyword ? extractLayerType(message) : null),
		breakpoint,
		isHover,
	});

	if (!action && Object.keys(updates).length) {
		action = 'update';
	}

	if (!action) return null;

	return {
		kind: 'background-layer-command',
		action,
		layerType,
		target,
		breakpoint,
		isHover,
		direction: moveDirection,
		reorder,
		updates,
		enableHover: isHover && action !== 'remove' && action !== 'clear',
	};
};

const applyBackgroundLayerCommand = (layers, command) => {
	if (!command) return layers;
	const list = Array.isArray(layers) ? cloneDeep(layers) : [];
	const action = command.action || command.op;
	const layerType = command.layerType || command.type;

	if (action === 'clear') return [];

	if (action === 'reorder') {
		const reorderConfig =
			command.reorder ||
			(command.relativeTo
				? {
						subject: layerType,
						relative: command.relativeTo,
						position: command.position || 'above',
				  }
				: null);
		if (!reorderConfig) return list;
		const reordered = reorderLayers(list, reorderConfig);
		return reindexLayers(reordered);
	}

	if (action === 'move') {
		const sorted = sortByOrder(list);
		const index = resolveTargetIndex(sorted, command.target, layerType);
		if (index < 0) return list;
		const direction = command.direction === 'down' ? -1 : 1;
		const newIndex = Math.max(0, Math.min(sorted.length - 1, index + direction));
		if (newIndex === index) return list;
		const [moved] = sorted.splice(index, 1);
		sorted.splice(newIndex, 0, moved);
		return reindexLayers(sorted);
	}

	if (action === 'remove') {
		const sorted = sortByOrder(list);
		const index = resolveTargetIndex(sorted, command.target, layerType);
		if (index < 0) return list;
		sorted.splice(index, 1);
		return sorted;
	}

	if (action === 'add') {
		const nextOrder = getOrderRange(list).max + 1;
		const nextId = getNextId(list);
		const newLayer = createLayer({ layerType: layerType || 'color', isHover: command.isHover });
		if (!newLayer) return list;
		const updates = command.updates || {};
		const merged = {
			...newLayer,
			...updates,
			order: nextOrder,
			id: nextId,
		};
		return [...list, merged];
	}

	if (action === 'update') {
		const sorted = sortByOrder(list);
		let index = resolveTargetIndex(sorted, command.target, layerType);
		const updates = command.updates || {};
		if (index < 0 && layerType) {
			const created = createLayer({ layerType, isHover: command.isHover });
			if (!created) return list;
			const nextOrder = getOrderRange(list).max + 1;
			const nextId = getNextId(list);
			return [
				...list,
				{
					...created,
					...updates,
					order: nextOrder,
					id: nextId,
				},
			];
		}
		if (index < 0) return list;
		const current = sorted[index];
		let updated = { ...current, ...updates };
		if (layerType && current.type !== layerType) {
			const replacement = createLayer({
				layerType,
				isHover: command.isHover,
			});
			if (replacement) {
				updated = {
					...replacement,
					...updates,
					order: current.order,
					id: current.id,
				};
			}
		}
		sorted[index] = updated;
		return sorted;
	}

	return list;
};

export {
	parseBackgroundLayerCommand,
	applyBackgroundLayerCommand,
	isBackgroundLayerCommand,
};
