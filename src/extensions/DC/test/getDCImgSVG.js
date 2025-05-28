/**
 * Internal dependencies
 */
import getDCImgSVG from '@extensions/DC/getDCImgSVG';
import { injectImgSVG } from '@extensions/svg';

/**
 * External dependencies
 */
import DOMPurify from 'dompurify';

jest.mock('@extensions/svg', () => ({
	injectImgSVG: jest.fn(),
}));

jest.mock('dompurify', () => ({
	sanitize: jest.fn(),
}));

describe('getDCImgSVG', () => {
	let documentCreateRangeMock;
	let rangeCreateContextualFragmentMock;
	let firstElementChildMock;
	let createRangeSpy;

	beforeEach(() => {
		jest.clearAllMocks();

		firstElementChildMock = {
			outerHTML: '<svg>mocked svg content</svg>',
		};

		rangeCreateContextualFragmentMock = {
			firstElementChild: firstElementChildMock,
		};

		documentCreateRangeMock = {
			createContextualFragment: jest
				.fn()
				.mockReturnValue(rangeCreateContextualFragmentMock),
		};

		createRangeSpy = jest
			.spyOn(document, 'createRange')
			.mockReturnValue(documentCreateRangeMock);

		injectImgSVG.mockReturnValue({
			outerHTML: '<svg>processed svg content</svg>',
		});

		DOMPurify.sanitize.mockImplementation(content => content);
	});

	afterEach(() => {
		createRangeSpy.mockRestore();
	});

	it('should return processed SVG content for valid input', () => {
		const uniqueID = 'test-id';
		const SVGData = {
			'test-key': {
				imageID: 123,
				imageURL: 'https://example.com/image.jpg',
			},
		};
		const SVGElement = '<svg><path d="M0 0h100v100H0z" /></svg>';

		const result = getDCImgSVG(uniqueID, SVGData, SVGElement);

		expect(DOMPurify.sanitize).toHaveBeenCalledWith(SVGElement);
		expect(document.createRange).toHaveBeenCalled();
		expect(
			documentCreateRangeMock.createContextualFragment
		).toHaveBeenCalledWith(SVGElement);
		expect(injectImgSVG).toHaveBeenCalledWith(
			firstElementChildMock,
			expect.objectContaining({
				'test-key': expect.objectContaining({
					imageID: '$media-id-to-replace',
					imageURL: '$media-url-to-replace',
				}),
			}),
			false,
			uniqueID
		);
		expect(result).toBe('<svg>processed svg content</svg>');
	});

	it('should handle empty SVGData object', () => {
		const uniqueID = 'test-id';
		const SVGData = {};
		const SVGElement = '<svg><path d="M0 0h100v100H0z" /></svg>';

		const result = getDCImgSVG(uniqueID, SVGData, SVGElement);

		expect(injectImgSVG).toHaveBeenCalledWith(
			firstElementChildMock,
			{}, // Empty object should be passed as is
			false,
			uniqueID
		);
		expect(result).toBe('<svg>processed svg content</svg>');
	});

	it('should properly prepare SVGData by replacing media values with placeholders', () => {
		const uniqueID = 'test-id';
		const SVGData = {
			'layer-1': {
				imageID: 123,
				imageURL: 'https://example.com/image1.jpg',
				color: '#ff0000',
			},
			'layer-2': {
				imageID: 456,
				imageURL: 'https://example.com/image2.jpg',
				color: '#00ff00',
			},
		};
		const SVGElement = '<svg><path d="M0 0h100v100H0z" /></svg>';

		getDCImgSVG(uniqueID, SVGData, SVGElement);

		// Verify the SVGData was properly prepared by replacing media values
		expect(injectImgSVG).toHaveBeenCalledWith(
			firstElementChildMock,
			{
				'layer-1': {
					imageID: '$media-id-to-replace',
					imageURL: '$media-url-to-replace',
					color: '#ff0000',
				},
				'layer-2': {
					imageID: '$media-id-to-replace',
					imageURL: '$media-url-to-replace',
					color: '#00ff00',
				},
			},
			false,
			uniqueID
		);
	});

	it('should sanitize SVG content using DOMPurify', () => {
		const uniqueID = 'test-id';
		const SVGData = {
			'test-key': {
				imageID: 123,
				imageURL: 'https://example.com/image.jpg',
			},
		};
		const SVGElement =
			'<svg><script>alert("XSS")</script><path d="M0 0h100v100H0z" /></svg>';

		getDCImgSVG(uniqueID, SVGData, SVGElement);

		expect(DOMPurify.sanitize).toHaveBeenCalledWith(SVGElement);
	});

	it('should correctly create DOM fragments and access firstElementChild', () => {
		const uniqueID = 'test-id';
		const SVGData = {
			'test-key': {
				imageID: 123,
				imageURL: 'https://example.com/image.jpg',
			},
		};
		const SVGElement = '<svg><path d="M0 0h100v100H0z" /></svg>';

		getDCImgSVG(uniqueID, SVGData, SVGElement);

		expect(document.createRange).toHaveBeenCalled();
		expect(
			documentCreateRangeMock.createContextualFragment
		).toHaveBeenCalledWith(SVGElement);
		expect(injectImgSVG.mock.calls[0][0]).toBe(firstElementChildMock);
	});

	it('should return the outerHTML of the injected SVG element', () => {
		const uniqueID = 'test-id';
		const SVGData = {
			'test-key': {
				imageID: 123,
				imageURL: 'https://example.com/image.jpg',
			},
		};
		const SVGElement = '<svg><path d="M0 0h100v100H0z" /></svg>';

		// Set a custom outerHTML value for the injected SVG
		injectImgSVG.mockReturnValueOnce({
			outerHTML: '<svg class="modified">processed svg content</svg>',
		});

		const result = getDCImgSVG(uniqueID, SVGData, SVGElement);

		expect(result).toBe(
			'<svg class="modified">processed svg content</svg>'
		);
	});

	it('should handle different SVG content structures', () => {
		const uniqueID = 'test-id';
		const SVGData = {
			'test-key': {
				imageID: 123,
				imageURL: 'https://example.com/image.jpg',
			},
		};
		const complexSVGElement = `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
				<rect x="10" y="10" width="80" height="80" fill="blue" opacity="0.5" />
			</svg>
		`;

		getDCImgSVG(uniqueID, SVGData, complexSVGElement);

		expect(DOMPurify.sanitize).toHaveBeenCalledWith(complexSVGElement);
		expect(
			documentCreateRangeMock.createContextualFragment
		).toHaveBeenCalledWith(complexSVGElement);
	});

	it('should handle errors in the DOM manipulation process', () => {
		// Simulate an error in document.createRange by restoring the original spy
		// and creating a new one that throws an error
		createRangeSpy.mockRestore();
		createRangeSpy = jest
			.spyOn(document, 'createRange')
			.mockImplementation(() => {
				throw new Error('DOM manipulation error');
			});

		const uniqueID = 'test-id';
		const SVGData = {
			'test-key': {
				imageID: 123,
				imageURL: 'https://example.com/image.jpg',
			},
		};
		const SVGElement = '<svg><path d="M0 0h100v100H0z" /></svg>';

		// The function should throw an error
		expect(() => {
			getDCImgSVG(uniqueID, SVGData, SVGElement);
		}).toThrow('DOM manipulation error');
	});
});
