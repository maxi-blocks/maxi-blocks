jest.mock(
	'@components/background-control/utils',
	() => ({
		getDefaultLayerWithBreakpoint: (_label, _breakpoint, isHover = false) => ({
			display: 'block',
			isHover,
		}),
		getLayerLabel: type => {
			switch (type) {
				case 'color':
					return 'colorOptions';
				case 'image':
					return 'imageOptions';
				case 'video':
					return 'videoOptions';
				case 'gradient':
					return 'gradientOptions';
				case 'shape':
					return 'SVGOptions';
				default:
					return false;
			}
		},
	}),
	{ virtual: true }
);

import {
	buildTextCGroupAction,
	buildTextCGroupAttributeChanges,
	getTextCGroupSidebarTarget,
} from '../ai/utils/textGroup';
import {
	buildButtonCGroupAction,
	buildButtonCGroupAttributeChanges,
	getButtonCGroupSidebarTarget,
} from '../ai/utils/buttonGroups';

const SHARED_SAMPLES = [
	{
		phrase: 'Underline the text',
		property: 'text_decoration',
		expectedKey: 'text-decoration-general',
		expectedValue: 'underline',
	},
	{
		phrase: 'On hover, remove text decoration',
		property: 'text_decoration_hover',
		expectedKey: 'text-decoration-general-hover',
		expectedValue: 'none',
		expectHoverStatus: true,
	},
	{
		phrase: 'Set text direction to rtl',
		property: 'text_direction',
		expectedKey: 'text-direction-general',
		expectedValue: 'rtl',
	},
	{
		phrase: 'On mobile, set text direction to ltr',
		property: 'text_direction',
		expectedKey: 'text-direction-xs',
		expectedValue: 'ltr',
		expectedActionValue: { value: 'ltr', breakpoint: 'xs' },
	},
	{
		phrase: 'Indent text by 24px',
		property: 'text_indent',
		expectedKey: 'text-indent-general',
		expectedValue: 24,
		expectedUnitKey: 'text-indent-unit-general',
		expectedUnitValue: 'px',
	},
	{
		phrase: 'On hover, indent text by 2em',
		property: 'text_indent_hover',
		expectedKey: 'text-indent-general-hover',
		expectedValue: 2,
		expectedUnitKey: 'text-indent-unit-general-hover',
		expectedUnitValue: 'em',
		expectHoverStatus: true,
	},
	{
		phrase: 'Set text orientation to upright',
		property: 'text_orientation',
		expectedKey: 'text-orientation-general',
		expectedValue: 'upright',
	},
	{
		phrase: 'Set text wrap to nowrap',
		property: 'text_wrap',
		expectedKey: 'text-wrap-general',
		expectedValue: 'nowrap',
	},
	{
		phrase: 'Add text shadow 2px 4px 6px #000000',
		property: 'text_shadow',
		expectedKey: 'text-shadow-general',
		expectedValue: '2px 4px 6px #000000',
	},
	{
		phrase: 'Set vertical align to middle',
		property: 'text_vertical_align',
		expectedKey: 'vertical-align-general',
		expectedValue: 'middle',
	},
	{
		phrase: 'On hover, set vertical align to super',
		property: 'text_vertical_align_hover',
		expectedKey: 'vertical-align-general-hover',
		expectedValue: 'super',
		expectHoverStatus: true,
	},
	{
		phrase: 'Set white space to nowrap',
		property: 'text_white_space',
		expectedKey: 'white-space-general',
		expectedValue: 'nowrap',
	},
	{
		phrase: 'On hover, set white space to pre-wrap',
		property: 'text_white_space_hover',
		expectedKey: 'white-space-general-hover',
		expectedValue: 'pre-wrap',
		expectHoverStatus: true,
	},
	{
		phrase: 'Set word spacing to 0.2em',
		property: 'text_word_spacing',
		expectedKey: 'word-spacing-general',
		expectedValue: 0.2,
		expectedUnitKey: 'word-spacing-unit-general',
		expectedUnitValue: 'em',
	},
	{
		phrase: 'On hover, set word spacing to 0.3em',
		property: 'text_word_spacing_hover',
		expectedKey: 'word-spacing-general-hover',
		expectedValue: 0.3,
		expectedUnitKey: 'word-spacing-unit-general-hover',
		expectedUnitValue: 'em',
		expectHoverStatus: true,
	},
];

const runSuite = ({ label, buildAction, buildChanges, getSidebar }) => {
	describe(label, () => {
		test('shared text style prompts update attributes and open sidebar', () => {
			SHARED_SAMPLES.forEach(sample => {
				const action = buildAction(sample.phrase);
				expect(action).toBeTruthy();
				expect(action.property).toBe(sample.property);
				if (sample.expectedActionValue) {
					expect(action.value).toEqual(sample.expectedActionValue);
				}

				const changes = buildChanges(action.property, action.value, {
					attributes: {},
				});
				expect(changes).toBeTruthy();
				expect(changes[sample.expectedKey]).toBe(sample.expectedValue);

				if (sample.expectedUnitKey) {
					expect(changes[sample.expectedUnitKey]).toBe(
						sample.expectedUnitValue
					);
				}

				if (sample.expectHoverStatus) {
					expect(changes['typography-status-hover']).toBe(true);
				}

				const sidebar = getSidebar(action.property);
				expect(sidebar).toEqual({ tabIndex: 0, accordion: 'typography' });
			});
		});
	});
};

runSuite({
	label: 'shared text styles (text)',
	buildAction: buildTextCGroupAction,
	buildChanges: buildTextCGroupAttributeChanges,
	getSidebar: getTextCGroupSidebarTarget,
});

runSuite({
	label: 'shared text styles (button)',
	buildAction: buildButtonCGroupAction,
	buildChanges: buildButtonCGroupAttributeChanges,
	getSidebar: getButtonCGroupSidebarTarget,
});
