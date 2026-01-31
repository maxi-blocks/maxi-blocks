import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerSGroupAction,
	buildContainerSGroupAttributeChanges,
	getContainerSGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const sAttributes = containerAttributes.filter(attr => /^s/i.test(attr));

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const SCROLL_SPEED_VALUE = 600;
const SCROLL_DELAY_VALUE = 200;
const SCROLL_EASING_VALUE = 'ease-in-out';
const SCROLL_VIEWPORT_TOP_VALUE = 'mid';
const SCROLL_ZONES_VALUE = { 0: 0, 50: 50, 100: 100 };
const SCROLL_UNIT_VALUE = 'px';

const SHAPE_HEIGHT_VALUE = 120;
const SHAPE_OPACITY_VALUE = 0.6;
const SHAPE_COLOR_VALUE = '#ffffff';
const SHAPE_PALETTE_COLOR = 3;
const SHAPE_PALETTE_OPACITY = 70;

const scrollAttrMap = {
	'status': { prop: 'status', value: true, usesBreakpoint: true },
	'speed': { prop: 'speed', value: SCROLL_SPEED_VALUE, usesBreakpoint: true },
	'delay': { prop: 'delay', value: SCROLL_DELAY_VALUE, usesBreakpoint: false },
	'easing': { prop: 'easing', value: SCROLL_EASING_VALUE, usesBreakpoint: true },
	'viewport-top': {
		prop: 'viewport_top',
		value: SCROLL_VIEWPORT_TOP_VALUE,
		usesBreakpoint: true,
	},
	'zones': { prop: 'zones', value: SCROLL_ZONES_VALUE, usesBreakpoint: true },
	'preview-status': { prop: 'preview_status', value: true, usesBreakpoint: false },
	'is-block-zone': { prop: 'is_block_zone', value: true, usesBreakpoint: false },
	'status-reverse': { prop: 'status_reverse', value: true, usesBreakpoint: false },
	'unit': { prop: 'unit', value: SCROLL_UNIT_VALUE, usesBreakpoint: false },
};

const buildExpectedForAttribute = attribute => {
	if (attribute.startsWith('scroll-')) {
		const match = attribute.match(/^scroll-([A-Za-z]+)-(.+)$/);
		if (!match) return null;
		const effect = match[1];
		const suffix = match[2];
		const parts = suffix.split('-');
		const maybeBp = parts[parts.length - 1];
		const hasBreakpoint = BREAKPOINTS.includes(maybeBp);
		const attrKey = hasBreakpoint ? parts.slice(0, -1).join('-') : suffix;
		const mapping = scrollAttrMap[attrKey];
		if (!mapping) return null;

		const property = `scroll_${effect}_${mapping.prop}`;
		const value = mapping.usesBreakpoint
			? { value: mapping.value, breakpoint: maybeBp }
			: mapping.value;

		return {
			property,
			value,
			expectedKey: attribute,
			expectedValue: mapping.value,
			expectDeepEqual: attrKey === 'zones',
			expectedSidebar: { tabIndex: 1, accordion: 'scroll effects' },
		};
	}

	if (attribute.startsWith('shape-divider-')) {
		const match = attribute.match(/^shape-divider-(top|bottom)-(.+)$/);
		if (!match) return null;
		const position = match[1];
		const suffix = match[2];
		const parts = suffix.split('-');
		const maybeBp = parts[parts.length - 1];
		const hasBreakpoint = BREAKPOINTS.includes(maybeBp);
		const attrKey = hasBreakpoint ? parts.slice(0, -1).join('-') : suffix;

		if (attrKey === 'status') {
			return {
				property: `shape_divider_${position}_status`,
				value: true,
				expectedKey: attribute,
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'shape-style') {
			return {
				property: `shape_divider_${position}_shape_style`,
				value: 'wave',
				expectedKey: attribute,
				expectedValue: 'wave',
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'effects-status') {
			return {
				property: `shape_divider_${position}_effects_status`,
				value: true,
				expectedKey: attribute,
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'height') {
			return {
				property: `shape_divider_${position}_height`,
				value: { value: SHAPE_HEIGHT_VALUE, unit: 'px', breakpoint: maybeBp },
				expectedKey: attribute,
				expectedValue: SHAPE_HEIGHT_VALUE,
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'height-unit') {
			return {
				property: `shape_divider_${position}_height`,
				value: { value: SHAPE_HEIGHT_VALUE, unit: 'px', breakpoint: maybeBp },
				expectedKey: attribute,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'opacity') {
			return {
				property: `shape_divider_${position}_opacity`,
				value: { value: SHAPE_OPACITY_VALUE, breakpoint: maybeBp },
				expectedKey: attribute,
				expectedValue: SHAPE_OPACITY_VALUE,
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'color') {
			return {
				property: `shape_divider_${position}_color`,
				value: { value: SHAPE_COLOR_VALUE, breakpoint: maybeBp },
				expectedKey: attribute,
				expectedValue: SHAPE_COLOR_VALUE,
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'palette-color') {
			return {
				property: `shape_divider_${position}_palette_color`,
				value: { value: SHAPE_PALETTE_COLOR, breakpoint: maybeBp },
				expectedKey: attribute,
				expectedValue: SHAPE_PALETTE_COLOR,
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'palette-opacity') {
			return {
				property: `shape_divider_${position}_palette_opacity`,
				value: { value: SHAPE_PALETTE_OPACITY, breakpoint: maybeBp },
				expectedKey: attribute,
				expectedValue: SHAPE_PALETTE_OPACITY,
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'palette-status') {
			return {
				property: `shape_divider_${position}_palette_status`,
				value: { value: true, breakpoint: maybeBp },
				expectedKey: attribute,
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		if (attrKey === 'palette-sc-status') {
			return {
				property: `shape_divider_${position}_palette_sc_status`,
				value: { value: false, breakpoint: maybeBp },
				expectedKey: attribute,
				expectedValue: false,
				expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
			};
		}

		return null;
	}

	if (attribute === 'shortcutEffect') {
		return {
			property: 'shortcut_effect',
			value: 1,
			expectedKey: attribute,
			expectedValue: 1,
			expectedSidebar: { tabIndex: 1, accordion: 'scroll effects' },
		};
	}

	if (attribute === 'shortcutEffectType') {
		const shortcutValue = { fade: 2 };
		return {
			property: 'shortcut_effect_type',
			value: shortcutValue,
			expectedKey: attribute,
			expectedValue: shortcutValue,
			expectDeepEqual: true,
			expectedSidebar: { tabIndex: 1, accordion: 'scroll effects' },
		};
	}

	if (attribute === 'show-warning-box') {
		return {
			property: 'show_warning_box',
			value: false,
			expectedKey: attribute,
			expectedValue: false,
			expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
		};
	}

	if (attribute === 'size-advanced-options') {
		return {
			property: 'size_advanced_options',
			value: true,
			expectedKey: attribute,
			expectedValue: true,
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	return null;
};

describe('container S attributes', () => {
	test('S-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Enable scroll fade',
				property: 'scroll_fade_status',
				value: true,
			},
			{
				phrase: 'Set scroll blur speed to 600',
				property: 'scroll_blur_speed',
				value: 600,
			},
			{
				phrase: 'Set scroll rotate easing to ease-in-out',
				property: 'scroll_rotate_easing',
				value: 'ease-in-out',
			},
			{
				phrase: 'Set scroll vertical delay to 200',
				property: 'scroll_vertical_delay',
				value: 200,
			},
			{
				phrase: 'Set scroll horizontal viewport to top',
				property: 'scroll_horizontal_viewport_top',
				value: 'top',
			},
			{
				phrase: 'Set top shape divider height to 120px',
				property: 'shape_divider_top_height',
				assert: action => action.value && action.value.value === 120,
			},
			{
				phrase: 'Set bottom shape divider opacity to 60%',
				property: 'shape_divider_bottom_opacity',
				assert: action => action.value === 0.6,
			},
			{
				phrase: 'Set top shape divider color to #ffffff',
				property: 'shape_divider_top_color',
				value: '#ffffff',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerSGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			} else if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
		});
	});

	test('scroll speed enables status for the active breakpoint', () => {
		const changes = buildContainerSGroupAttributeChanges(
			'scroll_blur_speed',
			{ value: 600, breakpoint: 'xl' }
		);

		expect(changes['scroll-blur-speed-xl']).toBe(600);
		expect(changes['scroll-blur-status-xl']).toBe(true);
	});

	test('each S attribute can be updated via S-group mapping', () => {
		const missing = [];

		sAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerSGroupAttributeChanges(
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

			if (config.expectDeepEqual) {
				expect(changes[config.expectedKey]).toEqual(config.expectedValue);
			} else {
				expect(changes[config.expectedKey]).toBe(config.expectedValue);
			}
		});

		expect(missing).toEqual([]);
	});

	test('S-group properties map to sidebar targets', () => {
		const missing = [];

		sAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerSGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
