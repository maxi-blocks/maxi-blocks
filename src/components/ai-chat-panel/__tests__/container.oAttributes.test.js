import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerOGroupAction,
	buildContainerOGroupAttributeChanges,
	getContainerOGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const oAttributes = containerAttributes.filter(attr => /^o/i.test(attr));

const OPACITY_VALUE = 0.6;
const HOVER_OPACITY_VALUE = 0.25;
const ORDER_VALUE = 2;
const OVERFLOW_VALUE = 'hidden';

const buildExpectedForAttribute = attribute => {
	const hoverOpacityMatch = attribute.match(
		/^opacity-(general|xxl|xl|l|m|s|xs)-hover$/
	);
	if (hoverOpacityMatch) {
		const breakpoint = hoverOpacityMatch[1];
		return {
			property: 'opacity_hover',
			value: { value: HOVER_OPACITY_VALUE, breakpoint },
			expectedKey: attribute,
			expectedValue: HOVER_OPACITY_VALUE,
			expectedSidebar: { tabIndex: 1, accordion: 'opacity' },
		};
	}

	const opacityMatch = attribute.match(/^opacity-(general|xxl|xl|l|m|s|xs)$/);
	if (opacityMatch) {
		const breakpoint = opacityMatch[1];
		return {
			property: 'opacity',
			value: { value: OPACITY_VALUE, breakpoint },
			expectedKey: attribute,
			expectedValue: OPACITY_VALUE,
			expectedSidebar: { tabIndex: 1, accordion: 'opacity' },
		};
	}

	if (attribute === 'opacity-status-hover') {
		return {
			property: 'opacity_status_hover',
			value: true,
			expectedKey: 'opacity-status-hover',
			expectedValue: true,
			expectedSidebar: { tabIndex: 1, accordion: 'opacity' },
		};
	}

	const orderMatch = attribute.match(/^order-(general|xxl|xl|l|m|s|xs)$/);
	if (orderMatch) {
		const breakpoint = orderMatch[1];
		return {
			property: 'order',
			value: { value: ORDER_VALUE, breakpoint },
			expectedKey: attribute,
			expectedValue: ORDER_VALUE,
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	const overflowXMatch = attribute.match(/^overflow-x-(general|xxl|xl|l|m|s|xs)$/);
	if (overflowXMatch) {
		const breakpoint = overflowXMatch[1];
		return {
			property: 'overflow_x',
			value: { value: OVERFLOW_VALUE, breakpoint },
			expectedKey: attribute,
			expectedValue: OVERFLOW_VALUE,
			expectedSidebar: { tabIndex: 1, accordion: 'overflow' },
		};
	}

	const overflowYMatch = attribute.match(/^overflow-y-(general|xxl|xl|l|m|s|xs)$/);
	if (overflowYMatch) {
		const breakpoint = overflowYMatch[1];
		return {
			property: 'overflow_y',
			value: { value: OVERFLOW_VALUE, breakpoint },
			expectedKey: attribute,
			expectedValue: OVERFLOW_VALUE,
			expectedSidebar: { tabIndex: 1, accordion: 'overflow' },
		};
	}

	return null;
};

describe('container O attributes', () => {
	test('O-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set opacity to 60%',
				property: 'opacity',
				value: 0.6,
			},
			{
				phrase: 'Set hover opacity to 25%',
				property: 'opacity_hover',
				value: 0.25,
			},
			{
				phrase: 'Disable opacity hover',
				property: 'opacity_status_hover',
				value: false,
			},
			{
				phrase: 'Set tablet opacity to 50%',
				property: 'opacity',
				value: { value: 0.5, breakpoint: 'm' },
			},
			{
				phrase: 'Set order to 2',
				property: 'order',
				value: 2,
			},
			{
				phrase: 'Set overflow to hidden',
				property: 'overflow',
				value: 'hidden',
			},
			{
				phrase: 'Set overflow x to scroll',
				property: 'overflow_x',
				value: 'scroll',
			},
			{
				phrase: 'Set overflow y to auto',
				property: 'overflow_y',
				value: 'auto',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerOGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (typeof sample.value === 'number') {
				expect(action.value).toBeCloseTo(sample.value, 3);
			} else if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
		});
	});

	test('each O attribute can be updated via O-group mapping', () => {
		const missing = [];

		oAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerOGroupAttributeChanges(
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

	test('O-group properties map to sidebar targets', () => {
		const missing = [];

		oAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerOGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
