import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerPGroupAction,
	buildContainerPGroupAttributeChanges,
	getContainerPGroupSidebarTarget,
} from '../ai/utils/containerPGroup';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const pAttributes = containerAttributes.filter(attr => /^p/i.test(attr));

const PADDING_VALUE = 24;
const POSITION_VALUE = 16;
const POSITION_MODE = 'absolute';

const getBreakpoint = attribute => attribute.split('-').pop();

const buildExpectedForAttribute = attribute => {
	const paddingSideMatch = attribute.match(
		/^padding-(top|right|bottom|left)-(general|xxl|xl|l|m|s|xs)$/
	);
	if (paddingSideMatch) {
		const side = paddingSideMatch[1];
		const breakpoint = paddingSideMatch[2];
		return {
			property: `padding_${side}`,
			value: { value: PADDING_VALUE, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: PADDING_VALUE,
			expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
		};
	}

	const paddingUnitMatch = attribute.match(
		/^padding-(top|right|bottom|left)-unit-(general|xxl|xl|l|m|s|xs)$/
	);
	if (paddingUnitMatch) {
		const side = paddingUnitMatch[1];
		const breakpoint = paddingUnitMatch[2];
		return {
			property: `padding_${side}`,
			value: { value: PADDING_VALUE, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: 'px',
			expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
		};
	}

	const paddingSyncMatch = attribute.match(/^padding-sync-(general|xxl|xl|l|m|s|xs)$/);
	if (paddingSyncMatch) {
		const breakpoint = paddingSyncMatch[1];
		return {
			property: 'padding',
			value: { value: PADDING_VALUE, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: 'all',
			expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
		};
	}

	const positionModeMatch = attribute.match(/^position-(general|xxl|xl|l|m|s|xs)$/);
	if (positionModeMatch) {
		const breakpoint = positionModeMatch[1];
		return {
			property: 'position',
			value: { value: POSITION_MODE, breakpoint },
			expectedKey: attribute,
			expectedValue: POSITION_MODE,
			expectedSidebar: { tabIndex: 1, accordion: 'position' },
		};
	}

	const positionAxisMatch = attribute.match(
		/^position-(top|right|bottom|left)-(general|xxl|xl|l|m|s|xs)$/
	);
	if (positionAxisMatch) {
		const axis = positionAxisMatch[1];
		const breakpoint = positionAxisMatch[2];
		return {
			property: `position_${axis}`,
			value: { value: POSITION_VALUE, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: POSITION_VALUE,
			expectedSidebar: { tabIndex: 1, accordion: 'position' },
		};
	}

	const positionUnitMatch = attribute.match(
		/^position-(top|right|bottom|left)-unit-(general|xxl|xl|l|m|s|xs)$/
	);
	if (positionUnitMatch) {
		const axis = positionUnitMatch[1];
		const breakpoint = positionUnitMatch[2];
		return {
			property: `position_${axis}`,
			value: { value: POSITION_VALUE, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: 'px',
			expectedSidebar: { tabIndex: 1, accordion: 'position' },
		};
	}

	const positionSyncMatch = attribute.match(/^position-sync-(general|xxl|xl|l|m|s|xs)$/);
	if (positionSyncMatch) {
		const breakpoint = positionSyncMatch[1];
		return {
			property: 'position_top',
			value: { value: POSITION_VALUE, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: 'none',
			expectedSidebar: { tabIndex: 1, accordion: 'position' },
		};
	}

	return null;
};

describe('container P attributes', () => {
	test('P-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set padding top to 24px',
				property: 'padding_top',
				assert: action => action.value && action.value.value === 24,
			},
			{
				phrase: 'Set padding to 16px',
				property: 'padding',
				assert: action => action.value && action.value.value === 16,
			},
			{
				phrase: 'Remove padding left',
				property: 'padding_left',
				assert: action => action.value && action.value.value === 0,
			},
			{
				phrase: 'Set position to absolute',
				property: 'position',
				value: 'absolute',
			},
			{
				phrase: 'Set position top to 12px',
				property: 'position_top',
				assert: action => action.value && action.value.value === 12,
			},
			{
				phrase: 'Set tablet position bottom to 20px',
				property: 'position_bottom',
				assert: action =>
					action.value &&
					action.value.value === 20 &&
					action.value.breakpoint === 'm',
			},
			{
		];

		samples.forEach(sample => {
			const action = buildContainerPGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			} else if (sample.value !== undefined) {
				expect(action.value).toBe(sample.value);
			}
		});
	});

	test('each P attribute can be updated via P-group mapping', () => {
		const missing = [];

		pAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerPGroupAttributeChanges(
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

	test('P-group properties map to sidebar targets', () => {
		const missing = [];

		pAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerPGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
