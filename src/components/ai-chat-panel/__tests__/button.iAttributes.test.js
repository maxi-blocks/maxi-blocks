import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildButtonIGroupAction,
	buildButtonIGroupAttributeChanges,
	getButtonIGroupSidebarTarget,
} from '../ai/utils/buttonIGroup';

const buttonAttributes = rawAttributes.blocks['button-maxi'] || [];
const iAttributes = buttonAttributes.filter(attr => attr.startsWith('icon'));

const ICON_BACKGROUND_SAMPLE = {
	palette: 4,
	paletteHover: 6,
	paletteOpacity: 0.9,
	paletteOpacityHover: 0.7,
	paletteStatus: true,
	paletteStatusHover: true,
	paletteScStatus: false,
	paletteScStatusHover: false,
	color: 'var(--maxi-color-4)',
	colorHover: 'var(--maxi-color-6)',
	gradient: 'linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
	gradientHover: 'linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
	gradientOpacity: 0.7,
	gradientOpacityHover: 0.5,
	activeMedia: 'color',
	activeMediaHover: 'color',
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

const ICON_BORDER_SAMPLE = { width: 2, style: 'solid', color: 3, opacity: 100 };
const ICON_BORDER_HOVER_SAMPLE = { width: 3, style: 'dashed', color: 5, opacity: 80 };
const ICON_BORDER_RADIUS_SAMPLE = 8;
const ICON_BORDER_RADIUS_HOVER_SAMPLE = 12;

const ICON_PADDING_SAMPLE = { value: '10', unit: 'px', sync: 'all' };
const ICON_SPACING_SAMPLE = { value: 12, unit: 'px' };
const ICON_SPACING_HOVER_SAMPLE = { value: 16, unit: 'px' };

const ICON_WIDTH_SAMPLE = { value: '24', unit: 'px', fitContent: false };
const ICON_WIDTH_HOVER_SAMPLE = { value: '28', unit: 'px', fitContent: false };
const ICON_HEIGHT_SAMPLE = { value: '20', unit: 'px' };
const ICON_HEIGHT_HOVER_SAMPLE = { value: '22', unit: 'px' };

const ICON_FORCE_ASPECT_RATIO_SAMPLE = true;
const ICON_FORCE_ASPECT_RATIO_HOVER_SAMPLE = true;

const ICON_FILL_SAMPLE = { palette: 2, opacity: 80, scStatus: false };
const ICON_FILL_HOVER_SAMPLE = { palette: 6, opacity: 70, scStatus: false };
const ICON_STROKE_SAMPLE = { palette: 5, opacity: 90, scStatus: false };
const ICON_STROKE_HOVER_SAMPLE = { palette: 7, opacity: 75, scStatus: false };
const ICON_STROKE_WIDTH_SAMPLE = 2;
const ICON_STROKE_WIDTH_HOVER_SAMPLE = 3;

const ICON_CONTENT_SAMPLE = 'arrow-right';
const ICON_POSITION_SAMPLE = 'left';
const ICON_POSITION_HOVER_SAMPLE = 'right';
const ICON_ONLY_SAMPLE = true;
const ICON_ONLY_HOVER_SAMPLE = false;
const ICON_INHERIT_SAMPLE = false;
const ICON_INHERIT_HOVER_SAMPLE = true;
const ICON_STATUS_HOVER_SAMPLE = true;
const ICON_STATUS_HOVER_TARGET_SAMPLE = true;
const resolveIconBackgroundExpectedValue = (attribute, sample) => {
	const isHover = attribute.includes('-hover');
	const stripped = attribute
		.replace('icon-background-', '')
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
	return null;
};

const resolveBorderRadiusExpectedValue = attribute => {
	if (attribute.includes('border-sync-radius')) return 'all';
	if (attribute.includes('border-unit-radius')) return 'px';
	return attribute.includes('hover')
		? ICON_BORDER_RADIUS_HOVER_SAMPLE
		: ICON_BORDER_RADIUS_SAMPLE;
};

const resolvePaddingExpectedValue = (attribute, sample) => {
	if (attribute.includes('-unit-')) return sample.unit;
	if (attribute.includes('-sync-')) return sample.sync;
	return sample.value;
};

const resolveIconSpacingExpectedValue = attribute => {
	const sample = attribute.includes('hover')
		? ICON_SPACING_HOVER_SAMPLE
		: ICON_SPACING_SAMPLE;
	if (attribute.includes('unit')) return sample.unit;
	return sample.value;
};

const resolveIconSizeExpectedValue = attribute => {
	const isWidth = attribute.startsWith('icon-width');
	const sample = isWidth
		? attribute.includes('hover')
			? ICON_WIDTH_HOVER_SAMPLE
			: ICON_WIDTH_SAMPLE
		: attribute.includes('hover')
			? ICON_HEIGHT_HOVER_SAMPLE
			: ICON_HEIGHT_SAMPLE;

	if (attribute.includes('fit-content')) return sample.fitContent ?? false;
	if (attribute.includes('-unit-')) return sample.unit;
	return sample.value;
};

const resolveIconForceAspectRatioExpectedValue = attribute =>
	attribute.includes('hover')
		? ICON_FORCE_ASPECT_RATIO_HOVER_SAMPLE
		: ICON_FORCE_ASPECT_RATIO_SAMPLE;

const resolveIconPaletteExpectedValue = (attribute, sample) => {
	if (attribute.includes('palette-status')) return true;
	if (attribute.includes('palette-color')) return sample.palette;
	if (attribute.includes('palette-opacity')) return sample.opacity;
	if (attribute.includes('palette-sc-status')) return sample.scStatus;
	if (attribute.includes('color')) return '';
	return null;
};

const resolveStrokeWidthExpectedValue = attribute =>
	attribute.includes('hover') ? ICON_STROKE_WIDTH_HOVER_SAMPLE : ICON_STROKE_WIDTH_SAMPLE;

const buildExpectedForAttribute = attribute => {
	if (attribute === 'icon-content') {
		return {
			property: 'icon_content',
			value: ICON_CONTENT_SAMPLE,
			expectedKey: 'icon-content',
			expectedValue: ICON_CONTENT_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute === 'icon-content-hover') {
		return {
			property: 'icon_content_hover',
			value: ICON_CONTENT_SAMPLE,
			expectedKey: 'icon-content-hover',
			expectedValue: ICON_CONTENT_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute === 'icon-position') {
		return {
			property: 'icon_position',
			value: ICON_POSITION_SAMPLE,
			expectedKey: 'icon-position',
			expectedValue: ICON_POSITION_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute === 'icon-position-hover') {
		return {
			property: 'icon_position_hover',
			value: ICON_POSITION_HOVER_SAMPLE,
			expectedKey: 'icon-position-hover',
			expectedValue: ICON_POSITION_HOVER_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute === 'icon-only') {
		return {
			property: 'icon_only',
			value: ICON_ONLY_SAMPLE,
			expectedKey: 'icon-only',
			expectedValue: ICON_ONLY_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute === 'icon-only-hover') {
		return {
			property: 'icon_only_hover',
			value: ICON_ONLY_HOVER_SAMPLE,
			expectedKey: 'icon-only-hover',
			expectedValue: ICON_ONLY_HOVER_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute === 'icon-inherit') {
		return {
			property: 'icon_inherit',
			value: ICON_INHERIT_SAMPLE,
			expectedKey: 'icon-inherit',
			expectedValue: ICON_INHERIT_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute === 'icon-inherit-hover') {
		return {
			property: 'icon_inherit_hover',
			value: ICON_INHERIT_HOVER_SAMPLE,
			expectedKey: 'icon-inherit-hover',
			expectedValue: ICON_INHERIT_HOVER_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute === 'icon-status-hover') {
		return {
			property: 'icon_status_hover',
			value: ICON_STATUS_HOVER_SAMPLE,
			expectedKey: 'icon-status-hover',
			expectedValue: ICON_STATUS_HOVER_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute === 'icon-status-hover-target') {
		return {
			property: 'icon_status_hover_target',
			value: ICON_STATUS_HOVER_TARGET_SAMPLE,
			expectedKey: 'icon-status-hover-target',
			expectedValue: ICON_STATUS_HOVER_TARGET_SAMPLE,
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute.startsWith('icon-background-')) {
		const isHover = attribute.includes('hover');
		return {
			property: isHover ? 'icon_background_hover' : 'icon_background',
			value: ICON_BACKGROUND_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveIconBackgroundExpectedValue(
				attribute,
				ICON_BACKGROUND_SAMPLE
			),
			expectedSidebar: { tabIndex: 0, accordion: 'icon background' },
		};
	}

	if (attribute.startsWith('icon-border-')) {
		const isHover = attribute.includes('hover');
		if (attribute.includes('radius')) {
			return {
				property: isHover ? 'icon_border_radius_hover' : 'icon_border_radius',
				value: isHover ? ICON_BORDER_RADIUS_HOVER_SAMPLE : ICON_BORDER_RADIUS_SAMPLE,
				expectedKey: attribute,
				expectedValue: resolveBorderRadiusExpectedValue(attribute),
				expectedSidebar: { tabIndex: 0, accordion: 'icon border' },
			};
		}

		const sample = isHover ? ICON_BORDER_HOVER_SAMPLE : ICON_BORDER_SAMPLE;
		return {
			property: isHover ? 'icon_border_hover' : 'icon_border',
			value: sample,
			expectedKey: attribute,
			expectedValue: resolveBorderExpectedValue(attribute, sample),
			expectedSidebar: { tabIndex: 0, accordion: 'icon border' },
		};
	}

	if (attribute.startsWith('icon-padding-')) {
		return {
			property: 'icon_padding',
			value: ICON_PADDING_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolvePaddingExpectedValue(attribute, ICON_PADDING_SAMPLE),
			expectedSidebar: { tabIndex: 0, accordion: 'icon padding' },
		};
	}

	if (attribute.startsWith('icon-spacing-')) {
		const isHover = attribute.includes('hover');
		return {
			property: isHover ? 'icon_spacing_hover' : 'icon_spacing',
			value: isHover ? ICON_SPACING_HOVER_SAMPLE : ICON_SPACING_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveIconSpacingExpectedValue(attribute),
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute.startsWith('icon-width-') || attribute.startsWith('icon-height-')) {
		const isWidth = attribute.startsWith('icon-width-');
		const isHover = attribute.includes('hover');
		return {
			property: isWidth
				? isHover
					? 'icon_width_hover'
					: 'icon_width'
				: isHover
					? 'icon_height_hover'
					: 'icon_height',
			value: isWidth
				? isHover
					? ICON_WIDTH_HOVER_SAMPLE
					: ICON_WIDTH_SAMPLE
				: isHover
					? ICON_HEIGHT_HOVER_SAMPLE
					: ICON_HEIGHT_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveIconSizeExpectedValue(attribute),
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute.startsWith('icon-force-aspect-ratio-')) {
		const isHover = attribute.includes('hover');
		return {
			property: isHover
				? 'icon_force_aspect_ratio_hover'
				: 'icon_force_aspect_ratio',
			value: isHover
				? ICON_FORCE_ASPECT_RATIO_HOVER_SAMPLE
				: ICON_FORCE_ASPECT_RATIO_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveIconForceAspectRatioExpectedValue(attribute),
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute.startsWith('icon-fill-')) {
		const isHover = attribute.includes('hover');
		const sample = isHover ? ICON_FILL_HOVER_SAMPLE : ICON_FILL_SAMPLE;
		return {
			property: isHover ? 'icon_fill_color_hover' : 'icon_fill_color',
			value: sample,
			expectedKey: attribute,
			expectedValue: resolveIconPaletteExpectedValue(attribute, sample),
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	if (attribute.startsWith('icon-stroke-')) {
		const isHover = attribute.includes('hover');
		const isColor = attribute.includes('palette') || attribute.includes('color');
		if (isColor) {
			const sample = isHover ? ICON_STROKE_HOVER_SAMPLE : ICON_STROKE_SAMPLE;
			return {
				property: isHover
					? 'icon_stroke_color_hover'
					: 'icon_stroke_color',
				value: sample,
				expectedKey: attribute,
				expectedValue: resolveIconPaletteExpectedValue(attribute, sample),
				expectedSidebar: { tabIndex: 0, accordion: 'icon' },
			};
		}

		return {
			property: isHover ? 'icon_stroke_width_hover' : 'icon_stroke_width',
			value: isHover ? ICON_STROKE_WIDTH_HOVER_SAMPLE : ICON_STROKE_WIDTH_SAMPLE,
			expectedKey: attribute,
			expectedValue: resolveStrokeWidthExpectedValue(attribute),
			expectedSidebar: { tabIndex: 0, accordion: 'icon' },
		};
	}

	return null;
};
describe('button I attributes', () => {
	test('I-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set icon background to palette 4',
				property: 'icon_background',
				assert: action => action.value && action.value.palette === 4,
			},
			{
				phrase: 'On hover, set icon background palette 6',
				property: 'icon_background_hover',
				assert: action => action.value && action.value.palette === 6,
			},
			{
				phrase: 'Add a 2px solid icon border with palette 3',
				property: 'icon_border',
				assert: action => action.value && action.value.width === 2,
			},
			{
				phrase: 'On hover, make icon border 3px dashed palette 5',
				property: 'icon_border_hover',
				assert: action => action.value && action.value.width === 3,
			},
			{
				phrase: 'Round icon corners to 8px',
				property: 'icon_border_radius',
				value: 8,
			},
			{
				phrase: 'Set icon padding to 6px',
				property: 'icon_padding',
				assert: action => action.value && action.value.value === 6,
			},
			{
				phrase: 'Set icon spacing to 12px',
				property: 'icon_spacing',
				assert: action => action.value && action.value.value === 12,
			},
			{
				phrase: 'Set icon width to 24px',
				property: 'icon_width',
				assert: action => action.value && action.value.value === 24,
			},
			{
				phrase: 'Set icon height to 20px',
				property: 'icon_height',
				assert: action => action.value && action.value.value === 20,
			},
			{
				phrase: 'Set icon fill to palette 2',
				property: 'icon_fill_color',
				value: 2,
			},
			{
				phrase: 'Set icon stroke to palette 5',
				property: 'icon_stroke_color',
				value: 5,
			},
			{
				phrase: 'Set icon stroke width to 2',
				property: 'icon_stroke_width',
				value: 2,
			},
			{
				phrase: 'Move icon to the left',
				property: 'icon_position',
				value: 'left',
			},
			{
				phrase: 'Make icon only',
				property: 'icon_only',
				value: true,
			},
			{
				phrase: 'Let the icon inherit text color',
				property: 'icon_inherit',
				value: true,
			},
			{
				phrase: 'Change icon to arrow-right',
				property: 'icon_content',
				value: 'arrow-right',
			},
			{
				phrase: 'Enable icon hover',
				property: 'icon_status_hover',
				value: true,
			},
		];

		samples.forEach(sample => {
			const action = buildButtonIGroupAction(sample.phrase);
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

	test('each I attribute can be updated via I-group mapping', () => {
		const missing = [];

		iAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || config.expectedValue === null || config.expectedValue === undefined) {
				missing.push(attribute);
				return;
			}

			const changes = buildButtonIGroupAttributeChanges(
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

	test('I-group properties map to sidebar targets', () => {
		const missing = [];
		iAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}
			if (config.expectedSidebar === null) {
				return;
			}

			const sidebar = getButtonIGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
