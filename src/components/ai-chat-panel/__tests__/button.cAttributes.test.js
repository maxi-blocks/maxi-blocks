import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildButtonCGroupAction,
	buildButtonCGroupAttributeChanges,
	getButtonCGroupSidebarTarget,
} from '../ai/utils/buttonGroups';

const buttonAttributes = rawAttributes.blocks['button-maxi'] || [];
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

describe('button C attributes', () => {
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
