/**
 * Internal dependencies
 */
import getImgWidthStyles from '@extensions/styles/helpers/getImgWidthStyles';

jest.mock('src/extensions/styles/getAttributeKey', () => {
	return jest.fn((base, isHover, prefix, breakpoint) => {
		return `${base}${breakpoint === 'general' ? '' : `-${breakpoint}`}`;
	});
});

describe('getImgWidthStyles', () => {
	it('should return empty object when no width values are present', () => {
		const result = getImgWidthStyles({}, false, 0);
		expect(result).toEqual({
			imgWidth: {},
		});
	});

	it('should handle percentage width when useInitSize is false', () => {
		const obj = {
			'img-width': '50',
		};

		const result = getImgWidthStyles(obj, false, 800);
		expect(result).toEqual({
			imgWidth: {
				general: {
					width: '50%',
				},
			},
		});
	});

	it('should handle pixel width when useInitSize is true', () => {
		const obj = {
			'img-width': '50',
		};

		const result = getImgWidthStyles(obj, true, 800);
		expect(result).toEqual({
			imgWidth: {
				general: {
					width: '800px',
				},
			},
		});
	});

	it('should handle multiple breakpoints', () => {
		const obj = {
			'img-width': '100',
			'img-width-m': '75',
			'img-width-xs': '50',
		};

		const result = getImgWidthStyles(obj, false, 1000);
		expect(result).toEqual({
			imgWidth: {
				general: {
					width: '100%',
				},
				m: {
					width: '75%',
				},
				xs: {
					width: '50%',
				},
			},
		});
	});

	it('should handle multiple breakpoints with initial size', () => {
		const obj = {
			'img-width': '100',
			'img-width-m': '75',
			'img-width-xs': '50',
		};

		const result = getImgWidthStyles(obj, true, 1000);
		expect(result).toEqual({
			imgWidth: {
				general: {
					width: '1000px',
				},
				m: {
					width: '1000px',
				},
				xs: {
					width: '1000px',
				},
			},
		});
	});

	it('should ignore undefined or null width values', () => {
		const obj = {
			'img-width': '100',
			'img-width-m': undefined,
			'img-width-xs': null,
		};

		const result = getImgWidthStyles(obj, false, 1000);
		expect(result).toEqual({
			imgWidth: {
				general: {
					width: '100%',
				},
			},
		});
	});
});
