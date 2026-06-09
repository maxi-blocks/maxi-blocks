/**
 * Internal dependencies
 */
import { getTypographyFromSC } from '@extensions/style-cards';

/**
 * External dependencies
 */
import { isEqual, pickBy } from 'lodash';

/**
 * Light/Dark sync of style card settings (UI only — no schema changes).
 *
 * Light and Dark tones share most settings by default and only differ by color.
 * The editor lets the user keep them in sync and opt out per element on the Dark
 * tab. "Synced" is derived by comparing the syncable settings of both tones.
 *
 * Syncable = everything except:
 *  - color/palette props (each tone keeps its own colors), and
 *  - settings that have no per-tone effect (applied globally), which therefore
 *    live only on the Light tab.
 *
 * For text elements (p, button, h1…h6, number-counter) the only syncable group
 * is typography. For navigation it also includes the item padding, while the
 * mobile-menu and hover-underline options are global and excluded.
 */

// Matches any color/palette related key, including the navigation `menu-*`
// color keys (e.g. `menu-item-color`, `menu-burger-palette-color`).
const COLOR_KEY_RE = /palette|color/i;

// Per-element keys that are applied globally (no light/dark separation) and so
// are never synced — they are shown on the Light tab only.
const GLOBAL_KEYS_BY_TYPE = {
	navigation: [
		'overwrite-mobile',
		'always-show-mobile',
		'show-mobile-down-from',
		'remove-hover-underline',
	],
};

/**
 * Whether a given attribute key participates in light/dark sync for an element.
 *
 * @param {string} type The element key (e.g. 'p', 'button', 'navigation')
 * @param {string} key  The attribute key
 * @return {boolean} True when the key should be synced/mirrored
 */
export const isSyncableSCKey = (type, key) => {
	if (COLOR_KEY_RE.test(key)) return false;
	if (GLOBAL_KEYS_BY_TYPE[type]?.includes(key)) return false;

	return true;
};

/**
 * Returns the syncable settings for an element on a single tone (typography for
 * text elements, plus padding for navigation), with color and global keys removed.
 *
 * @param {Object} toneSC The tone-level SC object (e.g. selectedSCValue.light)
 * @param {string} type   The element key
 * @return {Object} Syncable props only
 */
export const getSyncableSCValues = (toneSC, type) =>
	pickBy(getTypographyFromSC(toneSC, type), (value, key) =>
		isSyncableSCKey(type, key)
	);

/**
 * Whether the light and dark syncable settings for an element are currently
 * identical. When they match, the element is considered "synced".
 *
 * @param {Object} selectedSCValue The full SC object with light/dark tones
 * @param {string} type            The element key
 * @return {boolean} True when light and dark settings match
 */
export const areSCSettingsSynced = (selectedSCValue, type) => {
	if (!selectedSCValue?.light || !selectedSCValue?.dark) return false;

	return isEqual(
		getSyncableSCValues(selectedSCValue.light, type),
		getSyncableSCValues(selectedSCValue.dark, type)
	);
};

/**
 * Returns the light tone's syncable settings for an element, used to copy them
 * onto the dark tone when re-syncing (color/global keys are excluded so dark
 * keeps its own colors and the global settings stay untouched).
 *
 * @param {Object} selectedSCValue The full SC object with light/dark tones
 * @param {string} type            The element key
 * @return {Object} Light syncable props to apply to dark
 */
export const getLightSettingsForDark = (selectedSCValue, type) =>
	getSyncableSCValues(selectedSCValue.light, type);
