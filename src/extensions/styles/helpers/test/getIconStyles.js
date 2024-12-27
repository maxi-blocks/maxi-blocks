/**
 * Internal dependencies
 */
import getIconStyles from '../getIconStyles';

// Mock dependencies
jest.mock('src/extensions/styles/getColorRGBAString', () => {
	return jest.fn(({ firstVar, opacity }) => {
		if (firstVar && opacity) return `rgba(${firstVar},${opacity})`;
		if (firstVar) return `rgb(${firstVar})`;
		return null;
	});
});

jest.mock('src/extensions/styles/getPaletteAttributes', () => {
	return jest.fn(({ obj, prefix, palette, isHover }) => {
		if (!obj) return {};

		const isHoverString = isHover ? '-hover' : '';

		const color = obj[`${prefix}color${isHoverString}`];
		const paletteStatus = obj[`${prefix}palette-status${isHoverString}`];
		const paletteColor = obj[`${prefix}palette-color${isHoverString}`];
		const paletteOpacity = obj[`${prefix}palette-opacity${isHoverString}`];

		return {
			color,
			paletteStatus,
			paletteColor,
			paletteOpacity,
		};
	});
});

describe('getIconStyles', () => {
	it('should return basic response when icon inherits and typography-status-hover is false', () => {
		const result = getIconStyles({}, 'light', true);
		expect(result).toEqual({
			label: 'Icon',
			general: {},
		});
	});

	it('should handle direct color for shape icons', () => {
		const obj = {
			'typography-status-hover': true,
			color: '#FF0000',
		};

		const result = getIconStyles(obj, 'light', true, false, '', 'shape');
		expect(result.general.stroke).toBe('#FF0000');
	});

	it('should handle palette colors for shape icons', () => {
		const obj = {
			'typography-status-hover': true,
			'palette-status': true,
			'palette-color': 'primary',
			'palette-opacity': '0.5',
		};

		const result = getIconStyles(obj, 'light', true, false, '', 'shape');
		expect(result.general.stroke).toBe('rgba(color-primary,0.5)');
	});

	it('should not set stroke for non-shape icons', () => {
		const obj = {
			'typography-status-hover': true,
			color: '#FF0000',
		};

		const result = getIconStyles(obj, 'light', true, false, '', '');
		expect(result.general.stroke).toBeUndefined();
	});

	it('should handle hover state', () => {
		const obj = {
			'typography-status-hover': true,
			'palette-status-hover': true,
			'palette-color-hover': 'accent',
			'palette-opacity-hover': '0.7',
		};

		const result = getIconStyles(obj, 'dark', true, true, '', 'shape');
		expect(result.general.stroke).toBe('rgba(color-accent,0.7)');
	});
});
