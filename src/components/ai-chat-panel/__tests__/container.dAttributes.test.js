import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerDGroupAction,
	buildContainerDGroupAttributeChanges,
	getContainerDGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const dAttributes = containerAttributes.filter(attr => /^d/i.test(attr));

const getBreakpoint = attribute => attribute.split('-').pop();

const buildExpectedForAttribute = attribute => {
	if (attribute.startsWith('display-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'display',
			value: { value: 'none', breakpoint },
			expectedKey: `display-${breakpoint}`,
			expectedValue: 'none',
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	return null;
};

describe('container D attributes', () => {
	test('D-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Hide this container',
				property: 'display',
				value: 'none',
			},
			{
				phrase: 'Show this container',
				property: 'display',
				value: 'flex',
			},
			{
				phrase: 'Set display to block',
				property: 'display',
				value: 'block',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerDGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toBe(sample.value);
		});
	});

	test('each D attribute can be updated via D-group mapping', () => {
		const missing = [];

		dAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerDGroupAttributeChanges(
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

	test('D-group properties map to sidebar targets', () => {
		const missing = [];
		dAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerDGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
