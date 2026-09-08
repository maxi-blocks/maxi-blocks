import {
	ACCORDION_PATTERNS,
	handleAccordionUpdate,
	getAccordionSidebarTarget,
} from '../ai/blocks/accordion';

const matchPattern = message =>
	ACCORDION_PATTERNS.find(pattern => pattern.regex.test(message));

const accordionBlock = {
	name: 'maxi-blocks/accordion-maxi',
	attributes: {},
};

describe('accordion prompt patterns', () => {
	test.each([
		[
			'Make the accordion non-collapsible',
			{ property: 'accordion_collapsible', value: false },
		],
		[
			'Make accordion collapsible',
			{ property: 'accordion_collapsible', value: true },
		],
		[
			'Allow multiple panes open',
			{ property: 'accordion_auto_close', value: false },
		],
		[
			'Auto close other accordion panels',
			{ property: 'accordion_auto_close', value: true },
		],
		['Use boxed accordion layout', { property: 'accordion_layout', value: 'boxed' }],
		['Use simple accordion layout', { property: 'accordion_layout', value: 'simple' }],
		[
			'Make the accordion animation faster',
			{ property: 'accordion_animation_duration', value: 0.2 },
		],
		[
			'Slow down accordion animation',
			{ property: 'accordion_animation_duration', value: 0.6 },
		],
		['Set accordion title to H3', { property: 'accordion_title_level', value: 'h3' }],
		[
			'Move accordion icon to the right',
			{ property: 'accordion_icon_position', value: 'right' },
		],
	])('matches "%s"', (message, expected) => {
		const pattern = matchPattern(message);
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe(expected.property);
		expect(pattern.value).toEqual(expected.value);
	});
});

describe('accordion prompt to attributes', () => {
	test.each([
		[
			'Make the accordion boxed',
			{
				property: 'accordion_layout',
				value: 'boxed',
				expectedChanges: { accordionLayout: 'boxed' },
				expectedSidebar: { tabIndex: 0, accordion: 'accordion settings' },
			},
		],
		[
			'Allow multiple panes open',
			{
				property: 'accordion_auto_close',
				value: false,
				expectedChanges: { autoPaneClose: false },
				expectedSidebar: { tabIndex: 0, accordion: 'accordion settings' },
			},
		],
		[
			'Set accordion title to H4',
			{
				property: 'accordion_title_level',
				value: 'h4',
				expectedChanges: { titleLevel: 'h4' },
				expectedSidebar: { tabIndex: 0, accordion: 'title' },
			},
		],
		[
			'Move accordion icon to the left',
			{
				property: 'accordion_icon_position',
				value: 'left',
				expectedChanges: { 'icon-position': 'left' },
				expectedSidebar: { tabIndex: 0, accordion: 'icon' },
			},
		],
	])('maps "%s"', (message, expected) => {
		const pattern = matchPattern(message);
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe(expected.property);
		expect(pattern.value).toEqual(expected.value);

		const changes = handleAccordionUpdate(
			accordionBlock,
			pattern.property,
			pattern.value,
			''
		);
		expect(changes).toEqual(expected.expectedChanges);

		const sidebar = getAccordionSidebarTarget(pattern.property);
		expect(sidebar).toEqual(expected.expectedSidebar);
	});
});

describe('accordion attribute updates', () => {
	test('maps animation duration from ms', () => {
		const changes = handleAccordionUpdate(
			accordionBlock,
			'accordion_animation_duration',
			'500ms',
			''
		);
		expect(changes).toBeTruthy();
		expect(changes.animationDuration).toBeCloseTo(0.5);
	});

	test('maps title and active title colors', () => {
		const titleChanges = handleAccordionUpdate(
			accordionBlock,
			'accordion_title_color',
			3,
			''
		);
		expect(titleChanges).toEqual({
			'title-palette-status-general': true,
			'title-palette-color-general': 3,
			'title-color-general': '',
		});

		const activeTitleChanges = handleAccordionUpdate(
			accordionBlock,
			'accordion_active_title_color',
			'var(--h1)',
			''
		);
		expect(activeTitleChanges).toEqual({
			'active-title-palette-status-general': false,
			'active-title-palette-color-general': '',
			'active-title-color-general': 'var(--h1)',
			'title-typography-status-active': true,
		});
	});

	test('maps icon sizes and colors', () => {
		const sizeChanges = handleAccordionUpdate(
			accordionBlock,
			'accordion_icon_size',
			'32px',
			''
		);
		expect(sizeChanges).toEqual(
			expect.objectContaining({
				'icon-width-general': '32',
				'icon-width-unit-general': 'px',
				'icon-width-fit-content-general': false,
				'icon-height-general': '32',
				'icon-height-unit-general': 'px',
			})
		);

		const widthChanges = handleAccordionUpdate(
			accordionBlock,
			'accordion_icon_width',
			24,
			''
		);
		expect(widthChanges).toEqual(
			expect.objectContaining({
				'icon-width-general': '24',
				'icon-width-unit-general': 'px',
				'icon-width-fit-content-general': false,
			})
		);

		const colorChanges = handleAccordionUpdate(
			accordionBlock,
			'accordion_icon_color',
			2,
			''
		);
		expect(colorChanges).toEqual(
			expect.objectContaining({
				'icon-stroke-palette-status': true,
				'icon-stroke-palette-color': 2,
				'icon-stroke-color': '',
				'icon-inherit': false,
			})
		);

		const activeColorChanges = handleAccordionUpdate(
			accordionBlock,
			'accordion_active_icon_fill_color',
			6,
			''
		);
		expect(activeColorChanges).toEqual(
			expect.objectContaining({
				'active-icon-fill-palette-status': true,
				'active-icon-fill-palette-color': 6,
				'active-icon-fill-color': '',
				'active-icon-inherit': false,
			})
		);

		const activeSizeChanges = handleAccordionUpdate(
			accordionBlock,
			'accordion_active_icon_size',
			{ value: 20, unit: 'px' },
			''
		);
		expect(activeSizeChanges).toEqual(
			expect.objectContaining({
				'active-icon-width-general': '20',
				'active-icon-width-unit-general': 'px',
				'active-icon-width-fit-content-general': false,
				'active-icon-height-general': '20',
				'active-icon-height-unit-general': 'px',
			})
		);
	});

	test('maps line colors', () => {
		const lineChanges = handleAccordionUpdate(
			accordionBlock,
			'accordion_line_color',
			4,
			''
		);
		expect(lineChanges).toEqual(
			expect.objectContaining({
				'header-divider-border-palette-status-general': true,
				'header-divider-border-palette-color-general': 4,
				'content-divider-border-palette-status-general': true,
				'content-divider-border-palette-color-general': 4,
			})
		);

		const headerChanges = handleAccordionUpdate(
			accordionBlock,
			'accordion_header_line_color',
			'var(--p)',
			''
		);
		expect(headerChanges).toEqual(
			expect.objectContaining({
				'header-divider-border-palette-status-general': false,
				'header-divider-border-palette-color-general': '',
				'header-divider-border-color-general': 'var(--p)',
			})
		);
	});
});

describe('accordion sidebar targets', () => {
	test.each([
		['accordion_layout', { tabIndex: 0, accordion: 'accordion settings' }],
		['accordion_collapsible', { tabIndex: 0, accordion: 'accordion settings' }],
		['accordion_auto_close', { tabIndex: 0, accordion: 'accordion settings' }],
		['accordion_title_level', { tabIndex: 0, accordion: 'title' }],
		['accordion_title_color', { tabIndex: 0, accordion: 'title' }],
		['accordion_active_title_color', { tabIndex: 0, accordion: 'title' }],
		['accordion_icon_position', { tabIndex: 0, accordion: 'icon' }],
		['accordion_icon_size', { tabIndex: 0, accordion: 'icon' }],
		['accordion_active_icon_color', { tabIndex: 0, accordion: 'active icon' }],
		['accordion_line_color', { tabIndex: 0, accordion: 'line settings' }],
		['accordionLayout', { tabIndex: 0, accordion: 'accordion settings' }],
		['titleLevel', { tabIndex: 0, accordion: 'title' }],
	])('maps %s', (property, expected) => {
		const sidebar = getAccordionSidebarTarget(property);
		expect(sidebar).toEqual(expected);
	});
});
