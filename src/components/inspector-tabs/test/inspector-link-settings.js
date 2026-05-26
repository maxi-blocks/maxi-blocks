import {
	getIsLinkStyleCardOverwriteEnabled,
	getLinkPaletteScStatusUpdates,
} from '../inspector-link-settings.utils';

describe('inspector link settings', () => {
	it('builds link overwrite updates for every link state on the current breakpoint', () => {
		expect(getLinkPaletteScStatusUpdates('', true)).toEqual({
			'link-palette-sc-status-general': true,
			'link-hover-palette-sc-status-general': true,
			'link-active-palette-sc-status-general': true,
			'link-visited-palette-sc-status-general': true,
		});
	});

	it('supports attribute prefixes and responsive breakpoints when building updates', () => {
		expect(getLinkPaletteScStatusUpdates('foo-', false, 'm')).toMatchObject({
			'foo-link-palette-sc-status-m': false,
			'foo-link-hover-palette-sc-status-m': false,
			'foo-link-active-palette-sc-status-m': false,
			'foo-link-visited-palette-sc-status-m': false,
			'foo-link-palette-status-m': true,
			'foo-link-color-m': undefined,
		});
	});

	it('restores style card palette mode when disabling overwrite', () => {
		expect(
			getLinkPaletteScStatusUpdates('', false, 'general', {
				link: { paletteColor: 4, paletteOpacity: 1 },
				hover: { paletteColor: 6, paletteOpacity: 1 },
				active: { paletteColor: 6, paletteOpacity: 1 },
				visited: { paletteColor: 6, paletteOpacity: 1 },
			})
		).toMatchObject({
			'link-palette-status-general': true,
			'link-palette-color-general': 4,
			'link-palette-opacity-general': 1,
			'link-color-general': undefined,
			'link-hover-palette-status-general': true,
			'link-hover-palette-color-general': 6,
			'link-hover-palette-opacity-general': 1,
			'link-hover-color-general': undefined,
			'link-active-palette-status-general': true,
			'link-active-palette-color-general': 6,
			'link-active-palette-opacity-general': 1,
			'link-active-color-general': undefined,
			'link-visited-palette-status-general': true,
			'link-visited-palette-color-general': 6,
			'link-visited-palette-opacity-general': 1,
			'link-visited-color-general': undefined,
		});
	});

	it('clears inherited breakpoint overrides when disabling overwrite', () => {
		expect(getLinkPaletteScStatusUpdates('', false)).toMatchObject({
			'link-palette-sc-status-xxl': false,
			'link-palette-status-xxl': true,
			'link-color-xxl': undefined,
			'link-hover-palette-sc-status-xl': false,
			'link-hover-palette-status-xl': true,
			'link-hover-color-xl': undefined,
			'link-active-palette-sc-status-s': false,
			'link-active-palette-status-s': true,
			'link-active-color-s': undefined,
			'link-visited-palette-sc-status-xs': false,
			'link-visited-palette-status-xs': true,
			'link-visited-color-xs': undefined,
		});
	});

	it('removes link overrides from custom formats when disabling overwrite', () => {
		expect(
			getLinkPaletteScStatusUpdates(
				'',
				false,
				'general',
				{},
				{
					'maxi-text-block__custom-format--0': {
						'link-palette-color-general': 2,
						'link-active-palette-color-general': 2,
						'link-hover-palette-color-general': 5,
						'font-weight-general': 700,
					},
					'maxi-text-block__custom-format--1': {
						'link-hover-palette-color-general': 5,
					},
				}
			)
		).toMatchObject({
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 700,
				},
				'maxi-text-block__custom-format--1': {},
			},
		});
	});

	it('removes prefixed link overrides from custom formats when disabling overwrite', () => {
		expect(
			getLinkPaletteScStatusUpdates(
				'foo-',
				false,
				'general',
				{},
				{
					'maxi-text-block__custom-format--0': {
						'foo-link-palette-color-general': 2,
						'foo-link-active-palette-color-general': 2,
						'foo-link-hover-palette-color-general': 5,
						'link-palette-color-general': 4,
						'font-weight-general': 700,
					},
				}
			)
		).toMatchObject({
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'link-palette-color-general': 4,
					'font-weight-general': 700,
				},
			},
		});
	});

	it('detects enabled overwrite from any inherited link state', () => {
		expect(
			getIsLinkStyleCardOverwriteEnabled(
				{ 'foo-link-hover-palette-sc-status-general': true },
				'foo-'
			)
		).toBe(true);
	});

	it('detects enabled overwrite from custom link colour mode', () => {
		expect(
			getIsLinkStyleCardOverwriteEnabled(
				{ 'link-palette-status-general': false },
				''
			)
		).toBe(true);
	});

	it('detects enabled overwrite from another breakpoint even when the current breakpoint is disabled', () => {
		expect(
			getIsLinkStyleCardOverwriteEnabled(
				{
					'link-palette-sc-status-general': true,
					'link-palette-sc-status-m': false,
				},
				''
			)
		).toBe(true);
	});

	it('returns false when overwrite is disabled for all link states', () => {
		expect(getIsLinkStyleCardOverwriteEnabled({}, '')).toBe(false);
	});

	it('does not add custom format updates when enabling overwrite', () => {
		expect(
			getLinkPaletteScStatusUpdates('', true, 'general', {}, {
				'maxi-text-link': {
					'link-palette-color-general': 2,
				},
			})
		).toEqual({
			'link-palette-sc-status-general': true,
			'link-hover-palette-sc-status-general': true,
			'link-active-palette-sc-status-general': true,
			'link-visited-palette-sc-status-general': true,
		});
	});
});
