jest.mock(
	'@components/background-control/utils',
	() => ({
		getDefaultLayerWithBreakpoint: () => ({
			id: 1,
			order: 0,
			type: 'color',
		}),
		getLayerLabel: () => 'Color',
	}),
	{ virtual: true }
);

import {
	NUMBER_COUNTER_PATTERNS,
	handleNumberCounterUpdate,
	getNumberCounterSidebarTarget,
} from '../ai/blocks/number-counter';
import {
	buildContainerPGroupAction,
	buildContainerPGroupAttributeChanges,
	buildContainerWGroupAction,
	buildContainerWGroupAttributeChanges,
} from '../ai/utils/containerGroups';

const matchPattern = message =>
	NUMBER_COUNTER_PATTERNS.find(pattern => pattern.regex.test(message));

const counterBlock = {
	name: 'maxi-blocks/number-counter-maxi',
	attributes: {},
};

describe('number counter prompt patterns', () => {
	test.each([
		[
			'Set number counter from 0 to 250',
			{ property: 'number_counter_range', value: 'use_prompt' },
		],
		[
			'Set start number to 10',
			{ property: 'number_counter_start', value: 'use_prompt' },
		],
		[
			'Set end number to 200',
			{ property: 'number_counter_end', value: 'use_prompt' },
		],
		[
			'Set duration to 2 seconds',
			{ property: 'number_counter_duration', value: 'use_prompt' },
		],
		[
			'Set counter stroke to 6',
			{ property: 'number_counter_stroke', value: 'use_prompt' },
		],
		[
			'Enable preview on the counter',
			{ property: 'number_counter_preview', value: true },
		],
		[
			'Disable preview on the number counter',
			{ property: 'number_counter_preview', value: false },
		],
		[
			'Enable percentage sign',
			{ property: 'number_counter_percentage_sign', value: true },
		],
		[
			'Disable percentage sign',
			{ property: 'number_counter_percentage_sign', value: false },
		],
		[
			'Set counter text color to palette 4',
			{ property: 'number_counter_text_color', value: 'use_prompt' },
		],
		[
			'Set title font size to 48',
			{ property: 'number_counter_title_font_size', value: 'use_prompt' },
		],
	])('matches "%s"', (message, expected) => {
		const pattern = matchPattern(message);
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe(expected.property);
		expect(pattern.value).toBe(expected.value);
	});
});

describe('number counter prompt to attributes', () => {
	test('maps range/start/end/duration/stroke updates', () => {
		expect(
			handleNumberCounterUpdate(counterBlock, 'number_counter_range', {
				start: 0,
				end: 250,
			})
		).toEqual({ 'number-counter-start': 0, 'number-counter-end': 250 });

		expect(
			handleNumberCounterUpdate(counterBlock, 'number_counter_start', 10)
		).toEqual({ 'number-counter-start': 10 });
		expect(
			handleNumberCounterUpdate(counterBlock, 'number_counter_end', 200)
		).toEqual({ 'number-counter-end': 200 });
		expect(
			handleNumberCounterUpdate(counterBlock, 'number_counter_duration', 2)
		).toEqual({ 'number-counter-duration': 2 });
		expect(
			handleNumberCounterUpdate(counterBlock, 'number_counter_stroke', 6)
		).toEqual({ 'number-counter-stroke': 6 });
	});

	test('clamps start animation offset', () => {
		expect(
			handleNumberCounterUpdate(counterBlock, 'number_counter_start_offset', 5)
		).toEqual({ 'number-counter-start-animation-offset': 50 });
		expect(
			handleNumberCounterUpdate(counterBlock, 'number_counter_start_offset', 120)
		).toEqual({ 'number-counter-start-animation-offset': 100 });
	});

	test('maps text color palette/custom values', () => {
		expect(
			handleNumberCounterUpdate(counterBlock, 'number_counter_text_color', 4)
		).toEqual({
			'number-counter-text-palette-status-general': true,
			'number-counter-text-palette-color-general': 4,
			'number-counter-text-color-general': '',
		});

		expect(
			handleNumberCounterUpdate(
				counterBlock,
				'number_counter_text_color',
				'var(--h1)'
			)
		).toEqual({
			'number-counter-text-palette-status-general': false,
			'number-counter-text-palette-color-general': '',
			'number-counter-text-color-general': 'var(--h1)',
		});
	});

	test('maps title font size', () => {
		expect(
			handleNumberCounterUpdate(
				counterBlock,
				'number_counter_title_font_size',
				48
			)
		).toEqual({ 'number-counter-title-font-size-general': 48 });
	});

	test('supports prefixed layout attribute changes via container groups', () => {
		const widthAction = buildContainerWGroupAction('Set width to 300px', {
			scope: 'selection',
			blockName: counterBlock.name,
		});
		expect(widthAction).toBeTruthy();
		expect(widthAction.property).toBe('width');

		const widthChanges = buildContainerWGroupAttributeChanges(
			widthAction.property,
			widthAction.value,
			{ prefix: 'number-counter-' }
		);
		expect(widthChanges).toBeTruthy();
		expect(widthChanges['number-counter-width-general']).toBe(300);
		expect(widthChanges['number-counter-width-unit-general']).toBe('px');

		const paddingAction = buildContainerPGroupAction('Set padding to 12px', {
			scope: 'selection',
		});
		expect(paddingAction).toBeTruthy();
		expect(paddingAction.property).toBe('padding');

		const paddingChanges = buildContainerPGroupAttributeChanges(
			paddingAction.property,
			paddingAction.value,
			{ prefix: 'number-counter-' }
		);
		expect(paddingChanges).toBeTruthy();
		expect(paddingChanges['number-counter-padding-top-general']).toBe(12);
		expect(paddingChanges['number-counter-padding-top-unit-general']).toBe('px');
	});
});

describe('number counter sidebar targets', () => {
	test.each([
		['number_counter_start', { tabIndex: 0, accordion: 'number' }],
		['number_counter_end', { tabIndex: 0, accordion: 'number' }],
		['number_counter_duration', { tabIndex: 0, accordion: 'number' }],
		['number_counter_text_color', { tabIndex: 0, accordion: 'number' }],
		['width', { tabIndex: 0, accordion: 'number' }],
		['border', { tabIndex: 0, accordion: 'border' }],
		['box_shadow', { tabIndex: 0, accordion: 'box shadow' }],
		['padding', { tabIndex: 0, accordion: 'margin / padding' }],
		['background_color', { tabIndex: 1, accordion: 'background / layer' }],
	])('maps %s', (property, expected) => {
		const sidebar = getNumberCounterSidebarTarget(property);
		expect(sidebar).toEqual(expected);
	});
});

