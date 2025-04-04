import getUpdatedBGLayersWithNewUniqueID from '@extensions/attributes/getUpdatedBGLayersWithNewUniqueID';
import getUpdatedSVGDataAndElement from '@extensions/attributes/getUpdatedSVGDataAndElement';

jest.mock('@extensions/attributes/getUpdatedSVGDataAndElement', () =>
	jest.fn()
);

describe('getUpdatedBGLayersWithNewUniqueID', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should return original layers if empty', () => {
		const emptyLayers = [];
		const result = getUpdatedBGLayersWithNewUniqueID(emptyLayers, 'new-id');
		expect(result).toBe(emptyLayers);
	});

	it('Should return null if no SVG layers need updating', () => {
		const layers = [
			{
				'background-color': '#000000',
			},
			{
				'background-image': 'url(image.jpg)',
			},
		];

		const result = getUpdatedBGLayersWithNewUniqueID(layers, 'new-id');
		expect(result).toBeNull();
		expect(getUpdatedSVGDataAndElement).not.toHaveBeenCalled();
	});

	it('Should update layers with SVG data', () => {
		getUpdatedSVGDataAndElement.mockReturnValue({
			SVGData: { 'new-id__1': { prop: 'value' } },
			SVGElement: '<svg>Updated</svg>',
		});

		const layers = [
			{
				'background-svg-SVGData': { 'old-id__1': { prop: 'value' } },
				'background-svg-SVGElement': '<svg>Original</svg>',
			},
			{
				'background-color': '#000000',
			},
		];

		const result = getUpdatedBGLayersWithNewUniqueID(layers, 'new-id');

		expect(result).toEqual([
			{
				'background-svg-SVGData': { 'new-id__1': { prop: 'value' } },
				'background-svg-SVGElement': '<svg>Updated</svg>',
			},
			{
				'background-color': '#000000',
			},
		]);

		expect(getUpdatedSVGDataAndElement).toHaveBeenCalledWith(
			{
				'background-svg-SVGData': { 'old-id__1': { prop: 'value' } },
				'background-svg-SVGElement': '<svg>Original</svg>',
			},
			'new-id',
			'background-svg-'
		);
	});

	it('Should update multiple SVG layers', () => {
		getUpdatedSVGDataAndElement
			.mockReturnValueOnce({
				SVGData: { 'new-id__1': { prop: 'value1' } },
				SVGElement: '<svg>Updated1</svg>',
			})
			.mockReturnValueOnce({
				SVGData: { 'new-id__2': { prop: 'value2' } },
				SVGElement: '<svg>Updated2</svg>',
			});

		const layers = [
			{
				'background-svg-SVGData': { 'old-id__1': { prop: 'value1' } },
				'background-svg-SVGElement': '<svg>Original1</svg>',
			},
			{
				'background-color': '#000000',
			},
			{
				'background-svg-SVGData': { 'old-id__2': { prop: 'value2' } },
				'background-svg-SVGElement': '<svg>Original2</svg>',
			},
		];

		const result = getUpdatedBGLayersWithNewUniqueID(layers, 'new-id');

		expect(result).toEqual([
			{
				'background-svg-SVGData': { 'new-id__1': { prop: 'value1' } },
				'background-svg-SVGElement': '<svg>Updated1</svg>',
			},
			{
				'background-color': '#000000',
			},
			{
				'background-svg-SVGData': { 'new-id__2': { prop: 'value2' } },
				'background-svg-SVGElement': '<svg>Updated2</svg>',
			},
		]);

		expect(getUpdatedSVGDataAndElement).toHaveBeenCalledTimes(2);
	});

	it('Should handle empty SVG data', () => {
		getUpdatedSVGDataAndElement.mockReturnValue({
			SVGData: {},
			SVGElement: '',
		});

		const layers = [
			{
				'background-svg-SVGData': {},
				'background-svg-SVGElement': '',
			},
		];

		const result = getUpdatedBGLayersWithNewUniqueID(layers, 'new-id');

		expect(result).toEqual([
			{
				'background-svg-SVGData': {},
				'background-svg-SVGElement': '',
			},
		]);

		expect(getUpdatedSVGDataAndElement).toHaveBeenCalledWith(
			{
				'background-svg-SVGData': {},
				'background-svg-SVGElement': '',
			},
			'new-id',
			'background-svg-'
		);
	});

	it('Should handle partial SVG data', () => {
		getUpdatedSVGDataAndElement.mockReturnValue({
			SVGData: { 'new-id__1': { prop: 'value' } },
			SVGElement: '<svg>Updated</svg>',
		});

		const layers = [
			{
				'background-svg-SVGData': { 'old-id__1': { prop: 'value' } },
				// Missing SVGElement
			},
		];

		const result = getUpdatedBGLayersWithNewUniqueID(layers, 'new-id');

		expect(result).toEqual([
			{
				'background-svg-SVGData': { 'new-id__1': { prop: 'value' } },
				'background-svg-SVGElement': '<svg>Updated</svg>',
			},
		]);

		expect(getUpdatedSVGDataAndElement).toHaveBeenCalledWith(
			{
				'background-svg-SVGData': { 'old-id__1': { prop: 'value' } },
			},
			'new-id',
			'background-svg-'
		);
	});
});
