import {
	getIconRevealPositionSettings,
	getIconRevealPositionStyles,
	getResponsiveIconPosition,
} from '@blocks/search-maxi/utils';

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
	it('returns responsive layout styles only for configured breakpoint positions', () => {
		expect(
			getIconRevealPositionStyles({
				'icon-position': 'right',
				'icon-position-m': 'left',
			})
		).toEqual({
			block: {
				label: 'Icon reveal position',
				m: {
					'justify-content': 'flex-start',
				},
			},
			button: {
				label: 'Icon reveal button position',
				m: {
					order: 0,
				},
			},
			input: {
				label: 'Icon reveal input position',
				m: {
					'margin-left': '-25px !important',
					'margin-right': '0 !important',
				},
			},
			hiddenInput: {
				label: 'Icon reveal hidden input position',
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
});
