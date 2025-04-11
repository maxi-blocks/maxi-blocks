import getUpdatedSVGDataAndElement from '@extensions/attributes/getUpdatedSVGDataAndElement';
import { injectImgSVG } from '@extensions/svg';

// Mock dependencies
jest.mock('@extensions/svg', () => ({
	injectImgSVG: jest.fn(),
}));

describe('getUpdatedSVGDataAndElement', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should return empty object if SVGData or SVGElement is missing', () => {
		const attributes = {
			SVGData: null,
			SVGElement: '<svg></svg>',
		};

		const result = getUpdatedSVGDataAndElement(attributes, 'new-id');
		expect(result).toEqual({});

		const attributes2 = {
			SVGData: { 'old-id__1': {} },
			SVGElement: null,
		};

		const result2 = getUpdatedSVGDataAndElement(attributes2, 'new-id');
		expect(result2).toEqual({});
	});

	it('Should return empty object if uniqueID matches existing ID', () => {
		const attributes = {
			SVGData: { 'existing-id__1': {} },
			SVGElement: '<svg></svg>',
		};

		const result = getUpdatedSVGDataAndElement(attributes, 'existing-id');
		expect(result).toEqual({});
	});

	it('Should update SVG data and element with new uniqueID', () => {
		const mockSVGElement = document.createElement('div');
		mockSVGElement.innerHTML = '<svg>Test</svg>';
		mockSVGElement.outerHTML = '<div><svg>Test</svg></div>';

		injectImgSVG.mockReturnValue(mockSVGElement);

		const attributes = {
			SVGData: {
				'old-id__1': {
					prop1: 'value1',
					prop2: 'value2',
				},
			},
			SVGElement: '<svg>Original</svg>',
		};

		const result = getUpdatedSVGDataAndElement(attributes, 'new-id');

		expect(result).toEqual({
			SVGData: {
				'new-id__1': {
					prop1: 'value1',
					prop2: 'value2',
				},
			},
			SVGElement: '<div><svg>Test</svg></div>',
		});

		expect(injectImgSVG).toHaveBeenCalledWith(
			'<svg>Original</svg>',
			{
				'new-id__1': {
					prop1: 'value1',
					prop2: 'value2',
				},
			},
			false,
			'new-id'
		);
	});

	it('Should handle prefix correctly', () => {
		const mockSVGElement = document.createElement('div');
		mockSVGElement.innerHTML = '<svg>Test</svg>';
		mockSVGElement.outerHTML = '<div><svg>Test</svg></div>';

		injectImgSVG.mockReturnValue(mockSVGElement);

		const attributes = {
			'hover-SVGData': {
				'old-id__1': {
					prop1: 'value1',
				},
			},
			'hover-SVGElement': '<svg>Hover</svg>',
		};

		const result = getUpdatedSVGDataAndElement(
			attributes,
			'new-id',
			'hover-'
		);

		expect(result).toEqual({
			SVGData: {
				'new-id__1': {
					prop1: 'value1',
				},
			},
			SVGElement: '<div><svg>Test</svg></div>',
		});

		expect(injectImgSVG).toHaveBeenCalledWith(
			'<svg>Hover</svg>',
			{
				'new-id__1': {
					prop1: 'value1',
				},
			},
			false,
			'new-id'
		);
	});

	it('Should update imageURL if provided', () => {
		const mockSVGElement = document.createElement('div');
		mockSVGElement.innerHTML = '<svg>Test</svg>';
		mockSVGElement.outerHTML = '<div><svg>Test</svg></div>';

		injectImgSVG.mockReturnValue(mockSVGElement);

		const attributes = {
			SVGData: {
				'old-id__1': {
					prop1: 'value1',
					imageURL: 'old-url.jpg',
				},
			},
			SVGElement: '<svg>Original</svg>',
		};

		const result = getUpdatedSVGDataAndElement(
			attributes,
			'new-id',
			'',
			'new-url.jpg'
		);

		expect(result).toEqual({
			SVGData: {
				'new-id__1': {
					prop1: 'value1',
					imageURL: 'new-url.jpg',
				},
			},
			SVGElement: '<div><svg>Test</svg></div>',
		});

		expect(injectImgSVG).toHaveBeenCalledWith(
			'<svg>Original</svg>',
			{
				'new-id__1': {
					prop1: 'value1',
					imageURL: 'new-url.jpg',
				},
			},
			false,
			'new-id'
		);
	});
});
