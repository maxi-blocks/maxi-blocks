import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerTGroupAction,
	buildContainerTGroupAttributeChanges,
	getContainerTGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const tAttributes = containerAttributes.filter(attr => /^t/i.test(attr));

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const TRANSFORM_TARGET = 'container';
const SCALE_VALUE = 110;
const ROTATE_VALUE = 15;
const TRANSLATE_X = 20;
const TRANSLATE_Y = -10;
const ORIGIN_X = 'left';
const ORIGIN_Y = 'top';

const TRANSITION_DURATION = 0.4;
const TRANSITION_BASE = {
	canvas: {
		border: {
			'transition-duration-general': 0.3,
			'transition-delay-general': 0,
			'easing-general': 'ease',
			'transition-status-general': true,
		},
	},
	transform: {
		container: {
			'transition-duration-general': 0.3,
			'transition-delay-general': 0,
			'easing-general': 'ease',
			'transition-status-general': true,
		},
	},
};

const buildExpectedForAttribute = attribute => {
	const scaleMatch = attribute.match(/^transform-scale-(general|xxl|xl|l|m|s|xs)$/);
	if (scaleMatch) {
		const breakpoint = scaleMatch[1];
		return {
			property: 'transform_scale',
			value: { x: SCALE_VALUE, y: SCALE_VALUE, breakpoint },
			expectedKey: attribute,
			expectedValue: {
				[TRANSFORM_TARGET]: {
					normal: { x: SCALE_VALUE, y: SCALE_VALUE },
				},
			},
			expectDeepEqual: true,
			expectedSidebar: { tabIndex: 1, accordion: 'transform' },
		};
	}

	const rotateMatch = attribute.match(/^transform-rotate-(general|xxl|xl|l|m|s|xs)$/);
	if (rotateMatch) {
		const breakpoint = rotateMatch[1];
		return {
			property: 'transform_rotate',
			value: { z: ROTATE_VALUE, breakpoint },
			expectedKey: attribute,
			expectedValue: {
				[TRANSFORM_TARGET]: {
					normal: { z: ROTATE_VALUE },
				},
			},
			expectDeepEqual: true,
			expectedSidebar: { tabIndex: 1, accordion: 'transform' },
		};
	}

	const translateMatch = attribute.match(/^transform-translate-(general|xxl|xl|l|m|s|xs)$/);
	if (translateMatch) {
		const breakpoint = translateMatch[1];
		return {
			property: 'transform_translate',
			value: { x: TRANSLATE_X, y: TRANSLATE_Y, unit: 'px', breakpoint },
			expectedKey: attribute,
			expectedValue: {
				[TRANSFORM_TARGET]: {
					normal: {
						x: TRANSLATE_X,
						y: TRANSLATE_Y,
						'x-unit': 'px',
						'y-unit': 'px',
					},
				},
			},
			expectDeepEqual: true,
			expectedSidebar: { tabIndex: 1, accordion: 'transform' },
		};
	}

	const originMatch = attribute.match(/^transform-origin-(general|xxl|xl|l|m|s|xs)$/);
	if (originMatch) {
		const breakpoint = originMatch[1];
		return {
			property: 'transform_origin',
			value: { x: ORIGIN_X, y: ORIGIN_Y, breakpoint },
			expectedKey: attribute,
			expectedValue: {
				[TRANSFORM_TARGET]: {
					normal: {
						x: ORIGIN_X,
						y: ORIGIN_Y,
					},
				},
			},
			expectDeepEqual: true,
			expectedSidebar: { tabIndex: 1, accordion: 'transform' },
		};
	}

	if (attribute === 'transform-target') {
		return {
			property: 'transform_target',
			value: TRANSFORM_TARGET,
			expectedKey: attribute,
			expectedValue: TRANSFORM_TARGET,
			expectedSidebar: { tabIndex: 1, accordion: 'transform' },
		};
	}

	if (attribute === 'transition') {
		const expectedTransition = {
			...TRANSITION_BASE,
			canvas: {
				...TRANSITION_BASE.canvas,
				border: {
					...TRANSITION_BASE.canvas.border,
					'transition-duration-general': TRANSITION_DURATION,
				},
			},
		};
		return {
			property: 'transition',
			value: {
				type: 'canvas',
				setting: 'border',
				attr: 'duration',
				value: TRANSITION_DURATION,
				breakpoint: 'general',
			},
			expectedKey: attribute,
			expectedValue: expectedTransition,
			expectDeepEqual: true,
			expectedSidebar: { tabIndex: 1, accordion: 'hover transition' },
			attributes: { transition: TRANSITION_BASE },
		};
	}

	if (attribute === 'transition-change-all') {
		return {
			property: 'transition_change_all',
			value: true,
			expectedKey: attribute,
			expectedValue: true,
			expectedSidebar: { tabIndex: 1, accordion: 'hover transition' },
		};
	}

	if (attribute === 'transition-canvas-selected') {
		return {
			property: 'transition_canvas_selected',
			value: 'border',
			expectedKey: attribute,
			expectedValue: 'border',
			expectedSidebar: { tabIndex: 1, accordion: 'hover transition' },
		};
	}

	if (attribute === 'transition-transform-selected') {
		return {
			property: 'transition_transform_selected',
			value: 'container',
			expectedKey: attribute,
			expectedValue: 'container',
			expectedSidebar: { tabIndex: 1, accordion: 'hover transition' },
		};
	}

	return null;
};

describe('container T attributes', () => {
	test('T-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Scale container to 110%',
				property: 'transform_scale',
				value: { x: 110, y: 110 },
			},
			{
				phrase: 'On hover, scale container to 105%',
				property: 'transform_scale_hover',
				assert: action => action.value?.state === 'hover',
			},
			{
				phrase: 'Rotate container to 15deg',
				property: 'transform_rotate',
				value: { z: 15 },
			},
			{
				phrase: 'Move container right 20px',
				property: 'transform_translate',
				assert: action => action.value?.x === 20 && action.value?.unit === 'px',
			},
			{
				phrase: 'Set transform origin to top left',
				property: 'transform_origin',
				value: { x: 'left', y: 'top' },
			},
			{
				phrase: 'Set transform target to background',
				property: 'transform_target',
				value: 'background',
			},
			{
				phrase: 'Set transition duration to 0.5s',
				property: 'transition',
				assert: action => action.value?.attr === 'duration',
			},
			{
				phrase: 'Set transition easing to ease-in-out',
				property: 'transition',
				assert: action => action.value?.attr === 'easing' && action.value?.value === 'ease-in-out',
			},
			{
				phrase: 'Select border transition',
				property: 'transition_canvas_selected',
				value: 'border',
			},
			{
				phrase: 'Set transform transition target to container',
				property: 'transition_transform_selected',
				value: 'container',
			},
			{
				phrase: 'Change all transitions',
				property: 'transition_change_all',
				value: true,
			},
		];

		samples.forEach(sample => {
			const action = buildContainerTGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			} else if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
		});
	});

	test('each T attribute can be updated via T-group mapping', () => {
		const missing = [];

		tAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerTGroupAttributeChanges(
				config.property,
				config.value,
				{ attributes: config.attributes }
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			if (config.expectDeepEqual) {
				expect(changes[config.expectedKey]).toEqual(config.expectedValue);
			} else {
				expect(changes[config.expectedKey]).toBe(config.expectedValue);
			}
		});

		expect(missing).toEqual([]);
	});

	test('T-group properties map to sidebar targets', () => {
		const missing = [];

		tAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerTGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
