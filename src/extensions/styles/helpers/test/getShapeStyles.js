/**
 * Internal dependencies
 */
import getShapeStyles from '../getShapeStyles';

// Mock dependencies
jest.mock('src/extensions/styles/getColorRGBAString', () => {
	return jest.fn(({ firstVar, opacity, blockStyle }) => {
		if (firstVar && opacity) return `rgba(${firstVar},${opacity})`;
		if (firstVar) return `rgb(${firstVar})`;
		return null;
	});
});

jest.mock('src/extensions/styles/getPaletteAttributes', () => {
	return jest.fn(({ obj, prefix }) => {
		if (!obj) return {};

		return {
			paletteStatus: obj[`${prefix}palette-status`],
			paletteColor: obj[`${prefix}palette-color`],
			paletteOpacity: obj[`${prefix}palette-opacity`],
			color: obj[`${prefix}color`],
		};
	});
});

describe('getShapeStyles', () => {
	it('should return basic structure when no properties are present', () => {
		const result = getShapeStyles({}, 'svg');
		expect(result).toEqual({
			label: 'Shape',
			general: {},
		});
	});

	it('should handle SVG width properties', () => {
		const obj = {
			'shape-width': '100',
			'shape-width-unit': 'px',
		};

		const result = getShapeStyles(obj, 'svg');
		expect(result).toEqual({
			label: 'Shape',
			general: {
				'max-width': '100px',
				'max-height': '100px',
			},
		});
	});

	it('should not set dimensions for path target', () => {
		const obj = {
			'shape-width': '100',
			'shape-width-unit': 'px',
		};

		const result = getShapeStyles(obj, 'path');
		expect(result.general).not.toHaveProperty('max-width');
		expect(result.general).not.toHaveProperty('max-height');
	});

	it('should handle direct fill color for path', () => {
		const obj = {
			'shape-fill-color': '#FF0000',
		};

		const result = getShapeStyles(obj, 'path');
		expect(result).toEqual({
			label: 'Shape',
			general: {
				fill: '#FF0000',
			},
		});
	});

	it('should handle palette fill color for path', () => {
		const obj = {
			'shape-fill-palette-status': true,
			'shape-fill-palette-color': 'primary',
			'shape-fill-palette-opacity': '0.5',
		};

		const result = getShapeStyles(obj, 'path', 'light');
		expect(result).toEqual({
			label: 'Shape',
			general: {
				fill: 'rgba(color-primary,0.5)',
			},
		});
	});

	it('should not set fill color for SVG target', () => {
		const obj = {
			'shape-fill-color': '#FF0000',
			'shape-fill-palette-status': true,
			'shape-fill-palette-color': 'primary',
		};

		const result = getShapeStyles(obj, 'svg');
		expect(result.general).not.toHaveProperty('fill');
	});

	it('should handle both width and fill properties for respective targets', () => {
		const obj = {
			'shape-width': '100',
			'shape-width-unit': 'px',
			'shape-fill-color': '#FF0000',
		};

		const svgResult = getShapeStyles(obj, 'svg');
		expect(svgResult).toEqual({
			label: 'Shape',
			general: {
				'max-width': '100px',
				'max-height': '100px',
			},
		});

		const pathResult = getShapeStyles(obj, 'path');
		expect(pathResult).toEqual({
			label: 'Shape',
			general: {
				fill: '#FF0000',
			},
		});
	});
});
