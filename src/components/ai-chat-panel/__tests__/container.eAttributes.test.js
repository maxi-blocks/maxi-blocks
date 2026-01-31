import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerEGroupAction,
	buildContainerEGroupAttributeChanges,
	getContainerEGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const eAttributes = containerAttributes.filter(attr => /^e/i.test(attr));

const buildExpectedForAttribute = attribute => {
	if (attribute === 'extraClassName') {
		return {
			property: 'extra_class_name',
			value: 'hero-section featured',
			expectedKey: 'extraClassName',
			expectedValue: 'hero-section featured',
			expectedSidebar: { tabIndex: 1, accordion: 'add css classes' },
		};
	}
	return null;
};

describe('container E attributes', () => {
	test('E-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Add CSS class hero-section',
				property: 'extra_class_name',
				value: 'hero-section',
			},
			{
				phrase: 'Set custom classes to "hero featured"',
				property: 'extra_class_name',
				value: 'hero featured',
			},
			{
				phrase: 'Remove custom classes',
				property: 'extra_class_name',
				value: '',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerEGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toBe(sample.value);
		});
	});

	test('each E attribute can be updated via E-group mapping', () => {
		const missing = [];

		eAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerEGroupAttributeChanges(
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

	test('E-group properties map to sidebar targets', () => {
		const missing = [];
		eAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerEGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
