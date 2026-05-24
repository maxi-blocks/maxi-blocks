import {
	getIconPositionResetAttributes,
	getIconRevealPositionSettings,
	getIconRevealPositionStyles,
	getResponsiveIconPosition,
} from '@blocks/search-maxi/utils';

describe('getIconPositionResetAttributes', () => {
	it('resets legacy and responsive icon position attributes', () => {
		expect(getIconPositionResetAttributes()).toEqual({
			'icon-position': 'right',
			'icon-position-general': 'right',
			'icon-position-xxl': 'right',
			'icon-position-xl': 'right',
			'icon-position-l': 'right',
			'icon-position-m': 'right',
			'icon-position-s': 'right',
			'icon-position-xs': 'right',
		});
	});
});

describe('getIconRevealPositionSettings', () => {
	it.each([
		[
			'left',
			{
				'input-border-left-width-general': 0,
				'input-border-right-width-general': 4,
				'input-padding-left-general': 35,
				'input-padding-right-general': 10,
			},
		],
		[
			'center',
			{
				'input-border-left-width-general': 4,
				'input-border-right-width-general': 4,
				'input-padding-left-general': 10,
				'input-padding-right-general': 10,
			},
		],
		[
			'right',
			{
				'input-border-left-width-general': 4,
				'input-border-right-width-general': 0,
				'input-padding-left-general': 10,
				'input-padding-right-general': 35,
			},
		],
	])('returns icon reveal spacing for %s position', (position, settings) => {
		expect(getIconRevealPositionSettings(position)).toEqual(settings);
	});

	it('does not return settings for unsupported positions', () => {
		expect(getIconRevealPositionSettings('top')).toBeUndefined();
	});

	it('returns spacing settings for the requested breakpoint', () => {
		expect(getIconRevealPositionSettings('left', 'm')).toEqual({
			'input-border-left-width-m': 0,
			'input-border-right-width-m': 4,
			'input-padding-left-m': 35,
			'input-padding-right-m': 10,
		});
	});
});

describe('getResponsiveIconPosition', () => {
	it('falls back through lower breakpoints before using the legacy position', () => {
		const attributes = {
			'icon-position': 'right',
			'icon-position-general': 'center',
			'icon-position-m': 'left',
		};

		expect(getResponsiveIconPosition(attributes, 's')).toBe('left');
		expect(getResponsiveIconPosition(attributes, 'l')).toBe('center');
	});

	it('uses the legacy position when no responsive positions are set', () => {
		expect(
			getResponsiveIconPosition({ 'icon-position': 'right' }, 'm')
		).toBe('right');
	});
});

describe('getIconRevealPositionStyles', () => {
	it('returns responsive layout styles for configured breakpoint positions', () => {
		expect(
			getIconRevealPositionStyles({
				'icon-position': 'right',
				'icon-position-m': 'left',
			})
		).toEqual({
			block: {
				label: 'Icon reveal position',
				general: {
					'justify-content': 'flex-end',
				},
				m: {
					'justify-content': 'flex-start',
				},
			},
			button: {
				label: 'Icon reveal button position',
				general: {
					order: 2,
				},
				m: {
					order: 0,
				},
			},
			input: {
				label: 'Icon reveal input position',
				general: {
					'margin-left': '0 !important',
					'margin-right': '-25px !important',
				},
				m: {
					'margin-left': '-25px !important',
					'margin-right': '0 !important',
				},
			},
			hiddenInput: {
				label: 'Icon reveal hidden input position',
				general: {
					'border-left-width': '4px !important',
					'border-right-width': '0 !important',
					'margin-left': '0 !important',
					'margin-right': '-25px !important',
					'padding-left': '10px !important',
					'padding-right': '35px !important',
				},
				m: {
					'border-left-width': '0 !important',
					'border-right-width': '4px !important',
					'margin-left': '-25px !important',
					'margin-right': '0 !important',
					'padding-left': '35px !important',
					'padding-right': '10px !important',
				},
			},
		});
	});

	it('uses the legacy icon position for general styles when responsive state is missing', () => {
		expect(
			getIconRevealPositionStyles({
				'icon-position': 'right',
			})
		).toEqual({
			block: {
				label: 'Icon reveal position',
				general: {
					'justify-content': 'flex-end',
				},
			},
			button: {
				label: 'Icon reveal button position',
				general: {
					order: 2,
				},
			},
			input: {
				label: 'Icon reveal input position',
				general: {
					'margin-left': '0 !important',
					'margin-right': '-25px !important',
				},
			},
			hiddenInput: {
				label: 'Icon reveal hidden input position',
				general: {
					'border-left-width': '4px !important',
					'border-right-width': '0 !important',
					'margin-left': '0 !important',
					'margin-right': '-25px !important',
					'padding-left': '10px !important',
					'padding-right': '35px !important',
				},
			},
		});
	});
});
