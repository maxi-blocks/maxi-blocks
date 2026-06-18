import React from 'react';
import { TextDecoder, TextEncoder } from 'util';

import DimensionTab from '../index';
import { getLastBreakpointAttribute } from '@extensions/styles';

const mockAdvancedNumberControl = jest.fn(() => null);
const mockImageCropControl = jest.fn(() => null);
const mockSelectControl = jest.fn(() => null);
const mockToggleSwitch = jest.fn(() => null);

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
const { renderToStaticMarkup } = require('react-dom/server');

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn(text => text),
}));

jest.mock('@wordpress/components', () => ({
	RangeControl: () => null,
}));

jest.mock('@components/advanced-number-control', () => props =>
	mockAdvancedNumberControl(props)
);
jest.mock('@components/aspect-ratio-control', () => () => null);
jest.mock('@components/image-crop-control', () => props =>
	mockImageCropControl(props)
);
jest.mock('@components/select-control', () => props => mockSelectControl(props));
jest.mock('@components/toggle-switch', () => props => mockToggleSwitch(props));

jest.mock('@extensions/styles', () => ({
	getDefaultAttribute: jest.fn(target => {
		if (target.includes('img-width')) return 100;
		if (target.includes('object-position')) return 50;
		return undefined;
	}),
	getLastBreakpointAttribute: jest.fn(({ attributes, target, breakpoint }) =>
		attributes[`${target}-${breakpoint}`] ??
		attributes[`${target}-general`]
	),
}));

const getProps = () => ({
	attributes: {
		cropOptions: null,
		fitParentSize: false,
		imageSize: 'full',
		mediaURL: 'full.jpg',
		mediaWidth: 900,
		mediaHeight: 600,
		imageRatio: 'original',
		imageRatioCustom: '1',
		isFirstOnHierarchy: false,
		isImageUrl: false,
		mediaID: 10,
		SVGElement: '',
		useInitSize: false,
		'imageSize-l': 'medium',
		'mediaURL-l': 'medium.jpg',
		'mediaWidth-l': 300,
		'mediaHeight-l': 200,
		'cropOptions-l': {
			image: {
				source_url: 'medium-crop.jpg',
				width: 250,
				height: 150,
			},
		},
		'img-width-general': 90,
		'img-width-l': 49,
		'object-position-horizontal-general': 50,
		'object-position-horizontal-l': 35,
		'object-position-vertical-general': 50,
		'object-position-vertical-l': 40,
	},
	breakpoint: 'l',
	clientId: 'client-id',
	deviceType: 'general',
	imageData: null,
	maxiSetAttributes: jest.fn(),
	resizableObject: {
		updateSize: jest.fn(),
	},
});

const imageData = {
	media_details: {
		sizes: {
			full: {
				source_url: 'full.jpg',
				width: 900,
				height: 600,
			},
			large: {
				source_url: 'large.jpg',
				width: 640,
				height: 480,
			},
			medium: {
				source_url: 'medium.jpg',
				width: 300,
				height: 200,
			},
		},
	},
};

const getControlByClassName = className =>
	mockAdvancedNumberControl.mock.calls
		.map(([props]) => props)
		.find(props => props.className === className);

describe('Image Maxi DimensionTab responsive controls', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('uses the responsive tab breakpoint for image width and position fields', () => {
		const props = getProps();

		renderToStaticMarkup(React.createElement(DimensionTab, props));

		const widthControl = getControlByClassName(
			'maxi-image-inspector__dimension-width'
		);
		const horizontalPositionControl = getControlByClassName(
			'maxi-image-inspector__image-horizontal-position'
		);

		expect(widthControl.value).toBe(49);
		expect(horizontalPositionControl.value).toBe(35);
		expect(getLastBreakpointAttribute).toHaveBeenCalledWith(
			expect.objectContaining({
				target: 'img-width',
				breakpoint: 'l',
			})
		);

		widthControl.onChangeValue(64);
		expect(props.maxiSetAttributes).toHaveBeenCalledWith({
			'img-width-l': 64,
		});
		expect(props.resizableObject.updateSize).toHaveBeenCalledWith({
			width: '64%',
		});

		horizontalPositionControl.onChangeValue(45, {
			source: 'test',
		});
		expect(props.maxiSetAttributes).toHaveBeenCalledWith({
			'object-position-horizontal-l': 45,
			meta: {
				source: 'test',
			},
		});
	});

	it('uses the responsive tab breakpoint for image size media fields', () => {
		const props = {
			...getProps(),
			imageData,
		};

		renderToStaticMarkup(React.createElement(DimensionTab, props));

		const [selectControlProps] = mockSelectControl.mock.calls[0];

		expect(selectControlProps.value).toBe('medium');

		selectControlProps.onChange('large');

		expect(props.maxiSetAttributes).toHaveBeenCalledWith({
			'imageSize-l': 'large',
			'mediaURL-l': 'large.jpg',
			'mediaWidth-l': 640,
			'mediaHeight-l': 480,
		});
	});

	it('stores custom crop state on the active responsive breakpoint', () => {
		const props = {
			...getProps(),
			attributes: {
				...getProps().attributes,
				'imageSize-l': 'custom',
			},
			imageData,
		};
		const cropOptions = {
			image: {
				source_url: 'large-custom.jpg',
				width: 420,
				height: 260,
			},
		};

		renderToStaticMarkup(React.createElement(DimensionTab, props));

		const [imageCropControlProps] = mockImageCropControl.mock.calls[0];

		expect(imageCropControlProps.cropOptions).toEqual({
			image: {
				source_url: 'medium-crop.jpg',
				width: 250,
				height: 150,
			},
		});

		imageCropControlProps.onChange(cropOptions);

		expect(props.maxiSetAttributes).toHaveBeenCalledWith({
			'cropOptions-l': cropOptions,
			'imageSize-l': 'custom',
			'mediaURL-l': 'large-custom.jpg',
			'mediaWidth-l': 420,
			'mediaHeight-l': 260,
		});
	});
});
