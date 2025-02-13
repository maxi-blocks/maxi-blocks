import getUpdatedImgSVG from '@extensions/svg/getUpdatedImgSVG';
import injectImgSVG from '@extensions/svg/injectImgSVG';

jest.mock('@extensions/svg/injectImgSVG', () => jest.fn());

describe('getUpdatedImgSVG', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Returns unchanged SVG when SVGData is empty', () => {
		const uniqueID = 'test-123';
		const SVGData = {};
		const SVGElement = '<svg></svg>';
		const media = { id: 1, url: 'test.jpg' };

		const result = getUpdatedImgSVG(uniqueID, SVGData, SVGElement, media);

		expect(result).toEqual({ SVGElement, SVGData });
	});

	it('Returns unchanged SVG when media matches existing SVGData', () => {
		const uniqueID = 'test-123';
		const SVGData = {
			'existing-key': {
				imageID: 1,
				imageURL: 'test.jpg',
			},
		};
		const SVGElement = '<svg></svg>';
		const media = { id: 1, url: 'test.jpg' };

		const result = getUpdatedImgSVG(uniqueID, SVGData, SVGElement, media);

		expect(result).toEqual({ SVGElement, SVGData });
	});

	it('Updates SVG with new media', () => {
		const uniqueID = 'test-123';
		const SVGData = {
			'existing-key': {
				imageID: 1,
				imageURL: 'old.jpg',
			},
		};
		const SVGElement = '<svg></svg>';
		const media = { id: 2, url: 'new.jpg' };

		// Mock injectImgSVG return value
		const mockInjectedSVG = document.createElement('svg');
		mockInjectedSVG.innerHTML = 'updated';
		injectImgSVG.mockReturnValue(mockInjectedSVG);

		const result = getUpdatedImgSVG(uniqueID, SVGData, SVGElement, media);

		// Verify new SVGData structure
		expect(Object.values(result.SVGData)[0]).toEqual({
			color: '',
			imageID: 2,
			imageURL: 'new.jpg',
		});

		// Verify SVGElement was updated
		expect(result.SVGElement).toBe('<svg>updated</svg>');

		// Verify injectImgSVG was called with correct parameters
		expect(injectImgSVG).toHaveBeenCalledWith(
			expect.any(Object), // SVG element
			expect.any(Object), // New SVGData
			false,
			uniqueID
		);
	});
});
