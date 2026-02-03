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
	ICON_PATTERNS,
	handleIconUpdate,
	getIconSidebarTarget,
} from '../ai/blocks/icon';
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
	attributes: {},
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

	test('supports prefixed layout attribute changes via container groups', () => {
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

describe('icon sidebar targets', () => {
	test.each([
		['altTitle', { tabIndex: 0, accordion: 'icon alt' }],
		['altDescription', { tabIndex: 0, accordion: 'icon alt' }],
		['alignment', { tabIndex: 0, accordion: 'alignment' }],
		['svg_fill_color', { tabIndex: 0, accordion: 'fill & stroke color' }],
		['svg_stroke_width', { tabIndex: 0, accordion: 'icon line width' }],
		['background_color', { tabIndex: 0, accordion: 'icon' }],
		['border', { tabIndex: 0, accordion: 'border' }],
		['box_shadow', { tabIndex: 0, accordion: 'box shadow' }],
		['width', { tabIndex: 0, accordion: 'height / width' }],
		['padding', { tabIndex: 0, accordion: 'margin / padding' }],
	])('maps %s', (property, expected) => {
		const sidebar = getIconSidebarTarget(property);
		expect(sidebar).toEqual(expected);
	});
});

