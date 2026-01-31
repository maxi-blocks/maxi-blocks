import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildButtonAGroupAction,
	buildButtonAGroupAttributeChanges,
	getButtonAGroupSidebarTarget,
} from '../ai/utils/buttonAGroup';

const buttonAttributes = rawAttributes.blocks['button-maxi'] || [];
const aAttributes = buttonAttributes.filter(
	attr =>
		/^a/i.test(attr) &&
		!attr.startsWith('advanced-css-') &&
		attr !== 'anchorLink' &&
		attr !== 'ariaLabels'
);

const getBreakpoint = attribute => attribute.split('-').pop();

const buildExpectedForAttribute = attribute => {
	if (attribute.startsWith('align-content-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'align_content',
			value: { value: 'space-between', breakpoint },
			expectedKey: `align-content-${breakpoint}`,
			expectedValue: 'space-between',
			expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('align-items-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'align_items',
			value: { value: 'center', breakpoint },
			expectedKey: `align-items-${breakpoint}`,
			expectedValue: 'center',
			expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
		};
	}

	if (attribute.startsWith('alignment-')) {
		const breakpoint = getBreakpoint(attribute);
		return {
			property: 'alignment',
			value: { value: 'left', breakpoint },
			expectedKey: `alignment-${breakpoint}`,
			expectedValue: 'left',
			expectedSidebar: { tabIndex: 0, accordion: 'alignment' },
		};
	}

	return null;
};

describe('button A attributes', () => {
	test('A-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set the button anchor ID to hero-cta',
				property: 'anchor_link',
				value: 'hero-cta',
			},
			{
				phrase: 'Set button aria label to "Primary CTA"',
				property: 'aria_label',
				value: 'Primary CTA',
			},
			{
				phrase: 'Align button left',
				property: 'alignment',
				value: 'left',
			},
			{
				phrase: 'Align items center',
				property: 'align_items',
				value: 'center',
			},
			{
				phrase: 'Align content space between',
				property: 'align_content',
				value: 'space-between',
			},
			{
				phrase: 'On mobile, align items center',
				property: 'align_items',
				value: { value: 'center', breakpoint: 'xs' },
			},
			{
				phrase: 'On tablet, align content space evenly',
				property: 'align_content',
				value: { value: 'space-evenly', breakpoint: 'm' },
			},
			{
				phrase: 'On desktop, align button right',
				property: 'alignment',
				value: { value: 'right', breakpoint: 'xl' },
			},
		];

		samples.forEach(sample => {
			const action = buildButtonAGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('each A attribute can be updated via A-group mapping', () => {
		const missing = [];
		const attributes = { ariaLabels: { icon: 'Decorative' } };

		aAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildButtonAGroupAttributeChanges(
				config.property,
				config.value,
				{ attributes }
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

	test('A-group breakpoint prompts update the expected attribute and sidebar', () => {
		const samples = [
			{
				phrase: 'On mobile, align items center',
				expectedKey: 'align-items-xs',
				expectedValue: 'center',
				expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
			},
			{
				phrase: 'On tablet, align content space evenly',
				expectedKey: 'align-content-m',
				expectedValue: 'space-evenly',
				expectedSidebar: { tabIndex: 2, accordion: 'flexbox' },
			},
			{
				phrase: 'On desktop, align button right',
				expectedKey: 'alignment-xl',
				expectedValue: 'right',
				expectedSidebar: { tabIndex: 0, accordion: 'alignment' },
			},
		];

		samples.forEach(sample => {
			const action = buildButtonAGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			const changes = buildButtonAGroupAttributeChanges(
				action.property,
				action.value,
				{ attributes: {} }
			);
			expect(changes).toBeTruthy();
			expect(changes[sample.expectedKey]).toBe(sample.expectedValue);

			const sidebar = getButtonAGroupSidebarTarget(action.property);
			expect(sidebar).toEqual(sample.expectedSidebar);
		});
	});

	test('A-group properties map to sidebar targets', () => {
		const missing = [];
		aAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getButtonAGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
