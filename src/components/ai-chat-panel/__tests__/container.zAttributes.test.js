import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerZGroupAction,
	buildContainerZGroupAttributeChanges,
	getContainerZGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const zAttributes = containerAttributes.filter(attr => /^z/i.test(attr));

const Z_INDEX_VALUE = 7;

const buildExpectedForAttribute = attribute => {
	const zMatch = attribute.match(/^z-index-(general|xxl|xl|l|m|s|xs)$/);
	if (zMatch) {
		const breakpoint = zMatch[1];
		return {
			property: 'z_index',
			value: { value: Z_INDEX_VALUE, breakpoint },
			expectedKey: attribute,
			expectedValue: Z_INDEX_VALUE,
			expectedSidebar: { tabIndex: 1, accordion: 'z-index' },
		};
	}

	return null;
};

describe('container Z attributes', () => {
	test('Z-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set z-index to 10',
				property: 'z_index',
				value: 10,
			},
			{
				phrase: 'On tablet, set z index to 5',
				property: 'z_index',
				value: { value: 5, breakpoint: 'm' },
			},
		];

		samples.forEach(sample => {
			const action = buildContainerZGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('each Z attribute can be updated via Z-group mapping', () => {
		const missing = [];

		zAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerZGroupAttributeChanges(
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

	test('Z-group properties map to sidebar targets', () => {
		const missing = [];

		zAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerZGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
