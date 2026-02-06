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

jest.mock(
	'@extensions/styles',
	() => ({
		getBlockStyle: () => 'maxi',
		getPaletteAttributes: () => ({
			paletteStatus: false,
			paletteColor: '',
			color: '',
		}),
	}),
	{ virtual: true }
);

jest.mock(
	'@extensions/svg',
	() => ({
		setSVGStrokeWidth: (content, width) => {
			if (!width) return content;
			const next = String(content || '');
			return next
				.replace(/stroke-width:.+?(?=})/g, `stroke-width:${width}`)
				.replace(/stroke-width=\".+?(?=\")/g, `stroke-width=\"${width}`);
		},
	}),
	{ virtual: true }
);

import {
	ICON_PATTERNS,
	handleIconUpdate,
	getIconSidebarTarget,
} from '../ai/blocks/icon';
import { CLOUD_ICON_PATTERN } from '../ai/patterns/cloudIcon';
import {
	extractIconQuery,
	extractIconStyleIntent,
	stripIconStylePhrases,
} from '../iconSearch';
import { buildColorUpdate, getColorTargetFromMessage } from '../ai/color/colorClarify';
import updateBackgroundColor from '../ai/color/backgroundUpdate';
import {
	buildContainerPGroupAction,
	buildContainerPGroupAttributeChanges,
	buildContainerWGroupAction,
	buildContainerWGroupAttributeChanges,
} from '../ai/utils/containerGroups';

const matchPattern = message =>
	ICON_PATTERNS.find(pattern => pattern.regex.test(message));

const iconBlock = {
	name: 'maxi-blocks/svg-icon-maxi',
	attributes: {
		content:
			'<svg viewBox="0 0 24 24"><path stroke-width="1" d="M0 0h24v24H0z"/></svg>',
	},
};

describe('icon prompt patterns', () => {
	test.each([
		[
			'Set icon alt title to "Decorative star"',
			{ property: 'altTitle', value: 'use_prompt' },
		],
		[
			'Set icon alt description to "A star icon used as decoration"',
			{ property: 'altDescription', value: 'use_prompt' },
		],
		['Change icon fill colour', { property: 'flow_icon_fill', value: 'start' }],
		[
			'Change icon stroke colour',
			{ property: 'flow_icon_stroke', value: 'start' },
		],
		[
			'Change icon hover fill colour',
			{ property: 'flow_icon_hover_fill', value: 'start' },
		],
		[
			'Change icon hover stroke colour',
			{ property: 'flow_icon_hover_stroke', value: 'start' },
		],
		['Set icon line width to 2', { property: 'flow_icon_line_width', value: 'start' }],
		['Set line width to 2', { property: 'flow_icon_line_width', value: 'start' }],
		['Align icons left', { property: 'alignment', value: 'left' }],
	])('matches "%s"', (message, expected) => {
		const pattern = matchPattern(message);
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe(expected.property);
		expect(pattern.value).toBe(expected.value);
	});
});

describe('icon prompt to attributes', () => {
	test('maps alt title/description updates', () => {
		expect(handleIconUpdate(iconBlock, 'altTitle', 'Decorative star')).toEqual({
			altTitle: 'Decorative star',
		});
		expect(
			handleIconUpdate(iconBlock, 'altDescription', 'A decorative star')
		).toEqual({
			altDescription: 'A decorative star',
		});
	});

	test('maps alignment updates', () => {
		const changes = handleIconUpdate(iconBlock, 'alignment', 'right');
		expect(changes).toEqual({ 'alignment-general': 'right' });
	});

	test('maps Typesense icon updates (icon_svg)', () => {
		const changes = handleIconUpdate(iconBlock, 'icon_svg', {
			svgCode: '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
			svgType: 'Line',
			title: 'Cart',
		});

		expect(changes).toEqual({
			content: '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
			svgType: 'Line',
			altTitle: 'Cart',
		});
	});

	test('maps fill/stroke colour flows', () => {
		expect(handleIconUpdate(iconBlock, 'flow_icon_fill', 'start', '', {})).toEqual({
			action: 'ask_palette',
			target: 'icon_fill',
			msg: 'Which colour for the icon fill?',
		});

		expect(
			handleIconUpdate(iconBlock, 'flow_icon_fill', 'start', '', {
				icon_fill: 6,
			})
		).toEqual({
			action: 'apply',
			attributes: {
				'svg-fill-palette-status': true,
				'svg-fill-palette-color': 6,
				'svg-fill-color': '',
			},
			done: true,
			message: 'Updated icon fill colour.',
		});

		expect(
			handleIconUpdate(iconBlock, 'flow_icon_stroke', 'start', '', {
				icon_stroke: 'var(--h1)',
			})
		).toEqual({
			action: 'apply',
			attributes: {
				'svg-line-palette-status': false,
				'svg-line-palette-color': '',
				'svg-line-color': 'var(--h1)',
			},
			done: true,
			message: 'Updated icon stroke colour.',
		});
	});

	test('maps hover fill/stroke flows', () => {
		expect(
			handleIconUpdate(iconBlock, 'flow_icon_hover_fill', 'start', '', {
				icon_hover_fill: 4,
			})
		).toEqual({
			action: 'apply',
			attributes: {
				'svg-fill-palette-status-hover': true,
				'svg-fill-palette-color-hover': 4,
				'svg-fill-color-hover': '',
				'svg-status-hover': true,
			},
			done: true,
			message: 'Updated icon fill hover colour.',
		});

		expect(
			handleIconUpdate(iconBlock, 'flow_icon_hover_stroke', 'start', '', {
				icon_hover_stroke: '#ff0000',
			})
		).toEqual({
			action: 'apply',
			attributes: {
				'svg-line-palette-status-hover': false,
				'svg-line-palette-color-hover': '',
				'svg-line-color-hover': '#ff0000',
				'svg-status-hover': true,
			},
			done: true,
			message: 'Updated icon line hover colour.',
		});
	});

	test('maps line width flow', () => {
		const prompt = handleIconUpdate(iconBlock, 'flow_icon_line_width', 'start', '', {});
		expect(prompt).toMatchObject({
			action: 'ask_options',
			target: 'icon_line_width',
		});

		expect(
			handleIconUpdate(iconBlock, 'flow_icon_line_width', 'start', '', {
				icon_line_width: 2,
			})
		).toEqual({
			action: 'apply',
			attributes: {
				'svg-stroke-general': 2,
				content:
					'<svg viewBox="0 0 24 24"><path stroke-width="2" d="M0 0h24v24H0z"/></svg>',
			},
			done: true,
			message: 'Updated icon line width.',
		});
	});

	test('supports prefixed layout attribute changes via container groups', () => {
		expect(buildContainerWGroupAction('Set line width to 4')).toBeNull();

		const widthAction = buildContainerWGroupAction('Set width to 120px', {
			scope: 'selection',
			blockName: iconBlock.name,
		});
		expect(widthAction).toBeTruthy();
		expect(widthAction.property).toBe('width');

		const widthChanges = buildContainerWGroupAttributeChanges(
			widthAction.property,
			widthAction.value,
			{ prefix: 'svg-' }
		);
		expect(widthChanges).toBeTruthy();
		expect(widthChanges['svg-width-general']).toBe(120);
		expect(widthChanges['svg-width-unit-general']).toBe('px');
		expect(widthChanges['svg-width-fit-content-general']).toBe(false);

		const paddingAction = buildContainerPGroupAction('Set padding to 10px', {
			scope: 'selection',
		});
		expect(paddingAction).toBeTruthy();
		expect(paddingAction.property).toBe('padding');

		const paddingChanges = buildContainerPGroupAttributeChanges(
			paddingAction.property,
			paddingAction.value,
			{ prefix: 'svg-' }
		);
		expect(paddingChanges).toBeTruthy();
		expect(paddingChanges['svg-padding-top-general']).toBe(10);
		expect(paddingChanges['svg-padding-top-unit-general']).toBe('px');
	});
});

describe('icon cloud library prompt parsing', () => {
	test.each([
		['Cart icon'],
		['Cart icon.'],
		['Outline shopping cart icon'],
		['Outline shopping cart icon!'],
	])('cloud icon regex matches "%s"', message => {
		expect(CLOUD_ICON_PATTERN.regex.test(message)).toBe(true);
	});

	test('extracts icon query from short icon prompts', () => {
		expect(extractIconQuery('Cart icon')).toBe('Cart');
		expect(extractIconQuery('Outline shopping cart icon')).toBe(
			'Outline shopping cart'
		);
	});

	test('detects and strips outline style in adjective phrasing', () => {
		expect(extractIconStyleIntent('Outline shopping cart icon')).toBe('line');
		expect(stripIconStylePhrases('Outline shopping cart icon')).toBe(
			'shopping cart icon'
		);
		expect(extractIconQuery(stripIconStylePhrases('Outline shopping cart icon'))).toBe(
			'shopping cart'
		);
	});
});

describe('icon sidebar targets', () => {
	test.each([
		['altTitle', { tabIndex: 0, accordion: 'icon alt' }],
		['altDescription', { tabIndex: 0, accordion: 'icon alt' }],
		['icon_svg', { tabIndex: 0, accordion: 'icon' }],
		['alignment', { tabIndex: 0, accordion: 'alignment' }],
		['flow_icon_fill', { tabIndex: 0, accordion: 'icon colour' }],
		['flow_icon_stroke', { tabIndex: 0, accordion: 'icon colour' }],
		['flow_icon_hover_fill', { tabIndex: 0, accordion: 'icon colour' }],
		['flow_icon_hover_stroke', { tabIndex: 0, accordion: 'icon colour' }],
		['flow_icon_line_width', { tabIndex: 0, accordion: 'icon line width' }],
		['svg_fill_color', { tabIndex: 0, accordion: 'icon colour' }],
		['svg_stroke_width', { tabIndex: 0, accordion: 'icon line width' }],
		['background_color', { tabIndex: 0, accordion: 'icon background' }],
		['border', { tabIndex: 0, accordion: 'border' }],
		['box_shadow', { tabIndex: 0, accordion: 'box shadow' }],
		['width', { tabIndex: 0, accordion: 'height / width' }],
		['padding', { tabIndex: 0, accordion: 'margin / padding' }],
	])('maps %s', (property, expected) => {
		const sidebar = getIconSidebarTarget(property);
		expect(sidebar).toEqual(expected);
	});
});

describe('icon background color clarify flow', () => {
	test('targets icon background for svg icons by default', () => {
		const target = getColorTargetFromMessage('background colour', { selectedBlock: iconBlock });
		expect(target).toBe('icon-background');

		const update = buildColorUpdate(target, 6, { selectedBlock: iconBlock });
		expect(update.property).toBe('background_color');
		expect(update.targetBlock).toBe('icon');
		expect(update.msgText).toBe('icon background');
	});

	test('ignores container mention when explicitly negated', () => {
		const target = getColorTargetFromMessage(
			'Background colour (should affect icon background, not container)',
			{ selectedBlock: iconBlock }
		);
		expect(target).toBe('icon-background');
	});

	test('supports svg-prefixed icon background updates', () => {
		const changes = updateBackgroundColor('client-id', 6, {}, 'svg-');
		expect(changes['svg-background-active-media-general']).toBe('color');
		expect(changes['svg-background-palette-status-general']).toBe(true);
		expect(changes['svg-background-palette-color-general']).toBe(6);
	});
});
