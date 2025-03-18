import getActiveStyleCard from '@extensions/style-cards/getActiveStyleCard';
import { getIsValid } from '@extensions/styles';

const navigationObject = {
	navigation: {
		'menu-item-color-global': false,
		'menu-item-palette-status': true,
		'menu-item-palette-color': 3,
		'menu-item-palette-opacity': 1,
		'menu-item-color': '',
		'menu-item-hover-color-global': false,
		'menu-item-hover-palette-status': true,
		'menu-item-hover-palette-color': 4,
		'menu-item-hover-palette-opacity': 1,
		'menu-item-hover-color': '',
		'menu-item-current-color-global': false,
		'menu-item-current-palette-status': true,
		'menu-item-current-palette-color': 6,
		'menu-item-current-palette-opacity': 1,
		'menu-item-current-color': '',
		'menu-item-visited-color-global': false,
		'menu-item-visited-palette-status': true,
		'menu-item-visited-palette-color': 5,
		'menu-item-visited-palette-opacity': 1,
		'menu-item-visited-color': '',
		'menu-item-sub-bg-color-global': false,
		'menu-item-sub-bg-palette-status': true,
		'menu-item-sub-bg-palette-color': 1,
		'menu-item-sub-bg-palette-opacity': 1,
		'menu-item-sub-bg-color': '',
		'menu-item-sub-bg-hover-color-global': false,
		'menu-item-sub-bg-hover-palette-status': true,
		'menu-item-sub-bg-hover-palette-color': 2,
		'menu-item-sub-bg-hover-palette-opacity': 1,
		'menu-item-sub-bg-hover-color': '',
		'menu-item-sub-bg-current-color-global': false,
		'menu-item-sub-bg-current-palette-status': true,
		'menu-item-sub-bg-current-palette-color': 3,
		'menu-item-sub-bg-current-palette-opacity': 1,
		'menu-item-sub-bg-current-color': '',
		'menu-burger-color-global': true,
		'menu-burger-palette-status': true,
		'menu-burger-palette-color': 5,
		'menu-burger-palette-opacity': 1,
		'menu-burger-color': '',
		'menu-mobile-bg-color-global': true,
		'menu-mobile-bg-palette-status': true,
		'menu-mobile-bg-palette-color': 1,
		'menu-mobile-bg-palette-opacity': 1,
		'menu-mobile-bg-color': '',
		'font-family-general': 'Roboto',
		'font-size-general': 16,
		'font-size-unit-general': 'px',
		'font-size-xxl': 20,
		'font-size-unit-xxl': 'px',
		'font-size-xl': 16,
		'font-size-unit-xl': 'px',
		'line-height-general': 26,
		'line-height-unit-general': 'px',
		'line-height-xxl': 30,
		'line-height-unit-xxl': 'px',
		'line-height-xl': 26,
		'line-height-unit-xl': 'px',
		'font-weight-general': 400,
		'text-transform-general': 'none',
		'font-style-general': 'normal',
		'letter-spacing-general': 0,
		'letter-spacing-unit-general': 'px',
		'letter-spacing-xxl': 0,
		'letter-spacing-unit-xxl': 'px',
		'letter-spacing-xl': 0,
		'letter-spacing-unit-xl': 'px',
		'text-decoration-general': 'unset',
		'text-orientation-general': 'unset',
		'text-direction-general': 'ltr',
		'white-space-general': 'normal',
		'word-spacing-general': 0,
		'word-spacing-unit-general': 'px',
		'bottom-gap-general': 20,
		'bottom-gap-unit-general': 'px',
		'text-indent-general': 0,
		'text-indent-unit-general': 'px',
		'overwrite-mobile': false,
		'always-show-mobile': false,
		'show-mobile-down-from': 1024,
		'remove-hover-underline': false,
		'padding-top-general': 5,
		'padding-top-xxl': 10,
		'padding-right-general': 15,
		'padding-right-xxl': 20,
		'padding-bottom-general': 5,
		'padding-bottom-xxl': 20,
		'padding-left-general': 15,
		'padding-left-xxl': 20,
		'padding-sync-general': 'axis',
		'padding-top-unit-general': 'px',
		'padding-right-unit-general': 'px',
		'padding-bottom-unit-general': 'px',
		'padding-left-unit-general': 'px',
	},
};

const navigationExists = styleCard => {
	return styleCard?.value?.dark?.defaultStyleCard?.navigation !== undefined;
};

const addMissingButtonXXLLineHeight = styleCard => {
	['dark', 'light'].forEach(style => {
		const styleValue = styleCard?.value?.[style];
		if (
			styleValue &&
			styleValue.defaultStyleCard &&
			styleValue.defaultStyleCard.button
		) {
			const { button } = styleValue.defaultStyleCard;

			// Check if line-height-xxl is missing
			if (
				button['line-height-general'] &&
				button['line-height-xl'] &&
				(!button['line-height-xxl'] || !button['line-height-unit-xxl'])
			) {
				// Add missing line-height-xxl based on existing values
				if (!button['line-height-xxl']) {
					// Use the same value as line-height-xl or line-height-general
					button['line-height-xxl'] =
						button['line-height-xl'] ||
						button['line-height-general'];
				}

				// Add missing line-height-unit-xxl based on existing values
				if (!button['line-height-unit-xxl']) {
					// Use the same unit as line-height-xl-unit or line-height-general-unit
					button['line-height-unit-xxl'] =
						button['line-height-unit-xl'] ||
						button['line-height-unit-general'];
				}
			}
		}
	});
};

const addNavigationToStyleCards = styleCard => {
	['dark', 'light'].forEach(style => {
		const styleValue = styleCard?.value?.[style];
		if (
			styleValue &&
			styleValue.defaultStyleCard &&
			!styleValue.defaultStyleCard.navigation
		) {
			const { defaultStyleCard } = styleValue;
			const keys = Object.keys(defaultStyleCard);
			const dividerIndex = keys.indexOf('divider');
			const newKeys = [
				...keys.slice(0, dividerIndex + 1),
				'navigation',
				...keys.slice(dividerIndex + 1),
			];
			const newDefaultStyleCard = newKeys.reduce((obj, key) => {
				if (key === 'navigation') {
					obj[key] = navigationObject.navigation;
				} else {
					obj[key] = defaultStyleCard[key];
				}
				return obj;
			}, {});
			styleCard.value[style].defaultStyleCard = newDefaultStyleCard;
		}
	});
};

const removeH6LineHeightUnitL = styleCard => {
	['dark', 'light'].forEach(style => {
		const styleValue = styleCard?.value?.[style];
		if (
			styleValue &&
			styleValue.defaultStyleCard &&
			styleValue.defaultStyleCard.h6
		) {
			const { h6 } = styleValue.defaultStyleCard;

			// Check if line-height-unit-l equals line-height-unit-xl
			if (
				h6['line-height-unit-l'] &&
				h6['line-height-unit-xl'] &&
				h6['line-height-unit-l'] === h6['line-height-unit-xl']
			) {
				// Remove line-height-unit-l since it equals line-height-unit-xl
				delete h6['line-height-unit-l'];
			}
		}
	});
};

// Usage
export const receiveMaxiStyleCards = state => {
	if (state.styleCards) {
		// Fix missing button line-height-xxl values in all style cards
		Object.values(state.styleCards).forEach(styleCard => {
			if (!navigationExists(styleCard)) {
				addNavigationToStyleCards(styleCard);
			}
			addMissingButtonXXLLineHeight(styleCard);
			removeH6LineHeightUnitL(styleCard);
		});
		return state.styleCards;
	}
	return false;
};

export const receiveSavedMaxiStyleCards = state => {
	if (state.savedStyleCards) {
		// Fix missing button line-height-xxl values in all saved style cards
		Object.values(state.savedStyleCards).forEach(styleCard => {
			if (!navigationExists(styleCard)) {
				addNavigationToStyleCards(styleCard);
			}
			addMissingButtonXXLLineHeight(styleCard);
			removeH6LineHeightUnitL(styleCard);
		});
		return state.savedStyleCards;
	}

	return false;
};

export const receiveMaxiActiveStyleCard = state => {
	if (state.savedStyleCards) {
		const activeStyleCard = getActiveStyleCard(state.savedStyleCards);
		if (!navigationExists(activeStyleCard)) {
			addNavigationToStyleCards(activeStyleCard);
		}
		// Fix missing button line-height-xxl values
		addMissingButtonXXLLineHeight(activeStyleCard);
		removeH6LineHeightUnitL(activeStyleCard);
		return activeStyleCard;
	}
	return false;
};

export const receiveMaxiSelectedStyleCard = state => {
	if (state.styleCards) {
		const selectedStyleCard = getActiveStyleCard(state.styleCards, true);
		if (!navigationExists(selectedStyleCard)) {
			addNavigationToStyleCards(selectedStyleCard);
		}
		// Fix missing button line-height-xxl values
		addMissingButtonXXLLineHeight(selectedStyleCard);
		removeH6LineHeightUnitL(selectedStyleCard);
		return selectedStyleCard;
	}
	return false;
};

export const receiveStyleCardsList = state => {
	if (state.styleCards)
		return Object.entries(state.styleCards).map(([key, value]) => {
			return { label: value.name, value: key };
		});

	return false;
};

const getSCValues = (SC, rawTarget, blockStyle, SCEntry) => {
	const getSCValue = target => {
		const styleCardEntry = {
			...SC.value?.[blockStyle]?.defaultStyleCard[SCEntry],
			...SC.value?.[blockStyle]?.styleCard[SCEntry],
		};
		const value = styleCardEntry?.[target];

		return getIsValid(value, true) ? value : false;
	};

	if (typeof rawTarget === 'string') return getSCValue(rawTarget);

	const response = {};

	rawTarget.forEach(target => {
		response[target] = getSCValue(target);
	});

	return response;
};

export const receiveActiveStyleCardValue = (
	state,
	rawTarget,
	blockStyle,
	SCEntry
) => {
	if (state.styleCards)
		return getSCValues(
			getActiveStyleCard(state.styleCards),
			rawTarget,
			blockStyle,
			SCEntry
		);

	return false;
};

export const receiveSelectedStyleCardValue = (
	state,
	rawTarget,
	blockStyle,
	SCEntry
) => {
	if (state.styleCards)
		return getSCValues(
			getActiveStyleCard(state.styleCards, true),
			rawTarget,
			blockStyle,
			SCEntry
		);

	return false;
};
