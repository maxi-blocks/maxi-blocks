import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

import IconControl from '../index';

const mockSettingTabsControl = jest.fn(() => null);

jest.mock('@wordpress/i18n', () => ({
	__: text => text,
}));

jest.mock('@components/advanced-number-control', () => () => null);
jest.mock('@components/axis-control', () => () => null);
jest.mock('@components/axis-position-control', () => () => null);
jest.mock('@components/border-control', () => () => null);
jest.mock('@components/color-control', () => () => null);
jest.mock('@components/gradient-control', () => () => null);
jest.mock('@components/icon', () => () => null);
jest.mock('@components/info-box', () => () => null);
jest.mock('@components/svg-stroke-width-control', () => () => null);
jest.mock('@components/svg-width-control', () => () => null);
jest.mock('@components/toggle-switch', () => () => null);
jest.mock('@editor/library/modal', () => () => null);
jest.mock('@extensions/maxi-block/withRTC', () => Component => Component);
jest.mock('@extensions/svg', () => ({
	setSVGAriaLabel: jest.fn((ariaLabel, getIcon) => getIcon()),
	shouldSetPreserveAspectRatio: jest.fn(() => false),
	togglePreserveAspectRatio: jest.fn(icon => icon),
}));
jest.mock('@editor/library/util', () => ({
	svgAttributesReplacer: jest.fn(icon => icon),
}));

jest.mock('@components/setting-tabs-control', () => props =>
	mockSettingTabsControl(props)
);

jest.mock('@extensions/styles', () => ({
	getAttributeKey: (target, isHover, prefix = '', breakpoint = 'general') =>
		`${prefix}${target}-${breakpoint}${isHover ? '-hover' : ''}`,
	getAttributeValue: jest.fn(() => ''),
	getDefaultAttribute: jest.fn(() => ''),
	getGroupAttributes: props => props,
	getLastBreakpointAttribute: ({
		target,
		breakpoint = 'general',
		attributes,
		isHover = false,
	}) => attributes?.[`${target}-${breakpoint}${isHover ? '-hover' : ''}`],
}));

describe('IconControl', () => {
	let container;
	let root;

	const defaultProps = {
		breakpoint: 'general',
		getIconWithColor: jest.fn(() => '<svg />'),
		onChange: jest.fn(),
		svgType: 'Shape',
		'icon-content': '<svg />',
		'icon-inherit': false,
		'icon-only': true,
	};

	const getBackgroundTabsProps = () =>
		mockSettingTabsControl.mock.calls
			.map(([props]) => props)
			.filter(
				props =>
					props.items
						?.map(item => item?.label || item?.value)
						.filter(Boolean)
						.join('|') === 'None|Solid|Gradient'
			)
			.pop();

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		document.body.removeChild(container);
		jest.clearAllMocks();
	});

	it('syncs the background selector when preset attributes change', () => {
		act(() => {
			root.render(
				<IconControl
					{...defaultProps}
					// Starts from the default "None" icon background state.
					icon-background-active-media-general='none'
				/>
			);
		});

		expect(getBackgroundTabsProps().selected).toBe('none');

		act(() => {
			root.render(
				<IconControl
					{...defaultProps}
					// Button quick-style presets can switch this to a fill.
					icon-background-active-media-general='color'
				/>
			);
		});

		expect(getBackgroundTabsProps().selected).toBe('color');
	});
});
