import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildButtonAGroupAction,
	buildButtonAGroupAttributeChanges,
	getButtonAGroupSidebarTarget,
	buildButtonBGroupAction,
	buildButtonBGroupAttributeChanges,
	getButtonBGroupSidebarTarget,
	buildButtonCGroupAction,
	buildButtonCGroupAttributeChanges,
	getButtonCGroupSidebarTarget,
	buildButtonIGroupAction,
	buildButtonIGroupAttributeChanges,
	getButtonIGroupSidebarTarget,
} from '../ai/utils/buttonGroups';

const buttonAttributes = rawAttributes.blocks['button-maxi'] || [];

describe('button A attributes', () => {
	const aAttributes = buttonAttributes.filter(
		attr =>
			/^a/i.test(attr) &&
			!attr.startsWith('advanced-css-') &&
			attr !== 'anchorLink' &&
			attr !== 'ariaLabels'
	);

	const getBreakpoint = attribute => attribute.split('-').pop();

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('align-content-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'align_content',
				value: { value: 'space-between', breakpoint },
				expectedKey: `align-content-${breakpoint}`,
				expectedValue: 'space-between',
				expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('align-items-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'align_items',
				value: { value: 'center', breakpoint },
				expectedKey: `align-items-${breakpoint}`,
				expectedValue: 'center',
				expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('alignment-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'alignment',
				value: { value: 'left', breakpoint },
				expectedKey: `alignment-${breakpoint}`,
				expectedValue: 'left',
				expectedSidebar: { tabIndex: 0, accordion: 'alignment' },
			};
		}

		return null;
	};

	test('A-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set the button anchor ID to hero-cta',
				property: 'anchor_link',
				value: 'hero-cta',
			},
			{
				phrase: 'Set button aria label to "Primary CTA"',
				property: 'aria_label',
				value: 'Primary CTA',
			},
			{
				phrase: 'Align button left',
				property: 'alignment',
				value: 'left',
			},
			{
				phrase: 'Align items center',
				property: 'align_items',
				value: 'center',
			},
			{
				phrase: 'Align content space between',
				property: 'align_content',
				value: 'space-between',
			},
			{
				phrase: 'On mobile, align items center',
				property: 'align_items',
				value: { value: 'center', breakpoint: 'xs' },
			},
			{
				phrase: 'On tablet, align content space evenly',
				property: 'align_content',
				value: { value: 'space-evenly', breakpoint: 'm' },
			},
			{
				phrase: 'On desktop, align button right',
				property: 'alignment',
				value: { value: 'right', breakpoint: 'xl' },
			},
		];

		samples.forEach(sample => {
			const action = buildButtonAGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('each A attribute can be updated via A-group mapping', () => {
		const missing = [];
		const attributes = { ariaLabels: { icon: 'Decorative' } };

		aAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildButtonAGroupAttributeChanges(
				config.property,
				config.value,
				{ attributes }
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('A-group breakpoint prompts update the expected attribute and sidebar', () => {
		const samples = [
			{
				phrase: 'On mobile, align items center',
				expectedKey: 'align-items-xs',
				expectedValue: 'center',
				expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
			},
			{
				phrase: 'On tablet, align content space evenly',
				expectedKey: 'align-content-m',
				expectedValue: 'space-evenly',
				expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
			},
			{
				phrase: 'On desktop, align button right',
				expectedKey: 'alignment-xl',
				expectedValue: 'right',
				expectedSidebar: { tabIndex: 0, accordion: 'alignment' },
			},
		];

		samples.forEach(sample => {
			const action = buildButtonAGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			const changes = buildButtonAGroupAttributeChanges(
				action.property,
				action.value,
				{ attributes: {} }
			);
			expect(changes).toBeTruthy();
			expect(changes[sample.expectedKey]).toBe(sample.expectedValue);

			const sidebar = getButtonAGroupSidebarTarget(action.property);
			expect(sidebar).toEqual(sample.expectedSidebar);
		});
	});

	test('A-group properties map to sidebar targets', () => {
		const missing = [];
		aAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getButtonAGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('button B attributes', () => {
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

describe('button C attributes', () => {
	const cAttributes = buttonAttributes.filter(attr => /^c/i.test(attr));

	const getBreakpoint = attribute => attribute.split('-').pop();

	const parseColorAttribute = attribute => {
		const isHover = attribute.endsWith('-hover');
		const base = isHover ? attribute.replace(/-hover$/, '') : attribute;
		const breakpoint = base.replace('color-', '');
		return { isHover, breakpoint };
	};

	const TEXT_COLOR_SAMPLE = '#ff0055';
	const TEXT_COLOR_HOVER_SAMPLE = '#00aaee';
	const COLUMN_GAP_SAMPLE = { value: 16, unit: 'px' };
	const CUSTOM_CSS_SAMPLE = 'display: block;';
	const CUSTOM_FORMATS_SAMPLE = {
		'cta-highlight': { 'text-decoration-general': 'underline' },
	};

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('color-')) {
			const { isHover, breakpoint } = parseColorAttribute(attribute);
			return {
				property: isHover ? 'button_hover_text' : 'text_color',
				value: {
					value: isHover ? TEXT_COLOR_HOVER_SAMPLE : TEXT_COLOR_SAMPLE,
					breakpoint,
				},
				expectedKey: attribute,
				expectedValue: isHover ? TEXT_COLOR_HOVER_SAMPLE : TEXT_COLOR_SAMPLE,
				expectedSidebar: { tabIndex: 0, accordion: 'typography' },
			};
		}

		if (attribute.startsWith('column-gap-unit-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'column_gap',
				value: { ...COLUMN_GAP_SAMPLE, breakpoint },
				expectedKey: `column-gap-unit-${breakpoint}`,
				expectedValue: COLUMN_GAP_SAMPLE.unit,
				expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('column-gap-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'column_gap',
				value: { ...COLUMN_GAP_SAMPLE, breakpoint },
				expectedKey: `column-gap-${breakpoint}`,
				expectedValue: COLUMN_GAP_SAMPLE.value,
				expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('custom-css-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'custom_css',
				value: {
					css: CUSTOM_CSS_SAMPLE,
					category: 'button',
					index: 'normal',
					breakpoint,
				},
				expectedKey: `custom-css-${breakpoint}`,
				expectedValue: { button: { normal: CUSTOM_CSS_SAMPLE } },
				expectedSidebar: { tabIndex: 2, accordion: 'custom css' },
			};
		}

		if (attribute === 'customLabel') {
			return {
				property: 'custom_label',
				value: 'Primary CTA',
				expectedKey: 'customLabel',
				expectedValue: 'Primary CTA',
				expectedSidebar: { tabIndex: 0, accordion: 'block settings' },
			};
		}

		if (attribute === 'custom-formats') {
			return {
				property: 'custom_formats',
				value: CUSTOM_FORMATS_SAMPLE,
				expectedKey: 'custom-formats',
				expectedValue: CUSTOM_FORMATS_SAMPLE,
				expectedSidebar: { tabIndex: 0, accordion: 'typography' },
			};
		}

		if (attribute === 'custom-formats-hover') {
			return {
				property: 'custom_formats_hover',
				value: CUSTOM_FORMATS_SAMPLE,
				expectedKey: 'custom-formats-hover',
				expectedValue: CUSTOM_FORMATS_SAMPLE,
				expectedSidebar: { tabIndex: 0, accordion: 'typography' },
			};
		}

		return null;
	};

	test('C-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set button text color to palette 3',
				property: 'text_color',
				value: 3,
			},
			{
				phrase: 'On hover, set button text color to palette 5',
				property: 'button_hover_text',
				value: 5,
			},
			{
				phrase: 'Set column gap to 16px',
				property: 'column_gap',
				assert: action => action.value && action.value.value === 16,
			},
			{
				phrase: 'Add custom CSS to the button: display: block;',
				property: 'custom_css',
				assert: action => action.value && action.value.css === 'display: block;',
			},
			{
				phrase: 'Set custom label to "Primary CTA"',
				property: 'custom_label',
				value: 'Primary CTA',
			},
		];

		samples.forEach(sample => {
			const action = buildButtonCGroupAction(sample.phrase);
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

	test('each C attribute can be updated via C-group mapping', () => {
		const missing = [];

		cAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildButtonCGroupAttributeChanges(
				config.property,
				config.value,
				{ attributes: {} }
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

	test('C-group properties map to sidebar targets', () => {
		const missing = [];
		cAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getButtonCGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('button I attributes', () => {
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

