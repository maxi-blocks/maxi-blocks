import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerRGroupAction,
	buildContainerRGroupAttributeChanges,
	getContainerRGroupSidebarTarget,
} from '../ai/utils/containerRGroup';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const rAttributes = containerAttributes.filter(
	attr => /^r/i.test(attr) && attr !== 'relations'
);

const ROW_GAP_VALUE = 24;
const ROW_GAP_UNIT = 'px';

const buildExpectedForAttribute = attribute => {
	const rowGapMatch = attribute.match(
		/^row-gap-(general|xxl|xl|l|m|s|xs)$/
	);
	if (rowGapMatch) {
		const breakpoint = rowGapMatch[1];
		return {
			property: 'row_gap',
			value: { value: ROW_GAP_VALUE, unit: ROW_GAP_UNIT, breakpoint },
			expectedKey: attribute,
			expectedValue: ROW_GAP_VALUE,
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	const rowGapUnitMatch = attribute.match(
		/^row-gap-unit-(general|xxl|xl|l|m|s|xs)$/
	);
	if (rowGapUnitMatch) {
		const breakpoint = rowGapUnitMatch[1];
		return {
			property: 'row_gap',
			value: { value: ROW_GAP_VALUE, unit: ROW_GAP_UNIT, breakpoint },
			expectedKey: attribute,
			expectedValue: ROW_GAP_UNIT,
			expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
		};
	}

	return null;
};

describe('container R attributes', () => {
	test('R-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set row gap to 24px',
				property: 'row_gap',
				assert: action =>
					action.value &&
					action.value.value === 24 &&
					action.value.unit === 'px',
			},
			{
				phrase: 'Set tablet row gap to 12px',
				property: 'row_gap',
				assert: action =>
					action.value &&
					action.value.value === 12 &&
					action.value.breakpoint === 'm',
			},
			{
				phrase: 'Remove row gap',
				property: 'row_gap',
				assert: action => action.value && action.value.value === 0,
			},
		];

		samples.forEach(sample => {
			const action = buildContainerRGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			} else if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
		});
	});

	test('each R attribute can be updated via R-group mapping', () => {
		const missing = [];

		rAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedKey) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerRGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!config.expectedKey || !(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('R-group properties map to sidebar targets', () => {
		const missing = [];

		rAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerRGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
