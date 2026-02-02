import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildTextCGroupAction,
	buildTextCGroupAttributeChanges,
	getTextCGroupSidebarTarget,
	buildTextListGroupAction,
	buildTextListGroupAttributeChanges,
	getTextListGroupSidebarTarget,
	buildTextLGroupAction,
	buildTextLGroupAttributeChanges,
	getTextLGroupSidebarTarget,
	buildTextPGroupAction,
	buildTextPGroupAttributeChanges,
	getTextPGroupSidebarTarget,
	getTextTypographySidebarTarget,
} from '../ai/utils/textGroup';
import { TEXT_PATTERNS, handleTextUpdate } from '../ai/blocks/text';

const textAttributes = rawAttributes.blocks['text-maxi'] || [];

describe('text C attributes', () => {
	const cAttributes = textAttributes.filter(
		attr =>
			/^c/i.test(attr) &&
			!attr.startsWith('column-gap') &&
			!attr.startsWith('custom-css') &&
			attr !== 'content' &&
			attr !== 'customLabel'
	);

	const parseColorAttribute = attribute => {
		const isHover = attribute.endsWith('-hover');
		const base = isHover ? attribute.replace(/-hover$/, '') : attribute;
		const breakpoint = base.replace('color-', '');
		return { isHover, breakpoint };
	};

	const TEXT_COLOR_SAMPLE = '#ff0055';
	const TEXT_COLOR_HOVER_SAMPLE = '#00aaee';
	const CUSTOM_FORMATS_SAMPLE = {
		'cta-highlight': { 'text-decoration-general': 'underline' },
	};
	const CUSTOM_FORMATS_JSON = '{"cta-highlight":{"text-decoration-general":"underline"}}';

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('color-')) {
			const { isHover, breakpoint } = parseColorAttribute(attribute);
			return {
				property: isHover ? 'text_color_hover' : 'text_color',
				value: {
					value: isHover ? TEXT_COLOR_HOVER_SAMPLE : TEXT_COLOR_SAMPLE,
					breakpoint,
				},
				expectedKey: attribute,
				expectedValue: isHover ? TEXT_COLOR_HOVER_SAMPLE : TEXT_COLOR_SAMPLE,
				expectedSidebar: { tabIndex: 0, accordion: 'typography' },
			};
		}

		if (attribute === 'custom-formats') {
			return {
				property: 'custom_formats',
				value: CUSTOM_FORMATS_SAMPLE,
				expectedKey: attribute,
				expectedValue: CUSTOM_FORMATS_SAMPLE,
				expectDeepEqual: true,
				expectedSidebar: { tabIndex: 0, accordion: 'typography' },
			};
		}

		if (attribute === 'custom-formats-hover') {
			return {
				property: 'custom_formats_hover',
				value: CUSTOM_FORMATS_SAMPLE,
				expectedKey: attribute,
				expectedValue: CUSTOM_FORMATS_SAMPLE,
				expectDeepEqual: true,
				expectedSidebar: { tabIndex: 0, accordion: 'typography' },
			};
		}

		return null;
	};

	test('C-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set text color to palette 3',
				property: 'text_color',
				value: 3,
			},
			{
				phrase: 'On hover, set text color to #00aaee',
				property: 'text_color_hover',
				value: '#00aaee',
			},
			{
				phrase: 'On tablet, set text color to #ff0055',
				property: 'text_color',
				value: { value: '#ff0055', breakpoint: 'm' },
			},
			{
				phrase: 'Enable text hover styles',
				property: 'typography_status_hover',
				value: true,
			},
			{
				phrase: `Set custom formats to ${CUSTOM_FORMATS_JSON}`,
				property: 'custom_formats',
				value: CUSTOM_FORMATS_SAMPLE,
			},
			{
				phrase: `On hover, set custom formats to ${CUSTOM_FORMATS_JSON}`,
				property: 'custom_formats_hover',
				value: CUSTOM_FORMATS_SAMPLE,
			},
		];

		samples.forEach(sample => {
			const action = buildTextCGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('C-group hover color enables typography hover', () => {
		const changes = buildTextCGroupAttributeChanges(
			'text_color_hover',
			TEXT_COLOR_HOVER_SAMPLE
		);

		expect(changes['typography-status-hover']).toBe(true);
	});

	test('each C attribute can be updated via C-group mapping', () => {
		const missing = [];

		cAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildTextCGroupAttributeChanges(
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

	test('C-group properties map to sidebar targets', () => {
		const missing = [];

		cAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getTextCGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('text L attributes', () => {
	const lAttributes = textAttributes.filter(attr => attr.startsWith('link-'));

	const STATE_SAMPLES = {
		base: {
			color: '#ff0055',
			paletteColor: 3,
			paletteOpacity: 0.7,
			paletteStatus: true,
			paletteScStatus: false,
		},
		hover: {
			color: '#00aaee',
			paletteColor: 4,
			paletteOpacity: 0.5,
			paletteStatus: false,
			paletteScStatus: true,
		},
		active: {
			color: '#22cc88',
			paletteColor: 5,
			paletteOpacity: 0.6,
			paletteStatus: true,
			paletteScStatus: false,
		},
		visited: {
			color: '#aa00ff',
			paletteColor: 6,
			paletteOpacity: 0.4,
			paletteStatus: false,
			paletteScStatus: true,
		},
	};

	const buildExpectedForAttribute = attribute => {
		const match = attribute.match(
			/^link-(?:(hover|active|visited)-)?(color|palette-color|palette-opacity|palette-status|palette-sc-status)-(general|xxl|xl|l|m|s|xs)$/
		);
		if (!match) return null;

		const state = match[1] || 'base';
		const type = match[2];
		const breakpoint = match[3];
		const samples = STATE_SAMPLES[state] || STATE_SAMPLES.base;

		const propertyMap = {
			color: 'link_color',
			'palette-color': 'link_palette_color',
			'palette-opacity': 'link_palette_opacity',
			'palette-status': 'link_palette_status',
			'palette-sc-status': 'link_palette_sc_status',
		};

		const valueMap = {
			color: samples.color,
			'palette-color': samples.paletteColor,
			'palette-opacity': samples.paletteOpacity,
			'palette-status': samples.paletteStatus,
			'palette-sc-status': samples.paletteScStatus,
		};

		const property = `${propertyMap[type]}${state === 'base' ? '' : `_${state}`}`;
		const sidebarState = state === 'base' ? 'link' : state;

		return {
			property,
			value: { value: valueMap[type], breakpoint },
			expectedKey: attribute,
			expectedValue: valueMap[type],
			expectedSidebar: {
				tabIndex: 0,
				accordion: 'link',
				state: sidebarState,
			},
		};
	};

	test('L-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set link color to #ff0055',
				property: 'link_color',
				value: '#ff0055',
			},
			{
				phrase: 'Set link hover color to palette 4',
				property: 'link_palette_color_hover',
				value: 4,
			},
			{
				phrase: 'Set link active palette opacity to 60%',
				property: 'link_palette_opacity_active',
				value: 0.6,
			},
			{
				phrase: 'Disable link palette',
				property: 'link_palette_status',
				value: false,
			},
			{
				phrase: 'Use style card palette for link hover',
				property: 'link_palette_sc_status_hover',
				value: true,
			},
			{
				phrase: 'On tablet, set link palette color to 3',
				property: 'link_palette_color',
				value: { value: 3, breakpoint: 'm' },
			},
		];

		samples.forEach(sample => {
			const action = buildTextLGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('each L attribute can be updated via L-group mapping', () => {
		const missing = [];

		lAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildTextLGroupAttributeChanges(
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

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('L-group properties map to sidebar targets', () => {
		const missing = [];

		lAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getTextLGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('text list attributes', () => {
	const LIST_ATTRIBUTE_PATTERNS = [
		/^list-gap-(general|xxl|xl|l|m|s|xs)$/,
		/^list-gap-unit-(general|xxl|xl|l|m|s|xs)$/,
		/^list-indent-(general|xxl|xl|l|m|s|xs)$/,
		/^list-indent-unit-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-indent-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-indent-unit-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-size-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-size-unit-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-height-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-height-unit-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-line-height-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-line-height-unit-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-vertical-offset-(general|xxl|xl|l|m|s|xs)$/,
		/^list-marker-vertical-offset-unit-(general|xxl|xl|l|m|s|xs)$/,
		/^list-paragraph-spacing-(general|xxl|xl|l|m|s|xs)$/,
		/^list-paragraph-spacing-unit-(general|xxl|xl|l|m|s|xs)$/,
		/^list-style-position-(general|xxl|xl|l|m|s|xs)$/,
		/^list-text-position-(general|xxl|xl|l|m|s|xs)$/,
		/^list-color$/,
		/^list-color-(general|xxl|xl|l|m|s|xs)(-hover)?$/,
		/^list-palette-(color|opacity|status|sc-status)$/,
		/^list-palette-(color|opacity|status|sc-status)-(general|xxl|xl|l|m|s|xs)(-hover)?$/,
	];

	const listAttributes = textAttributes.filter(
		attr =>
			LIST_ATTRIBUTE_PATTERNS.some(pattern => pattern.test(attr)) ||
			[
				'isList',
				'listReversed',
				'listStart',
				'listStyle',
				'listStyleCustom',
				'typeOfList',
			].includes(attr)
	);

	const LIST_INDENT = 24;
	const LIST_GAP = 1.5;
	const LIST_MARKER_INDENT = 0.5;
	const LIST_MARKER_SIZE = 1.5;
	const LIST_MARKER_HEIGHT = 1.25;
	const LIST_MARKER_LINE_HEIGHT = 1.1;
	const LIST_MARKER_OFFSET = 4;
	const LIST_PARAGRAPH_SPACING = 1.25;
	const LIST_STYLE_POSITION = 'inside';
	const LIST_TEXT_POSITION = 'middle';
	const LIST_COLOR = '#ff0055';
	const LIST_COLOR_HOVER = '#00aaee';
	const LIST_PALETTE_COLOR = 4;
	const LIST_PALETTE_COLOR_HOVER = 6;
	const LIST_PALETTE_OPACITY = 0.6;
	const LIST_PALETTE_OPACITY_HOVER = 0.4;
	const LIST_PALETTE_STATUS = true;
	const LIST_PALETTE_STATUS_HOVER = false;
	const LIST_PALETTE_SC_STATUS = true;
	const LIST_PALETTE_SC_STATUS_HOVER = false;
	const LIST_START = 3;

	const buildExpectedForAttribute = attribute => {
		if (attribute === 'isList') {
			return {
				property: 'is_list',
				value: true,
				expectedKey: attribute,
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'typeOfList') {
			return {
				property: 'list_type',
				value: 'ol',
				expectedKey: attribute,
				expectedValue: 'ol',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'listStyle') {
			return {
				property: 'list_style',
				value: 'square',
				expectedKey: attribute,
				expectedValue: 'square',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'listStyleCustom') {
			return {
				property: 'list_style_custom',
				value: '*',
				expectedKey: attribute,
				expectedValue: '*',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'listStart') {
			return {
				property: 'list_start',
				value: LIST_START,
				expectedKey: attribute,
				expectedValue: LIST_START,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'listReversed') {
			return {
				property: 'list_reversed',
				value: true,
				expectedKey: attribute,
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const listColorMatch = attribute.match(
			/^list-color-(general|xxl|xl|l|m|s|xs)(-hover)?$/
		);
		if (listColorMatch) {
			const breakpoint = listColorMatch[1];
			const isHover = Boolean(listColorMatch[2]);
			const color = isHover ? LIST_COLOR_HOVER : LIST_COLOR;
			return {
				property: isHover ? 'list_color_hover' : 'list_color',
				value: { value: color, breakpoint },
				expectedKey: attribute,
				expectedValue: color,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'list-color') {
			return {
				property: 'list_color',
				value: LIST_COLOR,
				expectedKey: attribute,
				expectedValue: LIST_COLOR,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const listPaletteMatch = attribute.match(
			/^list-palette-(color|opacity|status|sc-status)-(general|xxl|xl|l|m|s|xs)(-hover)?$/
		);
		if (listPaletteMatch) {
			const type = listPaletteMatch[1];
			const breakpoint = listPaletteMatch[2];
			const isHover = Boolean(listPaletteMatch[3]);
			const paletteValueMap = {
				color: isHover ? LIST_PALETTE_COLOR_HOVER : LIST_PALETTE_COLOR,
				opacity: isHover ? LIST_PALETTE_OPACITY_HOVER : LIST_PALETTE_OPACITY,
				status: isHover ? LIST_PALETTE_STATUS_HOVER : LIST_PALETTE_STATUS,
				'sc-status': isHover
					? LIST_PALETTE_SC_STATUS_HOVER
					: LIST_PALETTE_SC_STATUS,
			};
			const propertyMap = {
				color: isHover ? 'list_palette_color_hover' : 'list_palette_color',
				opacity: isHover
					? 'list_palette_opacity_hover'
					: 'list_palette_opacity',
				status: isHover ? 'list_palette_status_hover' : 'list_palette_status',
				'sc-status': isHover
					? 'list_palette_sc_status_hover'
					: 'list_palette_sc_status',
			};

			return {
				property: propertyMap[type],
				value: { value: paletteValueMap[type], breakpoint },
				expectedKey: attribute,
				expectedValue: paletteValueMap[type],
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'list-palette-color') {
			return {
				property: 'list_palette_color',
				value: LIST_PALETTE_COLOR,
				expectedKey: attribute,
				expectedValue: LIST_PALETTE_COLOR,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'list-palette-opacity') {
			return {
				property: 'list_palette_opacity',
				value: LIST_PALETTE_OPACITY,
				expectedKey: attribute,
				expectedValue: LIST_PALETTE_OPACITY,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'list-palette-status') {
			return {
				property: 'list_palette_status',
				value: LIST_PALETTE_STATUS,
				expectedKey: attribute,
				expectedValue: LIST_PALETTE_STATUS,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		if (attribute === 'list-palette-sc-status') {
			return {
				property: 'list_palette_sc_status',
				value: LIST_PALETTE_SC_STATUS,
				expectedKey: attribute,
				expectedValue: LIST_PALETTE_SC_STATUS,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const listIndentUnitMatch = attribute.match(
			/^list-indent-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (listIndentUnitMatch) {
			const breakpoint = listIndentUnitMatch[1];
			return {
				property: 'list_indent',
				value: { value: LIST_INDENT, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const listGapUnitMatch = attribute.match(
			/^list-gap-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (listGapUnitMatch) {
			const breakpoint = listGapUnitMatch[1];
			return {
				property: 'list_gap',
				value: { value: LIST_GAP, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: 'em',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const listGapMatch = attribute.match(
			/^list-gap-(general|xxl|xl|l|m|s|xs)$/
		);
		if (listGapMatch) {
			const breakpoint = listGapMatch[1];
			return {
				property: 'list_gap',
				value: { value: LIST_GAP, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_GAP,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const listIndentMatch = attribute.match(
			/^list-indent-(general|xxl|xl|l|m|s|xs)$/
		);
		if (listIndentMatch) {
			const breakpoint = listIndentMatch[1];
			return {
				property: 'list_indent',
				value: { value: LIST_INDENT, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_INDENT,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerHeightUnitMatch = attribute.match(
			/^list-marker-height-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerHeightUnitMatch) {
			const breakpoint = markerHeightUnitMatch[1];
			return {
				property: 'list_marker_height',
				value: { value: LIST_MARKER_HEIGHT, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: 'em',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerHeightMatch = attribute.match(
			/^list-marker-height-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerHeightMatch) {
			const breakpoint = markerHeightMatch[1];
			return {
				property: 'list_marker_height',
				value: { value: LIST_MARKER_HEIGHT, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_MARKER_HEIGHT,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerLineHeightUnitMatch = attribute.match(
			/^list-marker-line-height-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerLineHeightUnitMatch) {
			const breakpoint = markerLineHeightUnitMatch[1];
			return {
				property: 'list_marker_line_height',
				value: { value: LIST_MARKER_LINE_HEIGHT, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: 'em',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerLineHeightMatch = attribute.match(
			/^list-marker-line-height-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerLineHeightMatch) {
			const breakpoint = markerLineHeightMatch[1];
			return {
				property: 'list_marker_line_height',
				value: { value: LIST_MARKER_LINE_HEIGHT, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_MARKER_LINE_HEIGHT,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerIndentUnitMatch = attribute.match(
			/^list-marker-indent-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerIndentUnitMatch) {
			const breakpoint = markerIndentUnitMatch[1];
			return {
				property: 'list_marker_indent',
				value: { value: LIST_MARKER_INDENT, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: 'em',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerIndentMatch = attribute.match(
			/^list-marker-indent-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerIndentMatch) {
			const breakpoint = markerIndentMatch[1];
			return {
				property: 'list_marker_indent',
				value: { value: LIST_MARKER_INDENT, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_MARKER_INDENT,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerSizeUnitMatch = attribute.match(
			/^list-marker-size-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerSizeUnitMatch) {
			const breakpoint = markerSizeUnitMatch[1];
			return {
				property: 'list_marker_size',
				value: { value: LIST_MARKER_SIZE, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: 'em',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerSizeMatch = attribute.match(
			/^list-marker-size-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerSizeMatch) {
			const breakpoint = markerSizeMatch[1];
			return {
				property: 'list_marker_size',
				value: { value: LIST_MARKER_SIZE, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_MARKER_SIZE,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerOffsetUnitMatch = attribute.match(
			/^list-marker-vertical-offset-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerOffsetUnitMatch) {
			const breakpoint = markerOffsetUnitMatch[1];
			return {
				property: 'list_marker_vertical_offset',
				value: { value: LIST_MARKER_OFFSET, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const markerOffsetMatch = attribute.match(
			/^list-marker-vertical-offset-(general|xxl|xl|l|m|s|xs)$/
		);
		if (markerOffsetMatch) {
			const breakpoint = markerOffsetMatch[1];
			return {
				property: 'list_marker_vertical_offset',
				value: { value: LIST_MARKER_OFFSET, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_MARKER_OFFSET,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const paragraphUnitMatch = attribute.match(
			/^list-paragraph-spacing-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (paragraphUnitMatch) {
			const breakpoint = paragraphUnitMatch[1];
			return {
				property: 'list_paragraph_spacing',
				value: { value: LIST_PARAGRAPH_SPACING, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: 'em',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const paragraphMatch = attribute.match(
			/^list-paragraph-spacing-(general|xxl|xl|l|m|s|xs)$/
		);
		if (paragraphMatch) {
			const breakpoint = paragraphMatch[1];
			return {
				property: 'list_paragraph_spacing',
				value: { value: LIST_PARAGRAPH_SPACING, unit: 'em', breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_PARAGRAPH_SPACING,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const stylePositionMatch = attribute.match(
			/^list-style-position-(general|xxl|xl|l|m|s|xs)$/
		);
		if (stylePositionMatch) {
			const breakpoint = stylePositionMatch[1];
			return {
				property: 'list_style_position',
				value: { value: LIST_STYLE_POSITION, breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_STYLE_POSITION,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		const textPositionMatch = attribute.match(
			/^list-text-position-(general|xxl|xl|l|m|s|xs)$/
		);
		if (textPositionMatch) {
			const breakpoint = textPositionMatch[1];
			return {
				property: 'list_text_position',
				value: { value: LIST_TEXT_POSITION, breakpoint },
				expectedKey: attribute,
				expectedValue: LIST_TEXT_POSITION,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			};
		}

		return null;
	};

	test('List-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Enable list',
				property: 'is_list',
				value: true,
			},
			{
				phrase: 'Set list type to ordered',
				property: 'list_type',
				value: 'ol',
			},
			{
				phrase: 'Set list style to square',
				property: 'list_style',
				value: 'square',
			},
			{
				phrase: 'Use custom list marker "*"',
				property: 'list_style_custom',
				value: '*',
			},
			{
				phrase: 'Start list from 3',
				property: 'list_start',
				value: 3,
			},
			{
				phrase: 'Reverse the list order',
				property: 'list_reversed',
				value: true,
			},
			{
				phrase: 'Set list indent to 24px',
				property: 'list_indent',
				value: { value: 24, unit: 'px' },
			},
			{
				phrase: 'Set list gap to 1.5em',
				property: 'list_gap',
				value: { value: 1.5, unit: 'em' },
			},
			{
				phrase: 'Set list marker size to 1.5em',
				property: 'list_marker_size',
				value: { value: 1.5, unit: 'em' },
			},
			{
				phrase: 'Set list marker height to 1.25em',
				property: 'list_marker_height',
				value: { value: 1.25, unit: 'em' },
			},
			{
				phrase: 'Set list marker line height to 1.1em',
				property: 'list_marker_line_height',
				value: { value: 1.1, unit: 'em' },
			},
			{
				phrase: 'Set list marker indent to 0.5em',
				property: 'list_marker_indent',
				value: { value: 0.5, unit: 'em' },
			},
			{
				phrase: 'Set list marker vertical offset to 4px',
				property: 'list_marker_vertical_offset',
				value: { value: 4, unit: 'px' },
			},
			{
				phrase: 'Set list paragraph spacing to 1.25em',
				property: 'list_paragraph_spacing',
				value: { value: 1.25, unit: 'em' },
			},
			{
				phrase: 'Set list style position inside',
				property: 'list_style_position',
				value: 'inside',
			},
			{
				phrase: 'Set list text position middle',
				property: 'list_text_position',
				value: 'middle',
			},
			{
				phrase: 'Set list palette color to 4',
				property: 'list_palette_color',
				value: 4,
			},
			{
				phrase: 'On hover, set list palette color to 6',
				property: 'list_palette_color_hover',
				value: 6,
			},
			{
				phrase: 'Set list palette opacity to 60%',
				property: 'list_palette_opacity',
				value: 0.6,
			},
			{
				phrase: 'Disable list palette',
				property: 'list_palette_status',
				value: false,
			},
			{
				phrase: 'Use style card palette for list',
				property: 'list_palette_sc_status',
				value: true,
			},
			{
				phrase: 'Set list color to #ff0055',
				property: 'list_color',
				value: '#ff0055',
			},
			{
				phrase: 'On hover, set list color to #00aaee',
				property: 'list_color_hover',
				value: '#00aaee',
			},
			{
				phrase: 'On tablet, set list color to #00aaee',
				property: 'list_color',
				value: { value: '#00aaee', breakpoint: 'm' },
			},
			{
				phrase: 'On tablet, set list text position baseline',
				property: 'list_text_position',
				value: { value: 'baseline', breakpoint: 'm' },
			},
		];

		samples.forEach(sample => {
			const action = buildTextListGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('Enable list defaults to bullets outside', () => {
		const action = buildTextListGroupAction('Enable list');
		expect(action).toBeTruthy();

		const changes = buildTextListGroupAttributeChanges(
			action.property,
			action.value
		);

		expect(changes.isList).toBe(true);
		expect(changes.typeOfList).toBe('ul');
		expect(changes.listStyle).toBe('disc');
		expect(changes['list-style-position-general']).toBe('outside');
	});

	test('List type updates default styles', () => {
		const orderedChanges = buildTextListGroupAttributeChanges(
			'list_type',
			'ol'
		);
		expect(orderedChanges.typeOfList).toBe('ol');
		expect(orderedChanges.listStyle).toBe('decimal');
		expect(orderedChanges.listStyleCustom).toBe('');

		const unorderedChanges = buildTextListGroupAttributeChanges(
			'list_type',
			'ul'
		);
		expect(unorderedChanges.typeOfList).toBe('ul');
		expect(unorderedChanges.listStyle).toBe('disc');
		expect(unorderedChanges.listStyleCustom).toBe('');
	});

	test('List-group prompt updates attribute and sidebar target', () => {
		const samples = [
			{
				phrase: 'Set list marker size to 1.5em',
				expectedKey: 'list-marker-size-general',
				expectedValue: 1.5,
				expectedUnitKey: 'list-marker-size-unit-general',
				expectedUnitValue: 'em',
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			},
			{
				phrase: 'On hover, set list palette color to 6',
				expectedKey: 'list-palette-color-general-hover',
				expectedValue: 6,
				expectHoverStatus: true,
				expectedSidebar: { tabIndex: 0, accordion: 'list options' },
			},
		];

		samples.forEach(sample => {
			const action = buildTextListGroupAction(sample.phrase);
			expect(action).toBeTruthy();

			const changes = buildTextListGroupAttributeChanges(
				action.property,
				action.value
			);
			expect(changes).toBeTruthy();
			expect(changes[sample.expectedKey]).toBe(sample.expectedValue);
			if (sample.expectedUnitKey) {
				expect(changes[sample.expectedUnitKey]).toBe(sample.expectedUnitValue);
			}
			if (sample.expectHoverStatus) {
				expect(changes['typography-status-hover']).toBe(true);
			}

			const sidebar = getTextListGroupSidebarTarget(action.property);
			expect(sidebar).toEqual(sample.expectedSidebar);
		});
	});

	test('List-group hover palette enables typography hover', () => {
		const changes = buildTextListGroupAttributeChanges(
			'list_palette_color_hover',
			LIST_PALETTE_COLOR_HOVER
		);

		expect(changes['typography-status-hover']).toBe(true);
	});

	test('each list attribute can be updated via list-group mapping', () => {
		const missing = [];

		listAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildTextListGroupAttributeChanges(
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

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('List-group properties map to sidebar targets', () => {
		const missing = [];

		listAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getTextListGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('text P attributes', () => {
	const pAttributes = textAttributes.filter(attr => /^p/i.test(attr));

	const PADDING_VALUE = 24;
	const POSITION_VALUE = 16;
	const POSITION_MODE = 'absolute';
	const PALETTE_COLOR = 3;
	const PALETTE_COLOR_HOVER = 5;
	const PALETTE_OPACITY = 0.7;
	const PALETTE_OPACITY_HOVER = 0.5;
	const PALETTE_STATUS = true;
	const PALETTE_STATUS_HOVER = false;
	const PALETTE_SC_STATUS = true;
	const PALETTE_SC_STATUS_HOVER = false;
	const PREVIEW_VALUE = true;

	const buildExpectedForAttribute = attribute => {
		const paddingSideMatch = attribute.match(
			/^padding-(top|right|bottom|left)-(general|xxl|xl|l|m|s|xs)$/
		);
		if (paddingSideMatch) {
			const side = paddingSideMatch[1];
			const breakpoint = paddingSideMatch[2];
			return {
				property: `padding_${side}`,
				value: { value: PADDING_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: PADDING_VALUE,
				expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
			};
		}

		const paddingUnitMatch = attribute.match(
			/^padding-(top|right|bottom|left)-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (paddingUnitMatch) {
			const side = paddingUnitMatch[1];
			const breakpoint = paddingUnitMatch[2];
			return {
				property: `padding_${side}`,
				value: { value: PADDING_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
			};
		}

		const paddingSyncMatch = attribute.match(
			/^padding-sync-(general|xxl|xl|l|m|s|xs)$/
		);
		if (paddingSyncMatch) {
			const breakpoint = paddingSyncMatch[1];
			return {
				property: 'padding',
				value: { value: PADDING_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'all',
				expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
			};
		}

		const paletteMatch = attribute.match(
			/^palette-(color|opacity|status|sc-status)-(general|xxl|xl|l|m|s|xs)(-hover)?$/
		);
		if (paletteMatch) {
			const type = paletteMatch[1];
			const breakpoint = paletteMatch[2];
			const isHover = Boolean(paletteMatch[3]);

			const paletteValueMap = {
				color: isHover ? PALETTE_COLOR_HOVER : PALETTE_COLOR,
				opacity: isHover ? PALETTE_OPACITY_HOVER : PALETTE_OPACITY,
				status: isHover ? PALETTE_STATUS_HOVER : PALETTE_STATUS,
				'sc-status': isHover ? PALETTE_SC_STATUS_HOVER : PALETTE_SC_STATUS,
			};

			const propertyMap = {
				color: isHover ? 'palette_color_hover' : 'palette_color',
				opacity: isHover ? 'palette_opacity_hover' : 'palette_opacity',
				status: isHover ? 'palette_status_hover' : 'palette_status',
				'sc-status': isHover
					? 'palette_sc_status_hover'
					: 'palette_sc_status',
			};

			return {
				property: propertyMap[type],
				value: { value: paletteValueMap[type], breakpoint },
				expectedKey: attribute,
				expectedValue: paletteValueMap[type],
				expectedSidebar: { tabIndex: 0, accordion: 'typography' },
			};
		}

		const positionModeMatch = attribute.match(
			/^position-(general|xxl|xl|l|m|s|xs)$/
		);
		if (positionModeMatch) {
			const breakpoint = positionModeMatch[1];
			return {
				property: 'position',
				value: { value: POSITION_MODE, breakpoint },
				expectedKey: attribute,
				expectedValue: POSITION_MODE,
				expectedSidebar: { tabIndex: 1, accordion: 'position' },
			};
		}

		const positionAxisMatch = attribute.match(
			/^position-(top|right|bottom|left)-(general|xxl|xl|l|m|s|xs)$/
		);
		if (positionAxisMatch) {
			const axis = positionAxisMatch[1];
			const breakpoint = positionAxisMatch[2];
			return {
				property: `position_${axis}`,
				value: { value: POSITION_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: POSITION_VALUE,
				expectedSidebar: { tabIndex: 1, accordion: 'position' },
			};
		}

		const positionUnitMatch = attribute.match(
			/^position-(top|right|bottom|left)-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (positionUnitMatch) {
			const axis = positionUnitMatch[1];
			const breakpoint = positionUnitMatch[2];
			return {
				property: `position_${axis}`,
				value: { value: POSITION_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 1, accordion: 'position' },
			};
		}

		const positionSyncMatch = attribute.match(
			/^position-sync-(general|xxl|xl|l|m|s|xs)$/
		);
		if (positionSyncMatch) {
			const breakpoint = positionSyncMatch[1];
			return {
				property: 'position_top',
				value: { value: POSITION_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'none',
				expectedSidebar: { tabIndex: 1, accordion: 'position' },
			};
		}

		if (attribute === 'preview') {
			return {
				property: 'preview',
				value: PREVIEW_VALUE,
				expectedKey: attribute,
				expectedValue: PREVIEW_VALUE,
				expectedSidebar: { tabIndex: 0, accordion: 'block settings' },
			};
		}

		return null;
	};

	test('P-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set text padding top to 24px',
				property: 'padding_top',
				assert: action => action.value && action.value.value === 24,
			},
			{
				phrase: 'Remove text padding left',
				property: 'padding_left',
				assert: action => action.value && action.value.value === 0,
			},
			{
				phrase: 'Set text position to absolute',
				property: 'position',
				value: 'absolute',
			},
			{
				phrase: 'Set text position top to 12px',
				property: 'position_top',
				assert: action => action.value && action.value.value === 12,
			},
			{
				phrase: 'On tablet, set text position bottom to 20px',
				property: 'position_bottom',
				assert: action =>
					action.value &&
					action.value.value === 20 &&
					action.value.breakpoint === 'm',
			},
			{
				phrase: 'Set text palette color to 3',
				property: 'palette_color',
				value: 3,
			},
			{
				phrase: 'On hover, set text palette color to 5',
				property: 'palette_color_hover',
				value: 5,
			},
			{
				phrase: 'Set text palette opacity to 70%',
				property: 'palette_opacity',
				value: 0.7,
			},
			{
				phrase: 'Disable text palette',
				property: 'palette_status',
				value: false,
			},
			{
				phrase: 'Use style card palette for text',
				property: 'palette_sc_status',
				value: true,
			},
			{
				phrase: 'Disable text preview',
				property: 'preview',
				value: false,
			},
			{
				phrase: 'On mobile, set text palette opacity to 50%',
				property: 'palette_opacity',
				value: { value: 0.5, breakpoint: 'xs' },
			},
		];

		samples.forEach(sample => {
			const action = buildTextPGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			} else {
				expect(action.value).toEqual(sample.value);
			}
		});
	});

	test('P-group prompt updates attribute and sidebar target', () => {
		const sample = {
			phrase: 'On hover, set text palette color to 5',
			expectedKey: 'palette-color-general-hover',
			expectedValue: 5,
			expectedSidebar: { tabIndex: 0, accordion: 'typography' },
		};

		const action = buildTextPGroupAction(sample.phrase);
		expect(action).toBeTruthy();

		const changes = buildTextPGroupAttributeChanges(action.property, action.value);
		expect(changes).toBeTruthy();
		expect(changes[sample.expectedKey]).toBe(sample.expectedValue);
		expect(changes['typography-status-hover']).toBe(true);

		const sidebar = getTextPGroupSidebarTarget(action.property);
		expect(sidebar).toEqual(sample.expectedSidebar);
	});

	test('each P attribute can be updated via P-group mapping', () => {
		const missing = [];

		pAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildTextPGroupAttributeChanges(
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

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('P-group properties map to sidebar targets', () => {
		const missing = [];

		pAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getTextPGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('text content and level attributes', () => {
	const matchPattern = message =>
		TEXT_PATTERNS.find(pattern => pattern.regex.test(message));

	test('text level patterns resolve to expected properties', () => {
		const samples = [
			['H1', 'h1'],
			['Heading 2', 'h2'],
			['Paragraph', 'p'],
		];

		samples.forEach(([message, expectedLevel]) => {
			const pattern = matchPattern(message);
			expect(pattern).toBeTruthy();
			expect(pattern.property).toBe('textLevel');
			expect(pattern.value).toBe(expectedLevel);
		});
	});

	test('text level and content updates map to attributes', () => {
		const block = {
			name: 'maxi-blocks/text-maxi',
			attributes: { textLevel: 'p', isList: false, content: 'Old copy' },
		};

		const levelChanges = handleTextUpdate(block, 'textLevel', 'h2', '');
		expect(levelChanges).toBeTruthy();
		expect(levelChanges.textLevel).toBe('h2');
		expect(levelChanges.isList).toBe(false);

		const contentChanges = handleTextUpdate(block, 'content', 'Hello world', '');
		expect(contentChanges).toEqual({ content: 'Hello world' });
	});
});

describe('text typography prompts', () => {
	const block = {
		name: 'maxi-blocks/text-maxi',
		attributes: {},
	};

	const samples = [
		{
			phrase: 'Set font family to "Cormorant Garamond"',
			property: 'text_font_family',
			value: 'Cormorant Garamond',
			expectedKey: 'font-family-general',
			expectedValue: 'Cormorant Garamond',
		},
		{
			phrase: 'Set font weight to 300',
			property: 'text_weight',
			value: 300,
			expectedKey: 'font-weight-general',
			expectedValue: '300',
		},
		{
			phrase: 'Make the text italic',
			property: 'text_font_style',
			value: 'italic',
			expectedKey: 'font-style-general',
			expectedValue: 'italic',
		},
		{
			phrase: 'Set font size to 24px',
			property: 'text_font_size',
			value: { value: 24, unit: 'px' },
			expectedKey: 'font-size-general',
			expectedValue: 24,
			expectedUnitKey: 'font-size-unit-general',
			expectedUnitValue: 'px',
		},
	];

	test('prompts resolve to actions and update typography attributes', () => {
		samples.forEach(sample => {
			const action = buildTextCGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);

			const changes = handleTextUpdate(block, action.property, action.value, '');
			expect(changes).toBeTruthy();
			expect(changes[sample.expectedKey]).toBe(sample.expectedValue);
			if (sample.expectedUnitKey) {
				expect(changes[sample.expectedUnitKey]).toBe(
					sample.expectedUnitValue
				);
			}

			const sidebar = getTextCGroupSidebarTarget(action.property);
			expect(sidebar).toEqual({ tabIndex: 0, accordion: 'typography' });
		});
	});

	test('hover font weight updates hover attributes and opens sidebar', () => {
		const action = buildTextCGroupAction('On hover, set font weight to 700');
		expect(action).toBeTruthy();
		expect(action.property).toBe('text_weight_hover');
		expect(action.value).toEqual(700);

		const changes = handleTextUpdate(block, action.property, action.value, '');
		expect(changes['font-weight-general-hover']).toBe('700');
		expect(changes['typography-status-hover']).toBe(true);

		const sidebar = getTextCGroupSidebarTarget(action.property);
		expect(sidebar).toEqual({ tabIndex: 0, accordion: 'typography' });
	});
});

describe('text letter spacing attributes', () => {
	const matchPattern = message =>
		TEXT_PATTERNS.find(pattern => pattern.regex.test(message));

	test('letter spacing prompt variants resolve to flow', () => {
		const samples = [
			'Increase letter spacing',
			'Adjust tracking',
			'Fix kerning',
		];

		samples.forEach(message => {
			const pattern = matchPattern(message);
			expect(pattern).toBeTruthy();
			expect(pattern.property).toBe('flow_text_letter_spacing');
		});
	});

	test('letter spacing flow applies attributes and opens sidebar', () => {
		const block = {
			name: 'maxi-blocks/text-maxi',
			attributes: {},
		};
		const pattern = matchPattern('Increase letter spacing');
		expect(pattern).toBeTruthy();

		const result = handleTextUpdate(block, pattern.property, pattern.value, '', {
			text_letter_spacing: { value: 0.05, unit: 'em' },
		});

		expect(result).toBeTruthy();
		expect(result.action).toBe('apply');
		expect(result.attributes['letter-spacing-general']).toBe(0.05);
		expect(result.attributes['letter-spacing-unit-general']).toBe('em');
		expect(result.attributes['letter-spacing-m']).toBe(0.05);
		expect(getTextTypographySidebarTarget('text_letter_spacing')).toEqual({
			tabIndex: 0,
			accordion: 'typography',
		});
	});

	test('hover letter spacing updates hover attributes and opens sidebar', () => {
		const block = {
			name: 'maxi-blocks/text-maxi',
			attributes: {},
		};

		const changes = handleTextUpdate(
			block,
			'text_letter_spacing_hover',
			{ value: 0.1, unit: 'em' },
			''
		);

		expect(changes['letter-spacing-general-hover']).toBe(0.1);
		expect(changes['letter-spacing-unit-general-hover']).toBe('em');
		expect(changes['typography-status-hover']).toBe(true);
		expect(getTextTypographySidebarTarget('text_letter_spacing_hover')).toEqual({
			tabIndex: 0,
			accordion: 'typography',
		});
	});
});

