import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

import VideoIconControl from '../index';

const mockSettingTabsControl = jest.fn(props => {
	if (!props.items) return null;

	return (
		<div>
			{props.items.map((item, index) =>
				item?.content ? <div key={index}>{item.content}</div> : null
			)}
		</div>
	);
});

jest.mock('@wordpress/i18n', () => ({
	__: text => text,
}));

jest.mock('@wordpress/element', () => {
	const React = require('react');

	return {
		...React,
	};
});

jest.mock('@components/advanced-number-control', () => () => null);
jest.mock('@components/axis-control', () => () => null);
jest.mock('@components/axis-position-control', () => () => null);
jest.mock('@components/border-control', () => () => null);
jest.mock('@components/color-control', () => () => null);
jest.mock('@components/gradient-control', () => () => null);
jest.mock('@components/icon', () => () => null);
jest.mock('@components/info-box', () => () => null);
jest.mock('@components/responsive-tabs-control', () => ({ children }) => (
	<>{children}</>
));
jest.mock('@components/select-control', () => () => null);
jest.mock('@components/svg-stroke-width-control', () => () => null);
jest.mock('@components/svg-width-control', () => () => null);
jest.mock('@components/toggle-switch', () => () => null);
jest.mock('@editor/library/modal', () => () => null);
jest.mock('@extensions/maxi-block/withRTC', () => Component => Component);
jest.mock('@editor/library/util', () => ({
	svgAttributesReplacer: jest.fn(icon => icon),
}));
jest.mock('@extensions/svg', () => ({
	setSVGAriaLabel: jest.fn((ariaLabel, getIcon) => getIcon()),
	setSVGContent: jest.fn(icon => icon),
	setSVGContentHover: jest.fn(icon => icon),
	shouldSetPreserveAspectRatio: jest.fn(() => false),
	togglePreserveAspectRatio: jest.fn(icon => icon),
}));
jest.mock('@components/setting-tabs-control', () => props =>
	mockSettingTabsControl(props)
);
jest.mock('@extensions/styles', () => ({
	getAttributeKey: (target, isHover, prefix = '', breakpoint = 'general') =>
		`${prefix}${target}-${breakpoint}${isHover ? '-hover' : ''}`,
	getAttributeValue: ({ target, props, prefix = '', isHover }) =>
		props?.[`${prefix}${target}${isHover ? '-hover' : ''}`],
	getColorRGBAString: jest.fn(() => 'rgba(0,0,0,1)'),
	getDefaultAttribute: jest.fn(() => ''),
	getGroupAttributes: props => props,
	getLastBreakpointAttribute: ({
		target,
		breakpoint = 'general',
		attributes,
		isHover = false,
	}) => attributes?.[`${target}-${breakpoint}${isHover ? '-hover' : ''}`],
}));

describe('VideoIconControl', () => {
	let container;
	let root;

	const defaultProps = {
		blockStyle: 'light',
		breakpoint: 'general',
		clientId: 'video-client',
		label: 'Play icon',
		onChange: jest.fn(),
		onChangeInline: jest.fn(),
		prefix: 'play-',
		type: 'video-icon-play',
		'play-icon-content':
			'<svg><path data-stroke="" data-fill="" /></svg>',
		'play-icon-inherit': false,
		'play-icon-only': true,
		'play-svgType': 'Filled',
	};

	const getIconStyleTabsProps = () =>
		mockSettingTabsControl.mock.calls
			.map(([props]) => props)
			.find(props => props.className === 'maxi-icon-styles-control');

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

	it('exposes both stroke and fill controls for filled video icons', () => {
		act(() => {
			root.render(<VideoIconControl {...defaultProps} />);
		});

		const styleTabs = getIconStyleTabsProps();

		expect(styleTabs).toBeDefined();
		expect(styleTabs.items.map(item => item.value)).toEqual([
			'color',
			'fill',
		]);
	});
});
