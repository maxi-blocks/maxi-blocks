import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerBGroupAction,
	buildContainerBGroupAttributeChanges,
	getContainerBGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const bAttributes = containerAttributes.filter(attr => /^b/i.test(attr));

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

const buildExpectedForAttribute = attribute => {
	if (attribute === 'background-layers') {
		return {
			property: 'background_layers',
			value: baseLayers,
			expectedKey: 'background-layers',
			expectedValue: baseLayers,
			expectedSidebar: { tabIndex: 0, accordion: 'background / layer' },
		};
	}

	if (attribute === 'background-layers-hover') {
		return {
			property: 'background_layers_hover',
			value: hoverLayers,
			expectedKey: 'background-layers-hover',
			expectedValue: hoverLayers,
			expectedSidebar: { tabIndex: 0, accordion: 'background / layer' },
		};
	}

	if (attribute === 'block-background-status-hover') {
		return {
			property: 'block_background_status_hover',
			value: true,
			expectedKey: 'block-background-status-hover',
			expectedValue: true,
			expectedSidebar: { tabIndex: 0, accordion: 'background / layer' },
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

	if (attribute.startsWith('border-')) {
		if (attribute === 'border-status-hover') {
			return {
				property: 'border_hover',
				value: BORDER_HOVER_SAMPLE,
				expectedKey: 'border-status-hover',
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'border' },
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
				expectedSidebar: { tabIndex: 0, accordion: 'border' },
			};
		}

		const sample = isHover ? BORDER_HOVER_SAMPLE : BORDER_SAMPLE;
		return {
			property: isHover ? 'border_hover' : 'border',
			value: sample,
			expectedKey: attribute,
			expectedValue: resolveBorderExpectedValue(attribute, sample),
			expectedSidebar: { tabIndex: 0, accordion: 'border' },
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
			expectedSidebar: { tabIndex: 0, accordion: 'box shadow' },
		};
	}

	return null;
};

describe('container B attributes', () => {
	test('B-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set block style to dark',
				property: 'block_style',
				value: 'dark',
			},
			{
				phrase: 'Set tablet breakpoint to 900',
				property: 'breakpoints',
				value: { value: 900, breakpoint: 'm' },
			},
			{
				phrase: 'Enable hover background',
				property: 'block_background_status_hover',
				value: true,
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
			{
				phrase: 'Add a 2px solid border with palette 3',
				property: 'border',
				assert: action => action.value && action.value.width === 2,
			},
			{
				phrase: 'On hover, make the border 4px dashed palette 5',
				property: 'border_hover',
				assert: action => action.value && action.value.width === 4,
			},
			{
				phrase: 'On hover, make corners 16px',
				property: 'border_radius_hover',
				value: 16,
			},
			{
				phrase: 'Add a soft shadow with palette 8',
				property: 'box_shadow',
				assert: action => action.value && action.value.blur === 30,
			},
			{
				phrase: 'On hover, add a bold shadow with palette 6',
				property: 'box_shadow_hover',
				assert: action => action.value && action.value.blur === 25,
			},
		];

		samples.forEach(sample => {
			const action = buildContainerBGroupAction(sample.phrase);
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

	test('each B attribute can be updated via B-group mapping', () => {
		const missing = [];

		bAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || config.expectedValue === null || config.expectedValue === undefined) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerBGroupAttributeChanges(
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
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerBGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
