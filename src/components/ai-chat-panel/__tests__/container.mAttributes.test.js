import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerMGroupAction,
	buildContainerMGroupAttributeChanges,
	getContainerMGroupSidebarTarget,
} from '../ai/utils/containerMGroup';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const mAttributes = containerAttributes.filter(attr => /^m/i.test(attr));

const WIDTH_VALUE = 1200;
const HEIGHT_VALUE = 600;
const MARGIN_VALUE = 40;

const buildExpectedForAttribute = attribute => {
	const marginSideMatch = attribute.match(
		/^margin-(top|bottom|left|right)-(general|xxl|xl|l|m|s|xs)$/
	);
	if (marginSideMatch) {
		const side = marginSideMatch[1];
		const breakpoint = marginSideMatch[2];
		return {
			property: `margin_${side}`,
			value: { value: MARGIN_VALUE, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: MARGIN_VALUE,
			expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
		};
	}

	const marginUnitMatch = attribute.match(
		/^margin-(top|bottom|left|right)-unit-(general|xxl|xl|l|m|s|xs)$/
	);
	if (marginUnitMatch) {
		const side = marginUnitMatch[1];
		const breakpoint = marginUnitMatch[2];
		return {
			property: `margin_${side}`,
			value: { value: MARGIN_VALUE, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: 'px',
			expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
		};
	}

	const marginSyncMatch = attribute.match(/^margin-sync-(general|xxl|xl|l|m|s|xs)$/);
	if (marginSyncMatch) {
		const breakpoint = marginSyncMatch[1];
		return {
			property: 'margin',
			value: { value: MARGIN_VALUE, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: 'all',
			expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
		};
	}

	const sizeMatch = attribute.match(
		/^(max|min)-(width|height)-(general|xxl|xl|l|m|s|xs)$/
	);
	if (sizeMatch) {
		const type = sizeMatch[1];
		const axis = sizeMatch[2];
		const breakpoint = sizeMatch[3];
		const value = axis === 'width' ? WIDTH_VALUE : HEIGHT_VALUE;
		return {
			property: `${type}_${axis}`,
			value: { value, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: value,
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	const sizeUnitMatch = attribute.match(
		/^(max|min)-(width|height)-unit-(general|xxl|xl|l|m|s|xs)$/
	);
	if (sizeUnitMatch) {
		const type = sizeUnitMatch[1];
		const axis = sizeUnitMatch[2];
		const breakpoint = sizeUnitMatch[3];
		const value = axis === 'width' ? WIDTH_VALUE : HEIGHT_VALUE;
		return {
			property: `${type}_${axis}`,
			value: { value, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: 'px',
			expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
		};
	}

	if (attribute === 'maxi-version-current') {
		return {
			property: 'maxi_version_current',
			value: '1.2.3',
			expectedKey: 'maxi-version-current',
			expectedValue: '1.2.3',
			expectedSidebar: { tabIndex: 0, accordion: 'block settings' },
		};
	}

	if (attribute === 'maxi-version-origin') {
		return {
			property: 'maxi_version_origin',
			value: '1.0.0',
			expectedKey: 'maxi-version-origin',
			expectedValue: '1.0.0',
			expectedSidebar: { tabIndex: 0, accordion: 'block settings' },
		};
	}

	return null;
};

describe('container M attributes', () => {
	test('M-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set margin top to 24px',
				property: 'margin_top',
				value: '24px',
			},
			{
				phrase: 'Set margin-top to 24px',
				property: 'margin_top',
				value: '24px',
			},
			{
				phrase: 'Set margin to 16px',
				property: 'margin',
				value: '16px',
			},
			{
				phrase: 'Remove margin bottom',
				property: 'margin_bottom',
				value: '0px',
			},
			{
				phrase: 'Set max width to 1200px',
				property: 'max_width',
				value: '1200px',
			},
			{
				phrase: 'Set max-width to 1200px',
				property: 'max_width',
				value: '1200px',
			},
			{
				phrase: 'Set min width to 320px',
				property: 'min_width',
				value: '320px',
			},
			{
				phrase: 'Set max height to 80vh',
				property: 'max_height',
				value: '80vh',
			},
			{
				phrase: 'Set min height to 400px',
				property: 'min_height',
				value: '400px',
			},
			{
				phrase: 'Set current Maxi version to 1.2.3',
				property: 'maxi_version_current',
				value: '1.2.3',
			},
			{
				phrase: 'Set Maxi origin version to 1.0.0',
				property: 'maxi_version_origin',
				value: '1.0.0',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerMGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.value !== undefined) {
				expect(action.value).toBe(sample.value);
			}
		});
	});

	test('each M attribute can be updated via M-group mapping', () => {
		const missing = [];

		mAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerMGroupAttributeChanges(
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

	test('M-group properties map to sidebar targets', () => {
		const missing = [];

		mAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerMGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
