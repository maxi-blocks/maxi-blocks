import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildButtonBGroupAction,
	buildButtonBGroupAttributeChanges,
	getButtonBGroupSidebarTarget,
} from '../ai/utils/buttonGroups';

const buttonAttributes = rawAttributes.blocks['button-maxi'] || [];
const bAttributes = buttonAttributes.filter(attr => /^b/i.test(attr));

const baseLayers = [
	{
		type: 'color',
		order: 0,
		'background-palette-status-general': true,
		'background-palette-color-general': 2,
		'background-color-general': 'var(--maxi-color-2)',
	},
];

const hoverLayers = [
	{
		type: 'color',
		order: 0,
		'background-palette-status-general': true,
		'background-palette-color-general': 5,
		'background-color-general': 'var(--maxi-color-5)',
	},
];

const BUTTON_BACKGROUND_SAMPLE = {
	palette: 3,
	paletteHover: 5,
	paletteOpacity: 0.8,
	paletteOpacityHover: 0.6,
	paletteStatus: true,
	paletteStatusHover: true,
	paletteScStatus: false,
	paletteScStatusHover: false,
	color: 'var(--maxi-color-3)',
	colorHover: 'var(--maxi-color-5)',
	gradient:
		'linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
	gradientHover:
		'linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
	gradientOpacity: 0.7,
	gradientOpacityHover: 0.5,
	activeMedia: 'color',
	activeMediaHover: 'color',
	clipPath: 'inset(0% 0% 0% 0%)',
	clipPathStatus: true,
	clipPathHover: 'inset(0% 0% 0% 0%)',
	clipPathStatusHover: true,
	gradientClipPath: 'inset(0% 0% 0% 0%)',
	gradientClipPathStatus: true,
	gradientClipPathHover: 'inset(0% 0% 0% 0%)',
	gradientClipPathStatusHover: true,
	wrapperWidth: 100,
	wrapperHeight: 100,
	wrapperUnit: '%',
	position: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		unit: '%',
		sync: 'all',
	},
};

const BUTTON_BORDER_SAMPLE = { width: 2, style: 'solid', color: 3, opacity: 100 };
const BUTTON_BORDER_HOVER_SAMPLE = {
	width: 4,
	style: 'dashed',
	color: 5,
	opacity: 80,
};
const BUTTON_BORDER_RADIUS_SAMPLE = 12;
const BUTTON_BORDER_RADIUS_HOVER_SAMPLE = 16;
const BUTTON_BOX_SHADOW_SAMPLE = {
	x: 0,
	y: 8,
	blur: 20,
	spread: 0,
	color: 6,
	opacity: 15,
};
const BUTTON_BOX_SHADOW_HOVER_SAMPLE = {
	x: 0,
	y: 12,
	blur: 26,
	spread: 0,
	color: 7,
	opacity: 18,
};

const BUTTON_MARGIN_SAMPLE = { value: '12', unit: 'px', sync: 'all' };
const BUTTON_PADDING_SAMPLE = { value: '14', unit: 'px', sync: 'all' };
const BUTTON_WIDTH_SAMPLE = { value: '320', unit: 'px', fitContent: false };
const BUTTON_HEIGHT_SAMPLE = { value: '48', unit: 'px' };
const BUTTON_MIN_HEIGHT_SAMPLE = { value: '24', unit: 'px' };
const BUTTON_MAX_HEIGHT_SAMPLE = { value: '120', unit: 'px' };
const BUTTON_MIN_WIDTH_SAMPLE = { value: '120', unit: 'px' };
const BUTTON_MAX_WIDTH_SAMPLE = { value: '640', unit: 'px' };
const BUTTON_FULL_WIDTH_SAMPLE = true;
const BUTTON_FORCE_ASPECT_RATIO_SAMPLE = true;
const BUTTON_SIZE_ADVANCED_SAMPLE = true;
const BOTTOM_GAP_SAMPLE = { value: '10', unit: 'px' };
const BOTTOM_GAP_HOVER_SAMPLE = { value: '12', unit: 'px' };

const BORDER_SAMPLE = { width: 2, style: 'solid', color: 3, opacity: 100 };
const BORDER_HOVER_SAMPLE = { width: 4, style: 'dashed', color: 5, opacity: 80 };
const BORDER_RADIUS_SAMPLE = 12;
const BORDER_RADIUS_HOVER_SAMPLE = 16;
const BOX_SHADOW_SAMPLE = { x: 0, y: 10, blur: 30, spread: 0, color: 8, opacity: 12 };
const BOX_SHADOW_HOVER_SAMPLE = { x: 0, y: 16, blur: 32, spread: 0, color: 6, opacity: 18 };

const resolveBorderExpectedValue = (attribute, sample) => {
	if (attribute.includes('border-style')) return sample.style;
	if (attribute.includes('border-top-width')) return sample.width;
	if (attribute.includes('border-bottom-width')) return sample.width;
	if (attribute.includes('border-left-width')) return sample.width;
	if (attribute.includes('border-right-width')) return sample.width;
	if (attribute.includes('border-sync-width')) return 'all';
	if (attribute.includes('border-unit-width')) return 'px';
	if (attribute.includes('border-palette-status')) return true;
	if (attribute.includes('border-palette-color')) return sample.color;
	if (attribute.includes('border-palette-opacity')) return sample.opacity;
	if (attribute.includes('border-palette-sc-status')) return false;
	if (attribute.includes('border-color')) {
		return `var(--maxi-color-${sample.color})`;
	}
	if (attribute === 'border-status-hover') return true;
	return null;
};

const resolveBorderRadiusExpectedValue = attribute => {
	if (attribute.includes('border-sync-radius')) return 'all';
	if (attribute.includes('border-unit-radius')) return 'px';
	return attribute.includes('hover') ? BORDER_RADIUS_HOVER_SAMPLE : BORDER_RADIUS_SAMPLE;
};

const resolveBoxShadowExpectedValue = (attribute, sample) => {
	if (attribute === 'box-shadow-status-hover') return true;
	if (attribute.includes('box-shadow-horizontal-unit')) return 'px';
	if (attribute.includes('box-shadow-vertical-unit')) return 'px';
	if (attribute.includes('box-shadow-blur-unit')) return 'px';
	if (attribute.includes('box-shadow-spread-unit')) return 'px';
	if (attribute.includes('box-shadow-horizontal')) return sample.x;
	if (attribute.includes('box-shadow-vertical')) return sample.y;
	if (attribute.includes('box-shadow-blur')) return sample.blur;
	if (attribute.includes('box-shadow-spread')) return sample.spread;
	if (attribute.includes('box-shadow-inset')) return false;
	if (attribute.includes('box-shadow-palette-status')) return true;
	if (attribute.includes('box-shadow-palette-color')) return sample.color;
	if (attribute.includes('box-shadow-palette-opacity')) return sample.opacity;
	if (attribute.includes('box-shadow-palette-sc-status')) return false;
	if (attribute.includes('box-shadow-color')) return '';
	return null;
};

const resolveButtonBackgroundExpectedValue = (attribute, sample) => {
	if (attribute === 'button-background-status-hover') return true;

	const isHover = attribute.includes('-hover');
	const stripped = attribute
		.replace('button-background-', '')
		.replace(/-hover$/, '')
		.replace(/-(general|xxl|xl|l|m|s|xs)$/, '');

	const state = isHover
		? {
			palette: sample.paletteHover ?? sample.palette,
			paletteOpacity: sample.paletteOpacityHover ?? sample.paletteOpacity,
			paletteStatus: sample.paletteStatusHover ?? sample.paletteStatus,
			paletteScStatus: sample.paletteScStatusHover ?? sample.paletteScStatus,
			color: sample.colorHover ?? sample.color,
			gradient: sample.gradientHover ?? sample.gradient,
			gradientOpacity: sample.gradientOpacityHover ?? sample.gradientOpacity,
			activeMedia: sample.activeMediaHover ?? sample.activeMedia,
			clipPath: sample.clipPathHover ?? sample.clipPath,
			clipPathStatus: sample.clipPathStatusHover ?? sample.clipPathStatus,
			gradientClipPath:
				sample.gradientClipPathHover ?? sample.gradientClipPath,
			gradientClipPathStatus:
				sample.gradientClipPathStatusHover ??
				sample.gradientClipPathStatus,
		}
		: {
			palette: sample.palette,
			paletteOpacity: sample.paletteOpacity,
			paletteStatus: sample.paletteStatus,
			paletteScStatus: sample.paletteScStatus,
			color: sample.color,
			gradient: sample.gradient,
			gradientOpacity: sample.gradientOpacity,
			activeMedia: sample.activeMedia,
			clipPath: sample.clipPath,
			clipPathStatus: sample.clipPathStatus,
			gradientClipPath: sample.gradientClipPath,
			gradientClipPathStatus: sample.gradientClipPathStatus,
		};

	switch (stripped) {
		case 'active-media':
			return state.activeMedia;
		case 'color':
			return state.color;
		case 'gradient':
			return state.gradient;
		case 'gradient-opacity':
			return state.gradientOpacity;
		case 'palette-color':
			return state.palette;
		case 'palette-opacity':
			return state.paletteOpacity;
		case 'palette-status':
			return state.paletteStatus;
		case 'palette-sc-status':
			return state.paletteScStatus;
		case 'color-clip-path':
			return state.clipPath;
		case 'color-clip-path-status':
			return state.clipPathStatus;
		case 'gradient-clip-path':
			return state.gradientClipPath;
		case 'gradient-clip-path-status':
			return state.gradientClipPathStatus;
		case 'color-wrapper-width':
		case 'gradient-wrapper-width':
			return sample.wrapperWidth;
		case 'color-wrapper-width-unit':
		case 'gradient-wrapper-width-unit':
			return sample.wrapperUnit;
		case 'color-wrapper-height':
		case 'gradient-wrapper-height':
			return sample.wrapperHeight;
		case 'color-wrapper-height-unit':
		case 'gradient-wrapper-height-unit':
			return sample.wrapperUnit;
		case 'color-wrapper-position-top':
		case 'gradient-wrapper-position-top':
			return sample.position.top;
		case 'color-wrapper-position-top-unit':
		case 'gradient-wrapper-position-top-unit':
			return sample.position.unit;
		case 'color-wrapper-position-right':
		case 'gradient-wrapper-position-right':
			return sample.position.right;
		case 'color-wrapper-position-right-unit':
		case 'gradient-wrapper-position-right-unit':
			return sample.position.unit;
		case 'color-wrapper-position-bottom':
		case 'gradient-wrapper-position-bottom':
			return sample.position.bottom;
		case 'color-wrapper-position-bottom-unit':
		case 'gradient-wrapper-position-bottom-unit':
			return sample.position.unit;
		case 'color-wrapper-position-left':
		case 'gradient-wrapper-position-left':
			return sample.position.left;
		case 'color-wrapper-position-left-unit':
		case 'gradient-wrapper-position-left-unit':
			return sample.position.unit;
		case 'color-wrapper-position-sync':
		case 'gradient-wrapper-position-sync':
			return sample.position.sync;
		default:
			return null;
	}
};

const resolveButtonBorderExpectedValue = (attribute, sample) => {
	if (attribute === 'button-border-status-hover') return true;
	const normalized = attribute.replace('button-', '');
	return resolveBorderExpectedValue(normalized, sample);
};

const resolveButtonBorderRadiusExpectedValue = attribute => {
	const normalized = attribute.replace('button-', '');
	if (normalized.includes('border-sync-radius')) return 'all';
	if (normalized.includes('border-unit-radius')) return 'px';
	return normalized.includes('hover')
		? BUTTON_BORDER_RADIUS_HOVER_SAMPLE
		: BUTTON_BORDER_RADIUS_SAMPLE;
};

const resolveButtonBoxShadowExpectedValue = (attribute, sample) => {
	if (attribute === 'button-box-shadow-status-hover') return true;
	const normalized = attribute.replace('button-', '');
	if (normalized.includes('box-shadow-horizontal-unit')) return 'px';
	if (normalized.includes('box-shadow-vertical-unit')) return 'px';
	if (normalized.includes('box-shadow-blur-unit')) return 'px';
	if (normalized.includes('box-shadow-spread-unit')) return 'px';
	if (normalized.includes('box-shadow-horizontal')) return sample.x;
	if (normalized.includes('box-shadow-vertical')) return sample.y;
	if (normalized.includes('box-shadow-blur')) return sample.blur;
	if (normalized.includes('box-shadow-spread')) return sample.spread;
	if (normalized.includes('box-shadow-inset')) return false;
	if (normalized.includes('box-shadow-palette-status')) return true;
	if (normalized.includes('box-shadow-palette-color')) return sample.color;
	if (normalized.includes('box-shadow-palette-opacity')) return sample.opacity;
	if (normalized.includes('box-shadow-palette-sc-status')) return false;
	if (normalized.includes('box-shadow-color')) return '';
	return null;
};

const resolveSpacingExpectedValue = (attribute, sample) => {
	if (attribute.includes('-unit-')) return sample.unit;
	if (attribute.includes('-sync-')) return sample.sync;
	return sample.value;
};

const resolveSizeExpectedValue = (attribute, sample) => {
	if (attribute.includes('fit-content')) return sample.fitContent ?? false;
	if (attribute.includes('-unit-')) return sample.unit;
	return sample.value;
};

const resolveBottomGapExpectedValue = attribute => {
	const sample = attribute.includes('hover')
		? BOTTOM_GAP_HOVER_SAMPLE
		: BOTTOM_GAP_SAMPLE;
	if (attribute.includes('unit')) return sample.unit;
	return sample.value;
};

const buildExpectedForAttribute = attribute => {
	if (attribute === 'background-layers') {
		return {
			property: 'background_layers',
			value: baseLayers,
			expectedKey: 'background-layers',
			expectedValue: baseLayers,
			expectedSidebar: { tabIndex: 1, accordion: 'background / layer' },
		};
	}

	if (attribute === 'background-layers-hover') {
		return {
			property: 'background_layers_hover',
			value: hoverLayers,
			expectedKey: 'background-layers-hover',
			expectedValue: hoverLayers,
			expectedSidebar: { tabIndex: 1, accordion: 'background / layer' },
		};
	}

	if (attribute === 'block-background-status-hover') {
		return {
			property: 'block_background_status_hover',
			value: true,
			expectedKey: 'block-background-status-hover',
			expectedValue: true,
			expectedSidebar: { tabIndex: 1, accordion: 'background / layer' },
		};
	}

	if (attribute === 'blockStyle') {
		return {
			property: 'block_style',
			value: 'dark',
			expectedKey: 'blockStyle',
			expectedValue: 'dark',
			expectedSidebar: { tabIndex: 0, accordion: 'block settings' },
		};
	}

	if (attribute.startsWith('breakpoints-')) {
		const breakpoint = attribute.replace('breakpoints-', '');
		return {
			property: 'breakpoints',
			value: { value: 900, breakpoint },
			expectedKey: `breakpoints-${breakpoint}`,
			expectedValue: 900,
			expectedSidebar: { tabIndex: 1, accordion: 'breakpoint' },
		};
	}

	if (attribute === 'buttonContent') {
		return {
			property: 'button_text',
			value: 'Shop now',
			expectedKey: 'buttonContent',
			expectedValue: 'Shop now',
			expectedSidebar: null,
		};
	}

	if (attribute.startsWith('bottom-gap-')) {
		const isHover = attribute.includes('hover');
		return {
			property: isHover ? 'bottom_gap_hover' : 'bottom_gap',
			value: isHover ? BOTTOM_GAP_HOVER_SAMPLE : BOTTOM_GAP_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveBottomGapExpectedValue(attribute),
			expectedSidebar: { tabIndex: 0, accordion: 'typography' },
		};
	}

	if (attribute.startsWith('border-')) {
		if (attribute === 'border-status-hover') {
			return {
				property: 'border_hover',
				value: BORDER_HOVER_SAMPLE,
				expectedKey: 'border-status-hover',
				expectedValue: true,
				expectedSidebar: { tabIndex: 1, accordion: 'border' },
			};
		}

		const isHover = attribute.includes('-hover');
		const isRadius = attribute.includes('radius');
		if (isRadius) {
			return {
				property: isHover ? 'border_radius_hover' : 'border_radius',
				value: isHover ? BORDER_RADIUS_HOVER_SAMPLE : BORDER_RADIUS_SAMPLE,
				expectedKey: attribute,
				expectedValue: resolveBorderRadiusExpectedValue(attribute),
				expectedSidebar: { tabIndex: 1, accordion: 'border' },
			};
		}

		const sample = isHover ? BORDER_HOVER_SAMPLE : BORDER_SAMPLE;
		return {
			property: isHover ? 'border_hover' : 'border',
			value: sample,
			expectedKey: attribute,
			expectedValue: resolveBorderExpectedValue(attribute, sample),
			expectedSidebar: { tabIndex: 1, accordion: 'border' },
		};
	}

	if (attribute.startsWith('box-shadow-')) {
		const isHover = attribute.includes('-hover');
		const sample = isHover ? BOX_SHADOW_HOVER_SAMPLE : BOX_SHADOW_SAMPLE;
		return {
			property: isHover ? 'box_shadow_hover' : 'box_shadow',
			value: sample,
			expectedKey: attribute,
			expectedValue: resolveBoxShadowExpectedValue(attribute, sample),
			expectedSidebar: { tabIndex: 1, accordion: 'box shadow' },
		};
	}

	if (attribute.startsWith('button-background-')) {
		const isHover = attribute.includes('hover');
		return {
			property: attribute === 'button-background-status-hover'
				? 'button_background_status_hover'
				: isHover
					? 'button_background_hover'
					: 'button_background',
			value: BUTTON_BACKGROUND_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveButtonBackgroundExpectedValue(
				attribute,
				BUTTON_BACKGROUND_SAMPLE
			),
			expectedSidebar: { tabIndex: 0, accordion: 'button background' },
		};
	}

	if (attribute.startsWith('button-border-')) {
		if (attribute === 'button-border-status-hover') {
			return {
				property: 'button_border_hover',
				value: BUTTON_BORDER_HOVER_SAMPLE,
				expectedKey: attribute,
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'border' },
			};
		}

		const isHover = attribute.includes('-hover');
		const isRadius = attribute.includes('radius');
		if (isRadius) {
			return {
				property: isHover
					? 'button_border_radius_hover'
					: 'button_border_radius',
				value: isHover
					? BUTTON_BORDER_RADIUS_HOVER_SAMPLE
					: BUTTON_BORDER_RADIUS_SAMPLE,
				expectedKey: attribute,
				expectedValue: resolveButtonBorderRadiusExpectedValue(attribute),
				expectedSidebar: { tabIndex: 0, accordion: 'border' },
			};
		}

		const sample = isHover ? BUTTON_BORDER_HOVER_SAMPLE : BUTTON_BORDER_SAMPLE;
		return {
			property: isHover ? 'button_border_hover' : 'button_border',
			value: sample,
			expectedKey: attribute,
			expectedValue: resolveButtonBorderExpectedValue(attribute, sample),
			expectedSidebar: { tabIndex: 0, accordion: 'border' },
		};
	}

	if (attribute.startsWith('button-box-shadow-')) {
		const isHover = attribute.includes('-hover');
		const sample = isHover
			? BUTTON_BOX_SHADOW_HOVER_SAMPLE
			: BUTTON_BOX_SHADOW_SAMPLE;
		return {
			property: isHover ? 'button_box_shadow_hover' : 'button_box_shadow',
			value: sample,
			expectedKey: attribute,
			expectedValue: resolveButtonBoxShadowExpectedValue(attribute, sample),
			expectedSidebar: { tabIndex: 0, accordion: 'box shadow' },
		};
	}

	if (attribute.startsWith('button-margin-')) {
		return {
			property: 'button_margin',
			value: BUTTON_MARGIN_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveSpacingExpectedValue(attribute, BUTTON_MARGIN_SAMPLE),
			expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
		};
	}

	if (attribute.startsWith('button-padding-')) {
		return {
			property: 'button_padding',
			value: BUTTON_PADDING_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveSpacingExpectedValue(attribute, BUTTON_PADDING_SAMPLE),
			expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
		};
	}

	if (attribute.startsWith('button-width-')) {
		return {
			property: 'button_width',
			value: BUTTON_WIDTH_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveSizeExpectedValue(attribute, BUTTON_WIDTH_SAMPLE),
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute.startsWith('button-height-')) {
		return {
			property: 'button_height',
			value: BUTTON_HEIGHT_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveSizeExpectedValue(attribute, BUTTON_HEIGHT_SAMPLE),
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute.startsWith('button-min-height-')) {
		return {
			property: 'button_min_height',
			value: BUTTON_MIN_HEIGHT_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveSizeExpectedValue(attribute, BUTTON_MIN_HEIGHT_SAMPLE),
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute.startsWith('button-max-height-')) {
		return {
			property: 'button_max_height',
			value: BUTTON_MAX_HEIGHT_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveSizeExpectedValue(attribute, BUTTON_MAX_HEIGHT_SAMPLE),
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute.startsWith('button-min-width-')) {
		return {
			property: 'button_min_width',
			value: BUTTON_MIN_WIDTH_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveSizeExpectedValue(attribute, BUTTON_MIN_WIDTH_SAMPLE),
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute.startsWith('button-max-width-')) {
		return {
			property: 'button_max_width',
			value: BUTTON_MAX_WIDTH_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveSizeExpectedValue(attribute, BUTTON_MAX_WIDTH_SAMPLE),
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute.startsWith('button-full-width-')) {
		return {
			property: 'button_full_width',
			value: BUTTON_FULL_WIDTH_SAMPLE,
			expectedKey: attribute,
			expectedValue: BUTTON_FULL_WIDTH_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute.startsWith('button-force-aspect-ratio-')) {
		return {
			property: 'button_force_aspect_ratio',
			value: BUTTON_FORCE_ASPECT_RATIO_SAMPLE,
			expectedKey: attribute,
			expectedValue: BUTTON_FORCE_ASPECT_RATIO_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute === 'button-size-advanced-options') {
		return {
			property: 'button_size_advanced_options',
			value: BUTTON_SIZE_ADVANCED_SAMPLE,
			expectedKey: attribute,
			expectedValue: BUTTON_SIZE_ADVANCED_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	return null;
};

describe('button B attributes', () => {
	test('B-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set button background to palette 3',
				property: 'button_background',
				value: { palette: 3, color: 'var(--maxi-color-3)', activeMedia: 'color' },
			},
			{
				phrase: 'Make the button background a gradient',
				property: 'button_background',
				assert: action => action.value && action.value.activeMedia === 'gradient',
			},
			{
				phrase: 'Set button background opacity to 70%',
				property: 'button_background_opacity',
				value: 0.7,
			},
			{
				phrase: 'Set button background gradient opacity to 70%',
				property: 'button_background_gradient_opacity',
				value: 0.7,
			},
			{
				phrase: 'On hover, set button background palette 5',
				property: 'button_background_hover',
				value: { palette: 5, color: 'var(--maxi-color-5)', activeMedia: 'color' },
			},
			{
				phrase: 'Add a 2px solid button border with palette 3',
				property: 'button_border',
				assert: action => action.value && action.value.width === 2,
			},
			{
				phrase: 'On hover, make button border 4px dashed palette 5',
				property: 'button_border_hover',
				assert: action => action.value && action.value.width === 4,
			},
			{
				phrase: 'Round button corners to 12px',
				property: 'button_border_radius',
				value: 12,
			},
			{
				phrase: 'On hover, set button corners to 16px',
				property: 'button_border_radius_hover',
				value: 16,
			},
			{
				phrase: 'Add a soft button shadow with palette 8',
				property: 'button_box_shadow',
				assert: action => action.value && action.value.blur === 30,
			},
			{
				phrase: 'On hover, add a bold button shadow with palette 6',
				property: 'button_box_shadow_hover',
				assert: action => action.value && action.value.blur === 25,
			},
			{
				phrase: 'Set button padding to 12px',
				property: 'button_padding',
				assert: action => action.value && action.value.value === 12,
			},
			{
				phrase: 'Set button margin to 8px',
				property: 'button_margin',
				assert: action => action.value && action.value.value === 8,
			},
			{
				phrase: 'Set button width to 320px',
				property: 'button_width',
				assert: action => action.value && action.value.value === 320,
			},
			{
				phrase: 'Set button height to 48px',
				property: 'button_height',
				assert: action => action.value && action.value.value === 48,
			},
			{
				phrase: 'Set button min height to 24px',
				property: 'button_min_height',
				assert: action => action.value && action.value.value === 24,
			},
			{
				phrase: 'Set button max height to 120px',
				property: 'button_max_height',
				assert: action => action.value && action.value.value === 120,
			},
			{
				phrase: 'Set button min width to 120px',
				property: 'button_min_width',
				assert: action => action.value && action.value.value === 120,
			},
			{
				phrase: 'Set button max width to 640px',
				property: 'button_max_width',
				assert: action => action.value && action.value.value === 640,
			},
			{
				phrase: 'Make button full width',
				property: 'button_full_width',
				value: true,
			},
			{
				phrase: 'Force button aspect ratio',
				property: 'button_force_aspect_ratio',
				value: true,
			},
			{
				phrase: 'Set bottom gap to 10px',
				property: 'bottom_gap',
				assert: action => action.value && action.value.value === 10,
			},
			{
				phrase: 'Set tablet breakpoint to 900',
				property: 'breakpoints',
				value: { value: 900, breakpoint: 'm' },
			},
			{
				phrase: 'Add a background layer with palette 2',
				property: 'background_layers',
				assert: action => Array.isArray(action.value) && action.value.length > 0,
			},
			{
				phrase: 'On hover add a background overlay layer with palette 3',
				property: 'background_layers_hover',
				assert: action => Array.isArray(action.value) && action.value.length > 0,
			},
		];

		samples.forEach(sample => {
			const action = buildButtonBGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			}
		});
	});

	test('B-group background without explicit color defers to palette picker', () => {
		const action = buildButtonBGroupAction('Set the button background to solid blue');
		expect(action).toBeNull();
	});

	test('each B attribute can be updated via B-group mapping', () => {
		const missing = [];

		bAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || config.expectedValue === null || config.expectedValue === undefined) {
				missing.push(attribute);
				return;
			}

			const changes = buildButtonBGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toEqual(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('B-group properties map to sidebar targets', () => {
		const missing = [];
		bAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}
			if (config.expectedSidebar === null) {
				return;
			}

			const sidebar = getButtonBGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
