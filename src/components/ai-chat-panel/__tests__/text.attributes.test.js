import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildTextCGroupAction,
	buildTextCGroupAttributeChanges,
	getTextCGroupSidebarTarget,
	buildTextPGroupAction,
	buildTextPGroupAttributeChanges,
	getTextPGroupSidebarTarget,
} from '../ai/utils/textGroup';

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

