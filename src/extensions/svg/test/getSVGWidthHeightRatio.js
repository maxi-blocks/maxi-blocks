import getSVGWidthHeightRatio from '@extensions/svg/getSVGWidthHeightRatio';

describe('getSVGWidthHeightRatio', () => {
	it('Returns 1 when no SVG is provided', () => {
		expect(getSVGWidthHeightRatio(null)).toBe(1);
		expect(getSVGWidthHeightRatio(undefined)).toBe(1);
	});

	it('Returns 1 when input is not an SVG element', () => {
		const divElement = document.createElement('div');
		expect(getSVGWidthHeightRatio(divElement)).toBe(1);
	});

	it('Calculates correct ratio for SVG with width and height', () => {
		const svg = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		const mockBBox = { width: 200, height: 100 };
		svg.getBBox = jest.fn().mockReturnValue(mockBBox);

		expect(getSVGWidthHeightRatio(svg)).toBe(2);
		expect(svg.getBBox).toHaveBeenCalled();
	});

	it('Returns 1 when height is 0', () => {
		const svg = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		const mockBBox = { width: 100, height: 0 };
		svg.getBBox = jest.fn().mockReturnValue(mockBBox);

		expect(getSVGWidthHeightRatio(svg)).toBe(1);
	});

	it('Rounds ratio to 2 decimal places', () => {
		const svg = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		const mockBBox = { width: 100, height: 33 };
		svg.getBBox = jest.fn().mockReturnValue(mockBBox);

		expect(getSVGWidthHeightRatio(svg)).toBe(3.03);
	});

	it('Calculates ratio from fallback SVG markup when no rendered SVG is available', () => {
		const originalGetBBox = window.SVGElement.prototype.getBBox;
		window.SVGElement.prototype.getBBox = jest
			.fn()
			.mockReturnValue({ width: 36, height: 9 });

		try {
			expect(
				getSVGWidthHeightRatio(
					null,
					'<svg viewBox="0 0 36 36"><path d="M0 13h36v9H0z" /></svg>'
				)
			).toBe(4);
		} finally {
			if (originalGetBBox) {
				window.SVGElement.prototype.getBBox = originalGetBBox;
			} else {
				delete window.SVGElement.prototype.getBBox;
			}
		}
	});
});
