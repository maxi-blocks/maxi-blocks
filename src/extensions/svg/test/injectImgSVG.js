import injectImgSVG from '@extensions/svg/injectImgSVG';
import { select } from '@wordpress/data';
import getSVGPosition from '@extensions/svg/getSVGPosition';
import getSVGRatio from '@extensions/svg/getSVGRatio';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));
jest.mock('@extensions/svg/getSVGPosition', () => jest.fn());
jest.mock('@extensions/svg/getSVGRatio', () => jest.fn());

describe('injectImgSVG', () => {
	const mockBlockEditorStore = {
		getBlockAttributes: jest.fn(),
		getSelectedBlockClientId: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		select.mockReturnValue(mockBlockEditorStore);
		getSVGPosition.mockReturnValue('xMidYMid');
		getSVGRatio.mockReturnValue('meet');
	});

	it('Injects image into SVG with proper attributes', () => {
		const svg = `
            <svg viewBox="0 0 100 100">
                <path d="M10 10" />
            </svg>
        `;
		const SVGData = {
			'test-id': {
				imageURL: 'test-image.jpg',
				isImageUrlInvalid: false,
			},
		};

		const result = injectImgSVG(svg, SVGData);

		expect(result.querySelector('pattern')).toBeTruthy();
		expect(result.querySelector('image').getAttribute('href')).toBe(
			'test-image.jpg'
		);
		expect(
			result.querySelector('image').getAttribute('preserveaspectratio')
		).toBe('xMidYMid meet');
		expect(result.querySelector('path').getAttribute('fill')).toBe(
			'url(#test-id__img)'
		);
	});

	it('Removes image when removeMode is true', () => {
		const svg = `
            <svg viewBox="0 0 100 100">
                <pattern id="existing__img" class="maxi-svg-block__pattern">
                    <image href="old-image.jpg" />
                </pattern>
                <path style="fill: url(#existing__img)" />
            </svg>
        `;
		const SVGData = {
			'test-id': {
				imageURL: '',
				isImageUrlInvalid: true,
			},
		};

		const result = injectImgSVG(svg, SVGData, true);

		expect(result.querySelector('.maxi-svg-block__pattern')).toBeNull();
		expect(result.querySelector('path').getAttribute('style')).toBe(null);
	});

	it('Sets color fill when no image is provided', () => {
		const svg = `
            <svg viewBox="0 0 100 100">
                <path d="M10 10" />
            </svg>
        `;
		const SVGData = {
			'test-id': {
				color: '#ff0000',
				imageURL: '',
			},
		};

		const result = injectImgSVG(svg, SVGData);

		expect(result.querySelector('path').getAttribute('fill')).toBe(
			'#ff0000'
		);
	});

	it('Sets uniqueID dataset when provided', () => {
		// Create SVG element using createElementNS for it to have a dataset
		const svg = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		svg.setAttribute('viewBox', '0 0 100 100');
		const path = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		svg.appendChild(path);

		const blockUniqueID = 'test-block-id';

		const result = injectImgSVG(svg, {}, false, blockUniqueID);

		expect(result.dataset.item).toBe('test-block-id__svg');
	});

	it('Updates existing pattern with new image', () => {
		const svg = `
            <svg viewBox="0 0 100 100">
                <pattern id="old__img" class="maxi-svg-block__pattern">
                    <image href="old-image.jpg" />
                </pattern>
                <path />
            </svg>
        `;
		const SVGData = {
			'test-id': {
				imageURL: 'new-image.jpg',
				isImageUrlInvalid: false,
			},
		};

		const result = injectImgSVG(svg, SVGData);

		expect(result.querySelector('image').getAttribute('href')).toBe(
			'new-image.jpg'
		);
	});
});
