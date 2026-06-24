import {
	isSyncableSCKey,
	getSyncableSCValues,
	areSCSettingsSynced,
	getLightSettingsForDark,
	resolveLightSyncValue,
} from '../typographySync';

// getTypographyFromSC is exercised in its own test suite; here we mock it to a
// simple default+override merge so we can focus on the sync logic itself.
jest.mock('@extensions/style-cards', () => ({
	getTypographyFromSC: jest.fn((toneSC, type) => ({
		...(toneSC?.defaultStyleCard?.[type] || {}),
		...(toneSC?.styleCard?.[type] || {}),
	})),
}));

jest.mock('@extensions/styles/getLastBreakpointAttribute', () =>
	jest.fn(({ target, breakpoint, attributes }) => {
		if (attributes[`${target}-${breakpoint}`] !== undefined) {
			return attributes[`${target}-${breakpoint}`];
		}
		// Fallback to the general breakpoint, mirroring the real util.
		return attributes[`${target}-general`];
	})
);

// Builds a style card with light/dark tones from per-tone element overrides.
const buildSC = ({ light = {}, dark = {} } = {}) => ({
	light: {
		defaultStyleCard: {
			p: {
				'font-family-general': 'Roboto',
				'font-size-general': 16,
				'line-height-general': 1.4,
				color: 'rgb(0,0,0)',
				'color-global': true,
				'palette-status': true,
				'palette-color': 5,
				'palette-opacity': 1,
			},
			navigation: {
				'font-size-general': 16,
				'padding-top-general': 10,
				'overwrite-mobile': true,
				'always-show-mobile': false,
				'show-mobile-down-from': 1024,
				'remove-hover-underline': true,
				'menu-item-color': 'rgb(0,0,0)',
				'menu-item-palette-color': 4,
			},
		},
		styleCard: light,
	},
	dark: {
		defaultStyleCard: {
			p: {
				'font-family-general': 'Roboto',
				'font-size-general': 16,
				'line-height-general': 1.4,
				color: 'rgb(255,255,255)',
				'color-global': true,
				'palette-status': true,
				'palette-color': 1,
				'palette-opacity': 1,
			},
			navigation: {
				'font-size-general': 16,
				'padding-top-general': 10,
				'overwrite-mobile': true,
				'always-show-mobile': false,
				'show-mobile-down-from': 1024,
				'remove-hover-underline': true,
				'menu-item-color': 'rgb(255,255,255)',
				'menu-item-palette-color': 8,
			},
		},
		styleCard: dark,
	},
});

describe('isSyncableSCKey', () => {
	it('treats typography keys as syncable', () => {
		expect(isSyncableSCKey('p', 'font-family-general')).toBe(true);
		expect(isSyncableSCKey('p', 'font-size-general')).toBe(true);
		expect(isSyncableSCKey('p', 'line-height-general')).toBe(true);
	});

	it('excludes color and palette keys for any element', () => {
		expect(isSyncableSCKey('p', 'color')).toBe(false);
		expect(isSyncableSCKey('p', 'color-global')).toBe(false);
		expect(isSyncableSCKey('p', 'palette-color')).toBe(false);
		expect(isSyncableSCKey('p', 'palette-status')).toBe(false);
		expect(isSyncableSCKey('p', 'palette-opacity')).toBe(false);
	});

	it('excludes navigation menu-* color keys', () => {
		expect(isSyncableSCKey('navigation', 'menu-item-color')).toBe(false);
		expect(isSyncableSCKey('navigation', 'menu-burger-palette-color')).toBe(
			false
		);
	});

	it('treats navigation padding as syncable', () => {
		expect(isSyncableSCKey('navigation', 'padding-top-general')).toBe(true);
	});

	it('excludes the global navigation options (navigation only)', () => {
		const globalKeys = [
			'overwrite-mobile',
			'always-show-mobile',
			'show-mobile-down-from',
			'remove-hover-underline',
		];
		globalKeys.forEach(key => {
			expect(isSyncableSCKey('navigation', key)).toBe(false);
			// They are not global for other element types.
			expect(isSyncableSCKey('p', key)).toBe(true);
		});
	});
});

describe('getSyncableSCValues', () => {
	it('returns typography for a text element with colors stripped', () => {
		const sc = buildSC();
		const result = getSyncableSCValues(sc.light, 'p');

		expect(result).toEqual({
			'font-family-general': 'Roboto',
			'font-size-general': 16,
			'line-height-general': 1.4,
		});
		expect(result).not.toHaveProperty('color');
		expect(result).not.toHaveProperty('palette-color');
	});

	it('returns typography + padding for navigation, without colors or global keys', () => {
		const sc = buildSC();
		const result = getSyncableSCValues(sc.light, 'navigation');

		expect(result).toEqual({
			'font-size-general': 16,
			'padding-top-general': 10,
		});
	});
});

describe('areSCSettingsSynced', () => {
	it('is synced when light and dark typography match (default card)', () => {
		expect(areSCSettingsSynced(buildSC(), 'p')).toBe(true);
	});

	it('is unsynced when a typography value differs', () => {
		const sc = buildSC({ dark: { p: { 'font-size-general': 40 } } });
		expect(areSCSettingsSynced(sc, 'p')).toBe(false);
	});

	it('stays synced when only colors differ between tones', () => {
		// Defaults already give light/dark different palette-color + color.
		expect(areSCSettingsSynced(buildSC(), 'p')).toBe(true);

		const sc = buildSC({ dark: { p: { 'palette-color': 3 } } });
		expect(areSCSettingsSynced(sc, 'p')).toBe(true);
	});

	it('stays synced for navigation when only a global option differs', () => {
		const sc = buildSC({
			dark: { navigation: { 'overwrite-mobile': false } },
		});
		expect(areSCSettingsSynced(sc, 'navigation')).toBe(true);
	});

	it('is unsynced for navigation when padding differs', () => {
		const sc = buildSC({
			dark: { navigation: { 'padding-top-general': 30 } },
		});
		expect(areSCSettingsSynced(sc, 'navigation')).toBe(false);
	});

	it('returns false when a tone is missing', () => {
		expect(areSCSettingsSynced({ light: {} }, 'p')).toBe(false);
		expect(areSCSettingsSynced(undefined, 'p')).toBe(false);
	});
});

describe('getLightSettingsForDark', () => {
	it('returns the light syncable values used to re-sync dark', () => {
		const sc = buildSC({
			light: { p: { 'font-size-general': 35 } },
			dark: { p: { 'font-size-general': 40 } },
		});

		expect(getLightSettingsForDark(sc, 'p')).toEqual({
			'font-family-general': 'Roboto',
			'font-size-general': 35,
			'line-height-general': 1.4,
		});
	});
});

describe('resolveLightSyncValue', () => {
	it('resolves the current light value for a typography target', () => {
		const sc = buildSC({
			light: { p: { 'font-size-general': 35 } },
			dark: { p: { 'font-size-general': 40 } },
		});

		expect(resolveLightSyncValue(sc, 'p', 'font-size', 'general')).toBe(35);
		expect(resolveLightSyncValue(sc, 'p', 'font-family', 'general')).toBe(
			'Roboto'
		);
	});

	it('returns undefined for non-syncable (color) targets', () => {
		const sc = buildSC();
		expect(
			resolveLightSyncValue(sc, 'p', 'palette-color', 'general')
		).toBeUndefined();
	});

	it('returns undefined when the light tone is missing', () => {
		expect(
			resolveLightSyncValue({ dark: {} }, 'p', 'font-size', 'general')
		).toBeUndefined();
	});
});
