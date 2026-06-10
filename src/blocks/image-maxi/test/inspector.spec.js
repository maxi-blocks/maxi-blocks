import React from 'react';
import { TextDecoder, TextEncoder } from 'util';

import Inspector from '@blocks/image-maxi/inspector';
import { getGroupAttributes } from '@extensions/styles';

const mockAlignmentControl = jest.fn(() => null);
const mockFilterTab = jest.fn(() => null);
const mockTypographyControl = jest.fn(() => null);

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
const { renderToStaticMarkup } = require('react-dom/server');

jest.mock('@wordpress/data', () => ({
	useSelect: jest.fn(() => null),
}));

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn(text => text),
}));

jest.mock('@wordpress/block-editor', () => {
	const React = require('react');

	return {
		InspectorControls: ({ children }) =>
			React.createElement(React.Fragment, null, children),
	};
});

jest.mock('@extensions/inspector', () => ({
	withMaxiInspector: Component => Component,
}));

jest.mock('@extensions/styles', () => ({
	getDefaultAttribute: jest.fn(() => undefined),
	getGroupAttributes: jest.fn((attributes, group) => ({
		attributes,
		group,
	})),
	getLastBreakpointAttribute: jest.fn(({ attributes, target, breakpoint }) =>
		attributes[`${target}-${breakpoint}`] ?? attributes[target]
	),
}));

jest.mock('../data', () => ({
	ariaLabelsCategories: {},
	customCss: {
		categories: {},
		selectors: {},
	},
}));

jest.mock('@components/accordion-control', () => {
	const React = require('react');

	return ({ items = [] }) =>
		React.createElement(
			React.Fragment,
			null,
			items
				.filter(Boolean)
				.map((item, index) =>
					React.createElement(
						React.Fragment,
						{ key: `${item.label}-${index}` },
						item.content
					)
				)
		);
});

jest.mock('@components/setting-tabs-control', () => {
	const React = require('react');

	return ({ items = [] }) =>
		React.createElement(
			React.Fragment,
			null,
			items
				.filter(Boolean)
				.map((item, index) =>
					React.createElement(
						React.Fragment,
						{ key: `${item.label}-${index}` },
						item.content
					)
				)
		);
});

jest.mock('@components/responsive-tabs-control', () => {
	const React = require('react');

	return ({ children }) => React.createElement(React.Fragment, null, children);
});

jest.mock('@components/alignment-control', () => props =>
	mockAlignmentControl(props)
);

jest.mock('@components/typography-control', () => props =>
	mockTypographyControl(props)
);

jest.mock('@components/advanced-number-control', () => () => null);
jest.mock('@components/image-alt-control', () => () => null);
jest.mock('@components/image-shape', () => () => null);
jest.mock('@components/select-control', () => () => null);
jest.mock('@blocks/image-maxi/components/dimension-tab', () => () => null);
jest.mock('@blocks/image-maxi/components/filter-tab', () => props =>
	mockFilterTab(props)
);
jest.mock('@blocks/image-maxi/components/hover-effect-control', () => () => null);
jest.mock('@components/info-box', () => () => null);

jest.mock('@components/inspector-tabs', () => ({
	advancedCss: jest.fn(() => []),
	alignment: jest.fn(() => []),
	anchor: jest.fn(() => []),
	ariaLabel: jest.fn(() => []),
	blockBackground: jest.fn(() => []),
	blockSettings: jest.fn(() => null),
	border: jest.fn(() => []),
	boxShadow: jest.fn(() => []),
	clipPath: jest.fn(() => []),
	customClasses: jest.fn(() => []),
	customCss: jest.fn(() => []),
	dc: jest.fn(() => []),
	display: jest.fn(() => []),
	flex: jest.fn(() => []),
	marginPadding: jest.fn(() => []),
	opacity: jest.fn(() => []),
	overflow: jest.fn(() => []),
	position: jest.fn(() => []),
	relation: jest.fn(() => []),
	repeaterInfoBox: jest.fn(() => null),
	responsive: jest.fn(() => []),
	responsiveInfoBox: jest.fn(() => null),
	scrollEffects: jest.fn(() => []),
	size: jest.fn(() => []),
	transform: jest.fn(() => []),
	transition: jest.fn(() => []),
	zindex: jest.fn(() => []),
}));

const getProps = () => ({
	attributes: {
		altSelector: 'wordpress',
		blockStyle: 'light',
		captionType: 'custom',
		captionPosition: 'bottom',
		fitParentSize: false,
		mediaAlt: '',
		mediaID: null,
		SVGElement: '',
		uniqueID: 'image-caption-test',
		'dc-status': false,
		'caption-gap-general': 1,
		'caption-gap-unit-general': 'em',
		'hover-type': 'none',
		'image-full-width-general': false,
	},
	captionRichTextActive: false,
	clientId: 'client-id',
	deviceType: 'general',
	maxiSetAttributes: jest.fn(),
	setShowLoader: jest.fn(),
});

describe('Image Maxi caption inspector', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('exposes alignment and block-level typography controls for captions', () => {
		const props = getProps();

		renderToStaticMarkup(React.createElement(Inspector, props));

		expect(getGroupAttributes).toHaveBeenCalledWith(
			props.attributes,
			'textAlignment'
		);
		expect(getGroupAttributes).toHaveBeenCalledWith(props.attributes, [
			'typography',
			'textAlignment',
			'link',
		]);
		expect(mockAlignmentControl).toHaveBeenCalledWith(
			expect.objectContaining({
				breakpoint: 'general',
				className:
					'maxi-typography-control__text-alignment maxi-typography-panel__text-alignment',
				disableRTC: true,
				onChange: props.maxiSetAttributes,
				type: 'text',
			})
		);
		expect(mockTypographyControl).toHaveBeenCalledWith(
			expect.objectContaining({
				isRichTextActive: false,
				textLevel: 'p',
				useBlockLevelFallback: true,
			})
		);
	});

	it('wires the image filter tab to Image Maxi attributes', () => {
		const props = getProps();

		renderToStaticMarkup(React.createElement(Inspector, props));

		expect(mockFilterTab).toHaveBeenCalledWith(
			expect.objectContaining({
				breakpoint: 'general',
				blockStyle: 'light',
				clientId: 'client-id',
				onChange: props.maxiSetAttributes,
			})
		);
	});
});
