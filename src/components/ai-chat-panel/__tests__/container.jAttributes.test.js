import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerAGroupAction,
	buildContainerAGroupAttributeChanges,
	getContainerAGroupSidebarTarget,
} from '../ai/utils/containerAGroup';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const jAttributes = containerAttributes.filter(attr => /^j/i.test(attr));

const getBreakpoint = attribute => attribute.split('-').pop();

const buildExpectedForAttribute = attribute => {
	if (attribute.startsWith('justify-content-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'justify_content',
			value: { value: 'space-between', breakpoint },
			expectedKey: `justify-content-${breakpoint}`,
			expectedValue: 'space-between',
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	return null;
};

describe('container J attributes', () => {
	test('J-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Justify content space between',
				property: 'justify_content',
				value: 'space-between',
			},
			{
				phrase: 'Justify content center',
				property: 'justify_content',
				value: 'center',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerAGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toBe(sample.value);
		});
	});

	test('each J attribute can be updated via mapping', () => {
		const missing = [];

		jAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerAGroupAttributeChanges(
				config.property,
				config.value,
				{ block: { attributes: {} }, attributes: {} }
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

	test('J-group properties map to sidebar targets', () => {
		const missing = [];
		jAttributes.forEach(attribute => {
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
