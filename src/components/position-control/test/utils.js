import {
	getLayerPlacementAllowedUnits,
	getLayerPlacementResetValue,
	hasPlacementValue,
	normalizePlacementSync,
	shouldUseFocalPlacementControls,
} from '../utils';

describe('position-control utils', () => {
	it('normalizes legacy placement sync values', () => {
		expect(normalizePlacementSync(true)).toBe('all');
		expect(normalizePlacementSync(false)).toBe('none');
		expect(normalizePlacementSync('separate')).toBe('separate');
	});

	it('keeps empty placement values out of focal placement detection', () => {
		expect(hasPlacementValue(0)).toBe(true);
		expect(hasPlacementValue('0')).toBe(true);
		expect(hasPlacementValue('')).toBe(false);
		expect(hasPlacementValue(undefined)).toBe(false);
	});

	it('keeps layer placement units locked to percent', () => {
		expect(getLayerPlacementAllowedUnits(true)).toEqual(['%']);
		expect(getLayerPlacementAllowedUnits(false)).toEqual([
			'px',
			'em',
			'vw',
			'%',
			'-',
		]);
	});

	it('uses focal placement controls only for layer placement', () => {
		expect(shouldUseFocalPlacementControls(true)).toBe(true);
		expect(shouldUseFocalPlacementControls(false)).toBe(false);
		expect(shouldUseFocalPlacementControls(undefined)).toBe(false);
	});

	it('resets hover layer placement from the matching normal layer', () => {
		expect(
			getLayerPlacementResetValue({
				target: 'position-left',
				disablePosition: true,
				isHover: true,
				normalValue: 35,
				defaultValue: 0,
			})
		).toBe(35);
		expect(
			getLayerPlacementResetValue({
				target: 'position-right',
				disablePosition: true,
				isHover: true,
				normalValue: '',
				defaultValue: '',
			})
		).toBe('');
		expect(
			getLayerPlacementResetValue({
				target: 'position-left-unit',
				disablePosition: true,
				isHover: true,
				normalValue: '%',
				defaultValue: 'px',
			})
		).toBe('%');
		expect(
			getLayerPlacementResetValue({
				target: 'position-sync',
				disablePosition: true,
				isHover: true,
				normalValue: false,
				defaultValue: 'all',
			})
		).toBe('none');
	});

	it('falls back to layer defaults when normal reset data is unavailable', () => {
		expect(
			getLayerPlacementResetValue({
				target: 'position-top',
				disablePosition: true,
				isHover: true,
				normalValue: undefined,
				defaultValue: 0,
			})
		).toBe(0);
	});
});
