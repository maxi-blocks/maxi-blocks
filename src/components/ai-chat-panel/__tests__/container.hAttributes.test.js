import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerHGroupAction,
	buildContainerHGroupAttributeChanges,
	getContainerHGroupSidebarTarget,
} from '../ai/utils/containerHGroup';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const hAttributes = containerAttributes.filter(attr => /^h/i.test(attr));

const getBreakpoint = attribute => attribute.split('-').pop();

const buildExpectedForAttribute = attribute => {
	if (attribute.startsWith('height-unit-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'height',
			value: { value: 320, unit: 'px', breakpoint },
			expectedKey: `height-unit-${breakpoint}`,
			expectedValue: 'px',
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute.startsWith('height-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'height',
			value: { value: 320, unit: 'px', breakpoint },
			expectedKey: `height-${breakpoint}`,
			expectedValue: 320,
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	return null;
};

describe('container H attributes', () => {
	test('H-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set height to 420px',
				property: 'height',
				value: { value: 420, unit: 'px' },
				assert: action => action.value && action.value.value === 420,
			},
			{
				phrase: 'Set tablet height to 320px',
				property: 'height',
				value: { value: 320, unit: 'px', breakpoint: 'm' },
				assert: action =>
					action.value &&
					action.value.value === 320 &&
					action.value.breakpoint === 'm',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerHGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			}
		});
	});

	test('each H attribute can be updated via H-group mapping', () => {
		const missing = [];

		hAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerHGroupAttributeChanges(
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

	test('H-group properties map to sidebar targets', () => {
		const missing = [];
		hAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerHGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
