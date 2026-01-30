import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerWGroupAction,
	buildContainerWGroupAttributeChanges,
	getContainerWGroupSidebarTarget,
} from '../ai/utils/containerWGroup';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const wAttributes = containerAttributes.filter(attr => /^w/i.test(attr));

const WIDTH_VALUE = 640;
const WIDTH_UNIT = 'px';

const buildExpectedForAttribute = attribute => {
	const widthMatch = attribute.match(/^width-(general|xxl|xl|l|m|s|xs)$/);
	if (widthMatch) {
		const breakpoint = widthMatch[1];
		return {
			property: 'width',
			value: { value: WIDTH_VALUE, unit: WIDTH_UNIT, breakpoint },
			expectedKey: attribute,
			expectedValue: WIDTH_VALUE,
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	const unitMatch = attribute.match(/^width-unit-(general|xxl|xl|l|m|s|xs)$/);
	if (unitMatch) {
		const breakpoint = unitMatch[1];
		return {
			property: 'width',
			value: { value: WIDTH_VALUE, unit: WIDTH_UNIT, breakpoint },
			expectedKey: attribute,
			expectedValue: WIDTH_UNIT,
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	const fitContentMatch = attribute.match(/^width-fit-content-(general|xxl|xl|l|m|s|xs)$/);
	if (fitContentMatch) {
		const breakpoint = fitContentMatch[1];
		return {
			property: 'width',
			value: { value: 'fit-content', breakpoint },
			expectedKey: attribute,
			expectedValue: true,
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	return null;
};

describe('container W attributes', () => {
	test('W-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set width to 640px',
				property: 'width',
				value: { value: 640, unit: 'px' },
			},
			{
				phrase: 'Set width to fit content',
				property: 'width',
				value: 'fit-content',
			},
			{
				phrase: 'On mobile, set width to 90%',
				property: 'width',
				value: { value: 90, unit: '%', breakpoint: 'xs' },
			},
		];

		samples.forEach(sample => {
			const action = buildContainerWGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('each W attribute can be updated via W-group mapping', () => {
		const missing = [];

		wAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerWGroupAttributeChanges(
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

	test('W-group properties map to sidebar targets', () => {
		const missing = [];

		wAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerWGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
