import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerAGroupAction,
	buildContainerAGroupAttributeChanges,
	getContainerAGroupSidebarTarget,
} from '../ai/utils/containerAGroup';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const aAttributes = containerAttributes.filter(attr => /^a/i.test(attr));

const getBreakpoint = attribute => attribute.split('-').pop();

const buildExpectedForAttribute = attribute => {
	if (attribute === 'anchorLink') {
		return {
			property: 'anchor_link',
			value: 'hero-section',
			expectedKey: 'anchorLink',
			expectedValue: 'hero-section',
			expectedSidebar: { tabIndex: 1, accordion: 'add anchor link' },
		};
	}

	if (attribute === 'ariaLabels') {
		return {
			property: 'aria_label',
			value: 'Hero section',
			expectedKey: 'ariaLabels',
			expectedValue: { container: 'Hero section' },
			expectedSidebar: { tabIndex: 1, accordion: 'aria label' },
		};
	}

	if (attribute.startsWith('advanced-css-')) {
		const breakpoint = getBreakpoint(attribute);
		const cssValue = '.hero{color:red;}';
		return {
			property: 'advanced_css',
			value: { value: cssValue, breakpoint },
			expectedKey: `advanced-css-${breakpoint}`,
			expectedValue: cssValue,
			expectedSidebar: { tabIndex: 1, accordion: 'advanced css' },
		};
	}

	if (attribute.startsWith('align-content-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'align_content',
			value: { value: 'space-between', breakpoint },
			expectedKey: `align-content-${breakpoint}`,
			expectedValue: 'space-between',
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('align-items-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'align_items_flex',
			value: { value: 'flex-start', breakpoint },
			expectedKey: `align-items-${breakpoint}`,
			expectedValue: 'flex-start',
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('arrow-position-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'arrow_position',
			value: { value: 60, breakpoint },
			expectedKey: `arrow-position-${breakpoint}`,
			expectedValue: 60,
			expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
		};
	}

	if (attribute.startsWith('arrow-width-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'arrow_width',
			value: { value: 40, breakpoint },
			expectedKey: `arrow-width-${breakpoint}`,
			expectedValue: 40,
			expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
		};
	}

	if (attribute.startsWith('arrow-side-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'arrow_side',
			value: { value: 'top', breakpoint },
			expectedKey: `arrow-side-${breakpoint}`,
			expectedValue: 'top',
			expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
		};
	}

	if (attribute.startsWith('arrow-status-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'arrow_status',
			value: { value: true, breakpoint },
			expectedKey: `arrow-status-${breakpoint}`,
			expectedValue: true,
			expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
		};
	}

	return null;
};

describe('container A attributes', () => {
	test('A-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set the anchor ID to hero-section',
				property: 'anchor_link',
				value: 'hero-section',
			},
			{
				phrase: 'Set screen reader label to "Primary hero container"',
				property: 'aria_label',
				value: 'Primary hero container',
			},
			{
				phrase: 'Add custom CSS: .maxi-container-block{color:red;}',
				property: 'advanced_css',
				value: '.maxi-container-block{color:red;}',
			},
			{
				phrase: 'Show the callout arrow',
				property: 'arrow_status',
				value: true,
			},
			{
				phrase: 'Move the arrow to the top',
				property: 'arrow_side',
				value: 'top',
			},
			{
				phrase: 'Set arrow position to 60',
				property: 'arrow_position',
				value: 60,
			},
			{
				phrase: 'Make the arrow 40px wide',
				property: 'arrow_width',
				value: 40,
			},
			{
				phrase: 'Align items to the top',
				property: 'align_items_flex',
				value: 'flex-start',
			},
			{
				phrase: 'Align content space between',
				property: 'align_content',
				value: 'space-between',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerAGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toBe(sample.value);
		});
	});

	test('each A attribute can be updated via A-group mapping', () => {
		const block = { attributes: { 'flex-direction-general': 'row' } };
		const missing = [];

		aAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerAGroupAttributeChanges(
				config.property,
				config.value,
				{ block, attributes: block.attributes }
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (config.expectedKey === 'ariaLabels') {
				if (!changes.ariaLabels || changes.ariaLabels.container !== config.expectedValue.container) {
					missing.push(attribute);
				}
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

	test('A-group properties map to sidebar targets', () => {
		const missing = [];
		aAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerAGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
