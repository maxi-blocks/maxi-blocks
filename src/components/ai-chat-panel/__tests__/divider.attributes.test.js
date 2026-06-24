import {
	DIVIDER_PATTERNS,
	handleDividerUpdate,
	getDividerSidebarTarget,
} from '../ai/blocks/divider';

const matchPattern = message =>
	DIVIDER_PATTERNS.find(pattern => pattern.regex.test(message));

const dividerBlock = {
	name: 'maxi-blocks/divider-maxi',
	attributes: {},
};

describe('divider prompt patterns', () => {
	test.each([
		['Make the divider dashed', { property: 'divider_style', value: 'dashed' }],
		['Remove the divider line', { property: 'divider_style', value: 'none' }],
		[
			'Round the divider ends',
			{ property: 'divider_border_radius', value: true },
		],
		['Make the divider thick', { property: 'divider_weight', value: 4 }],
		[
			'Set divider thickness to 3px',
			{ property: 'divider_weight', value: 'use_prompt' },
		],
		[
			'Make the divider width 1px',
			{ property: 'divider_weight', value: 'use_prompt' },
		],
		['Set the divider weight', { property: 'flow_divider_weight', value: 'start' }],
		[
			'Set divider length to 40%',
			{ property: 'divider_size', value: 'use_prompt' },
		],
		['Set the divider length', { property: 'flow_divider_size', value: 'start' }],
		['Make the divider vertical', { property: 'divider_orientation', value: 'vertical' }],
		[
			'Align the divider right',
			{ property: 'divider_align_horizontal', value: 'right' },
		],
		[
			'Align the divider to the bottom',
			{ property: 'divider_align_vertical', value: 'bottom' },
		],
	])('matches "%s"', (message, expected) => {
		const pattern = matchPattern(message);
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe(expected.property);
		expect(pattern.value).toBe(expected.value);
	});
});

describe('divider prompt to attributes', () => {
	test('maps divider style to border style', () => {
		const changes = handleDividerUpdate(
			dividerBlock,
			'divider_style',
			'dashed',
			''
		);
		expect(changes).toEqual({
			'divider-border-style-general': 'dashed',
		});
	});

	test('maps divider weight to border widths', () => {
		const changes = handleDividerUpdate(
			dividerBlock,
			'divider_weight',
			'3px',
			''
		);
		expect(changes).toEqual({
			'divider-border-top-width-general': 3,
			'divider-border-right-width-general': 3,
			'divider-border-top-unit-general': 'px',
			'divider-border-right-unit-general': 'px',
			'divider-border-style-general': 'solid',
		});
	});

	test('maps divider size to width for horizontal divider', () => {
		const changes = handleDividerUpdate(
			dividerBlock,
			'divider_size',
			'40%',
			''
		);
		expect(changes).toEqual({
			'divider-width-general': 40,
			'divider-width-unit-general': '%',
		});
	});

	test('maps divider size to height for vertical divider', () => {
		const verticalBlock = {
			name: 'maxi-blocks/divider-maxi',
			attributes: { 'line-orientation-general': 'vertical' },
		};
		const changes = handleDividerUpdate(
			verticalBlock,
			'divider_size',
			60,
			''
		);
		expect(changes).toEqual({
			'divider-height-general': 60,
		});
	});

	test('maps divider orientation', () => {
		const changes = handleDividerUpdate(
			dividerBlock,
			'divider_orientation',
			'vertical',
			''
		);
		expect(changes).toEqual({
			'line-orientation-general': 'vertical',
		});
	});

	test('maps divider alignment', () => {
		const horizontal = handleDividerUpdate(
			dividerBlock,
			'divider_align_horizontal',
			'left',
			''
		);
		expect(horizontal).toEqual({
			'line-horizontal-general': 'flex-start',
		});

		const vertical = handleDividerUpdate(
			dividerBlock,
			'divider_align_vertical',
			'bottom',
			''
		);
		expect(vertical).toEqual({
			'line-vertical-general': 'flex-end',
		});
	});

	test('maps divider border radius', () => {
		const changes = handleDividerUpdate(
			dividerBlock,
			'divider_border_radius',
			true,
			''
		);
		expect(changes).toEqual({
			'divider-border-radius-general': true,
		});
	});
});

describe('divider sidebar targets', () => {
	test.each([
		['divider_style', { tabIndex: 0, accordion: 'line settings' }],
		['divider_weight', { tabIndex: 0, accordion: 'line settings' }],
		['divider_size', { tabIndex: 0, accordion: 'line settings' }],
		['divider_border_radius', { tabIndex: 0, accordion: 'line settings' }],
		['divider_color', { tabIndex: 0, accordion: 'line settings' }],
		['divider_align_horizontal', { tabIndex: 0, accordion: 'alignment' }],
		['divider_align_vertical', { tabIndex: 0, accordion: 'alignment' }],
		['divider_orientation', { tabIndex: 0, accordion: 'alignment' }],
		['line_horizontal', { tabIndex: 0, accordion: 'alignment' }],
	])('maps %s', (property, expected) => {
		const sidebar = getDividerSidebarTarget(property);
		expect(sidebar).toEqual(expected);
	});
});
