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

import { GROUP_PATTERNS } from '../ai/blocks/group';
import {
	buildContainerAGroupAction,
	buildContainerAGroupAttributeChanges,
	getContainerAGroupSidebarTarget,
	buildContainerCGroupAction,
	buildContainerCGroupAttributeChanges,
	getContainerCGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const matchPattern = message =>
	GROUP_PATTERNS.find(pattern => pattern.regex.test(message));

describe('group prompt patterns', () => {
	test('matches group background color clarification', () => {
		const pattern = matchPattern('Change the group background color');
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe('color_clarify');
		expect(pattern.value).toBe('show_palette');
		expect(pattern.target).toBe('group');
	});
});

describe('group callout arrow mapping', () => {
	test('maps arrow prompt to attributes and sidebar', () => {
		const action = buildContainerAGroupAction('Show the callout arrow');
		expect(action).toBeTruthy();
		expect(action.property).toBe('arrow_status');
		expect(action.value).toBe(true);

		const changes = buildContainerAGroupAttributeChanges(
			action.property,
			action.value
		);
		expect(changes['arrow-status-general']).toBe(true);
		expect(getContainerAGroupSidebarTarget(action.property)).toEqual({
			tabIndex: 0,
			accordion: 'callout arrow',
		});
	});
});

describe('group context loop mapping', () => {
	test('maps context loop prompt to attributes and sidebar', () => {
		const action = buildContainerCGroupAction(
			'Enable a context loop for recent posts'
		);
		expect(action).toBeTruthy();
		expect(action.property).toBe('context_loop');

		const changes = buildContainerCGroupAttributeChanges(action.property, action.value);
		expect(changes['cl-status']).toBe(true);
		expect(changes['cl-type']).toBe('post');
		expect(changes['cl-order-by']).toBe('date');
		expect(changes['cl-order']).toBe('desc');
		expect(getContainerCGroupSidebarTarget(action.property)).toEqual({
			tabIndex: 0,
			accordion: 'context loop',
		});
	});
});
