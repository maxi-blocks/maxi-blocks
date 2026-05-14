/**
 * Internal dependencies
 */
import getIconPathStyles from '@extensions/styles/helpers/getIconPathStyles';

describe('getIconPathStyles', () => {
	it('should return basic structure when no icon-stroke values are present', () => {
		const result = getIconPathStyles({});
		expect(result).toEqual({
			iconPath: {
				label: 'Icon path',
				general: {},
			},
		});
	});

	it('should handle icon-stroke for general breakpoint', () => {
		const obj = {
			'icon-stroke-general': '2',
		};

		const result = getIconPathStyles(obj);
		expect(result).toEqual({
			iconPath: {
				label: 'Icon path',
				general: { 'stroke-width': '2' },
			},
		});
	});

	it('should handle icon-stroke for multiple breakpoints', () => {
		const obj = {
			'icon-stroke-general': '2',
			'icon-stroke-m': '3',
			'icon-stroke-xs': '1',
		};

		const result = getIconPathStyles(obj);
		expect(result).toEqual({
			iconPath: {
				label: 'Icon path',
				general: { 'stroke-width': '2' },
				m: { 'stroke-width': '3' },
				xs: { 'stroke-width': '1' },
			},
		});
	});

	it('should handle hover state with prefix', () => {
		const obj = {
			'icon-stroke-general-hover': '4',
			'icon-stroke-m-hover': '5',
		};

		const result = getIconPathStyles(obj, true);
		expect(result).toEqual({
			iconPath: {
				label: 'Icon path',
				general: { 'stroke-width': '4' },
				m: { 'stroke-width': '5' },
			},
		});
	});

	it('should handle custom prefix', () => {
		const obj = {
			'custom-icon-stroke-general': '2',
			'custom-icon-stroke-xl': '3',
		};

		const result = getIconPathStyles(obj, false, 'custom-');
		expect(result).toEqual({
			iconPath: {
				label: 'Icon path',
				general: { 'stroke-width': '2' },
				xl: { 'stroke-width': '3' },
			},
		});
	});

	it('should not include empty breakpoint objects', () => {
		const obj = {
			'icon-stroke-general': '2',
			'icon-stroke-xl': undefined,
			'icon-stroke-m': null,
		};

		const result = getIconPathStyles(obj);
		expect(result).toEqual({
			iconPath: {
				label: 'Icon path',
				general: { 'stroke-width': '2' },
			},
		});
	});
});
