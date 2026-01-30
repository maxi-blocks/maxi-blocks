import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerFGroupAction,
	buildContainerFGroupAttributeChanges,
	getContainerFGroupSidebarTarget,
} from '../ai/utils/containerFGroup';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const fAttributes = containerAttributes.filter(attr => /^f/i.test(attr));

const getBreakpoint = attribute => attribute.split('-').pop();

const buildExpectedForAttribute = attribute => {
	if (attribute.startsWith('flex-basis-unit-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'flex_basis',
			value: { value: 40, unit: 'px', breakpoint },
			expectedKey: `flex-basis-unit-${breakpoint}`,
			expectedValue: 'px',
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('flex-basis-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'flex_basis',
			value: { value: 40, unit: 'px', breakpoint },
			expectedKey: `flex-basis-${breakpoint}`,
			expectedValue: '40',
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('flex-grow-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'flex_grow',
			value: { value: 1, breakpoint },
			expectedKey: `flex-grow-${breakpoint}`,
			expectedValue: 1,
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('flex-shrink-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'flex_shrink',
			value: { value: 0, breakpoint },
			expectedKey: `flex-shrink-${breakpoint}`,
			expectedValue: 0,
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('flex-direction-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'flex_direction',
			value: { value: 'row', breakpoint },
			expectedKey: `flex-direction-${breakpoint}`,
			expectedValue: 'row',
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('flex-wrap-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'flex_wrap',
			value: { value: 'wrap', breakpoint },
			expectedKey: `flex-wrap-${breakpoint}`,
			expectedValue: 'wrap',
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('force-aspect-ratio-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'force_aspect_ratio',
			value: { value: true, breakpoint },
			expectedKey: `force-aspect-ratio-${breakpoint}`,
			expectedValue: true,
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('full-width-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'full_width',
			value: { value: true, breakpoint },
			expectedKey: `full-width-${breakpoint}`,
			expectedValue: true,
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	return null;
};

describe('container F attributes', () => {
	test('F-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set flex basis to 40%',
				property: 'flex_basis',
				value: '40%',
			},
			{
				phrase: 'Set flex grow to 1',
				property: 'flex_grow',
				value: 1,
			},
			{
				phrase: 'Set flex shrink to 0',
				property: 'flex_shrink',
				value: 0,
			},
			{
				phrase: 'Flex direction row',
				property: 'flex_direction',
				value: 'row',
			},
			{
				phrase: 'Allow flex wrap',
				property: 'flex_wrap',
				value: 'wrap',
			},
			{
				phrase: 'Force aspect ratio',
				property: 'force_aspect_ratio',
				value: true,
			},
			{
				phrase: 'Disable aspect ratio lock',
				property: 'force_aspect_ratio',
				value: false,
			},
			{
				phrase: 'Make full width',
				property: 'full_width',
				value: true,
			},
		];

		samples.forEach(sample => {
			const action = buildContainerFGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toBe(sample.value);
		});
	});

	test('each F attribute can be updated via F-group mapping', () => {
		const missing = [];

		fAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerFGroupAttributeChanges(
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

	test('F-group properties map to sidebar targets', () => {
		const missing = [];
		fAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerFGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
