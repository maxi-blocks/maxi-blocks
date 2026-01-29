/**
 * Style Card helpers for Maxi AI Chat Panel
 * Encapsulates Style Card patterns, selectors, and update handlers.
 */

import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { cloneDeep } from 'lodash';

import applyThemeToStyleCards, { openStyleCardsEditor } from '@extensions/style-cards/applyThemeToStyleCards';

const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const STYLE_CARD_SECTIONS = new Set([
	'color',
	'p',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'button',
	'icon',
	'divider',
	'link',
	'navigation',
]);
const HEADING_ALIASES = new Set(['heading', 'headings', 'header', 'headers', 'title', 'titles']);
const BODY_ALIASES = new Set(['body', 'paragraph', 'text']);
const isPlainObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
const normalizeSectionKey = key => {
	if (!key) return key;
	const lowerKey = String(key).toLowerCase();
	if (HEADING_ALIASES.has(lowerKey)) return 'headings';
	if (BODY_ALIASES.has(lowerKey)) return 'p';
	return lowerKey;
};

export const STYLE_CARD_PATTERNS = [
	{ regex: /minimalis(m|t)|clean.*look|simple.*design|white.*space/, property: 'aesthetic', value: 'minimalism', selectionMsg: 'Applied minimalist style.', pageMsg: 'Applied minimalist aesthetic.' },
	{ regex: /brutalis(m|t)|raw.*html|harsh|industrial/, property: 'aesthetic', value: 'brutalism', selectionMsg: 'Applied brutalist style.', pageMsg: 'Applied brutalist aesthetic.' },
	{ regex: /neobrutalis(m|t)|thick.*border.*pastel|block.*shadow|modern.*figma/, property: 'aesthetic', value: 'neobrutalism', selectionMsg: 'Applied neobrutalist style.', pageMsg: 'Applied neobrutalist aesthetic.' },
	{ regex: /swiss|helvetica|grid.*layout|typograph/, property: 'aesthetic', value: 'swiss', selectionMsg: 'Applied Swiss style.', pageMsg: 'Applied Swiss typography aesthetic.' },
	{ regex: /editorial|magazine|newspaper|pull.*quote/, property: 'aesthetic', value: 'editorial', selectionMsg: 'Applied editorial style.', pageMsg: 'Applied editorial layout.' },
	{ regex: /masculine|bold.*dark|strong.*geometric/, property: 'aesthetic', value: 'masculine', selectionMsg: 'Applied masculine style.', pageMsg: 'Applied masculine aesthetic.' },
	{ regex: /feminine|soft.*pastel|delicate|script.*font/, property: 'aesthetic', value: 'feminine', selectionMsg: 'Applied feminine style.', pageMsg: 'Applied feminine aesthetic.' },
	{ regex: /corporate|professional|business|navy.*slate/, property: 'aesthetic', value: 'corporate', selectionMsg: 'Applied corporate style.', pageMsg: 'Applied corporate aesthetic.' },
	{ regex: /natural|organic|earth.*tone|terracotta|sage/, property: 'aesthetic', value: 'natural', selectionMsg: 'Applied natural style.', pageMsg: 'Applied natural/organic aesthetic.' },
];

export const useStyleCardData = () => {
	const activeStyleCard = useSelect(
		select => select('maxiBlocks/style-cards')?.receiveMaxiSelectedStyleCard(),
		[]
	);
	const allStyleCards = useSelect(
		select => select('maxiBlocks/style-cards')?.receiveMaxiStyleCards(),
		[]
	);
	const { saveMaxiStyleCards, resetSC, setActiveStyleCard } = useDispatch('maxiBlocks/style-cards') || {};

	const customColors = useSelect(select => {
		const {
			receiveSelectedStyleCardValue,
			receiveMaxiSelectedStyleCardValue,
		} = select('maxiBlocks/style-cards') || {};

		if (!receiveSelectedStyleCardValue) return [];

		let colors = receiveSelectedStyleCardValue(
			'customColors',
			null,
			'color'
		);

		if (!colors || colors.length === 0) {
			colors = receiveMaxiSelectedStyleCardValue?.('customColors') || [];
		}

		if (!colors || colors.length === 0) {
			const styleCard = select('maxiBlocks/style-cards')?.receiveMaxiSelectedStyleCard();

			if (styleCard && styleCard.value) {
				colors =
					styleCard.value.light?.styleCard?.color?.customColors ||
					styleCard.value.dark?.styleCard?.color?.customColors ||
					styleCard.value.color?.customColors ||
					[];
			}
		}

		return colors || [];
	}, []);

	return {
		activeStyleCard,
		allStyleCards,
		customColors,
		saveMaxiStyleCards,
		resetSC,
		setActiveStyleCard,
	};
};

export const buildStyleCardContext = activeStyleCard => {
	if (!activeStyleCard) return '';
	const colors = activeStyleCard.light?.styleCard?.color || {};
	const colorContext = Object.entries(colors)
		.filter(([k]) => k.startsWith('color-') || /^\d+$/.test(k))
		.map(([k, v]) => `${/^\d+$/.test(k) ? `color-${k}` : k}: ${v}`)
		.join(', ');

	if (!colorContext) return '';
	return `\n\nCurrent Style Card Colors: ${colorContext}\n(Use these keys to update global colors)`;
};

export const createStyleCardHandlers = ({
	allStyleCards,
	saveMaxiStyleCards,
	resetSC,
	setActiveStyleCard,
}) => {
	const handleUpdateStyleCard = (updates) => {
		if (!allStyleCards || !saveMaxiStyleCards) {
			return __('Style Cards System is not ready.', 'maxi-blocks');
		}
		if (!updates || typeof updates !== 'object') {
			return __('No valid Style Card updates found.', 'maxi-blocks');
		}

		const newStyleCards = cloneDeep(allStyleCards);
		const sortedKeys = Object.keys(newStyleCards).sort();
		let activeKey = sortedKeys.find(key => newStyleCards[key].status === 'active');

		if (!activeKey) {
			activeKey = sortedKeys.length ? sortedKeys[0] : null;
		}

		const corruptedKeys = ['light', 'dark', 'status', 'value', 'styleCard'];
		const isCorrupted = sortedKeys.some(key => corruptedKeys.includes(key));

		if (!activeKey || !newStyleCards[activeKey] || isCorrupted) {
			if (resetSC) {
				resetSC();
				return __('Style Cards data was corrupted. Resetting to defaults... Please try again after page reload.', 'maxi-blocks');
			}
			return __('No active Style Card found.', 'maxi-blocks');
		}

		let targetKey = activeKey;
		let message = '';
		let shouldFocusHeadings = false;
		let focusHeadingLevel = 'h1';

		if (activeKey === 'sc_maxi') {
			const timestamp = Date.now();
			const newKey = `sc_ai_${timestamp}`;
			targetKey = newKey;

			newStyleCards[newKey] = cloneDeep(newStyleCards[activeKey]);
			newStyleCards[newKey].id = newKey;
			newStyleCards[newKey].name = `AI Generated - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
			newStyleCards[newKey].status = 'active';

			newStyleCards[activeKey].status = 'inactive';

			message = __('New Style Card created. Review and save in the editor.', 'maxi-blocks');
		} else {
			message = __('Style Card updated. Review and save in the editor.', 'maxi-blocks');
		}

		const targetCard = newStyleCards[targetKey];
		let changesCount = 0;

		const ensureSection = (mode, section) => {
			if (!targetCard[mode]) targetCard[mode] = {};
			if (!targetCard[mode].styleCard) targetCard[mode].styleCard = {};
			if (!targetCard[mode].styleCard[section]) {
				targetCard[mode].styleCard[section] = {};
			}
		};

		const setSectionValue = (section, key, value) => {
			['light', 'dark'].forEach(mode => {
				ensureSection(mode, section);
				targetCard[mode].styleCard[section][key] = value;
			});
			changesCount++;
		};

		const setColorValue = (colorKey, value) => {
			['light', 'dark'].forEach(mode => {
				ensureSection(mode, 'color');
				targetCard[mode].styleCard.color[colorKey] = value;
			});
			changesCount++;
		};

		const applySectionUpdates = (section, sectionUpdates) => {
			Object.entries(sectionUpdates).forEach(([key, value]) => {
				setSectionValue(section, key, value);
			});
		};

		const markHeadingFocus = (level = null) => {
			shouldFocusHeadings = true;
			if (level && HEADING_LEVELS.includes(level)) {
				focusHeadingLevel = level;
			}
		};

		Object.entries(updates).forEach(([rawKey, value]) => {
			const key = normalizeSectionKey(rawKey);
			if (key === 'headings') {
				markHeadingFocus();
			} else if (HEADING_LEVELS.includes(key)) {
				markHeadingFocus(key);
			} else if (typeof rawKey === 'string' && rawKey.includes('.')) {
				const [sectionPart] = rawKey.split('.');
				const sectionKey = normalizeSectionKey(sectionPart);
				if (sectionKey === 'headings') {
					markHeadingFocus();
				} else if (HEADING_LEVELS.includes(sectionKey)) {
					markHeadingFocus(sectionKey);
				}
			}

			if (key === 'headings') {
				if (isPlainObject(value)) {
					HEADING_LEVELS.forEach(level => applySectionUpdates(level, value));
				} else if (typeof value === 'string') {
					HEADING_LEVELS.forEach(level => setSectionValue(level, 'font-family-general', value));
				}
				return;
			}

			if (STYLE_CARD_SECTIONS.has(key) && isPlainObject(value)) {
				applySectionUpdates(key, value);
				return;
			}

			if (key === 'color' && isPlainObject(value)) {
				Object.entries(value).forEach(([colorKey, colorValue]) => {
					const normalizedColorKey = String(colorKey).replace(/^color-/, '');
					setColorValue(normalizedColorKey, colorValue);
				});
				return;
			}

			if (typeof rawKey === 'string' && rawKey.includes('.')) {
				const [sectionPart, attr] = rawKey.split('.');
				const sectionKey = normalizeSectionKey(sectionPart);
				if (STYLE_CARD_SECTIONS.has(sectionKey) && attr) {
					setSectionValue(sectionKey, attr, value);
					return;
				}
				if (sectionKey === 'headings' && attr) {
					HEADING_LEVELS.forEach(level => setSectionValue(level, attr, value));
					return;
				}
			}

			if (typeof rawKey === 'string' && /^color-\d+$/.test(rawKey)) {
				setColorValue(rawKey.replace('color-', ''), value);
				return;
			}

			if (typeof rawKey === 'string' && /^\d+$/.test(rawKey)) {
				setColorValue(rawKey, value);
				return;
			}

			if (typeof rawKey === 'string' && rawKey.startsWith('font-')) {
				setSectionValue('p', rawKey, value);
			}
		});

		if (changesCount > 0) {
			Object.keys(newStyleCards).forEach(key => {
				if (key === targetKey) {
					newStyleCards[key].pendingChanges = true;
					newStyleCards[key].selected = true;
				} else {
					delete newStyleCards[key].selected;
				}
			});

			saveMaxiStyleCards(newStyleCards, true);

			if (setActiveStyleCard && targetKey !== activeKey) {
				setActiveStyleCard(targetKey);
			}

			openStyleCardsEditor({
				focusHeadingsGlobals: shouldFocusHeadings,
				headingLevel: focusHeadingLevel,
				delay: 350,
			});

			return message;
		}
		return __('No valid Style Card updates found.', 'maxi-blocks');
	};

	const handleApplyTheme = (theme, prompt) => {
		if (!allStyleCards || !saveMaxiStyleCards) {
			return __('Style Cards System is not ready.', 'maxi-blocks');
		}

		const isHeadingRequest = prompt && /heading|header|title|h1|h2|h3|h4|h5|h6/i.test(prompt);
		const isBlueRequest = prompt && /blue/i.test(prompt);

		const result = applyThemeToStyleCards({
			styleCards: allStyleCards,
			theme,
			prompt,
			openEditor: false,
			timestamp: Date.now(),
		});

		if (!result) {
			return __('Could not apply theme. Try specifying a color like "make it green".', 'maxi-blocks');
		}

		saveMaxiStyleCards(result.styleCards, false);

		if (setActiveStyleCard && result.updatedKey) {
			setActiveStyleCard(result.updatedKey);
		}

		setTimeout(() => {
			const editorOptions = {};

			if (isHeadingRequest) {
				editorOptions.focusHeadingsGlobals = true;

				let detectedLevel = null;
				const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
				for (const level of levels) {
					if (new RegExp(level, 'i').test(prompt)) {
						detectedLevel = level;
						break;
					}
				}

				const isAll = /all|every/i.test(prompt);

				editorOptions.headingLevel = detectedLevel || 'h1';
				editorOptions.applyHeadingLevel = isAll ? 'all' : (detectedLevel || 'all');
				editorOptions.delay = 400;

				if (isBlueRequest) {
					editorOptions.applyHeadingPaletteColor = true;
				}
			}

			if (typeof window !== 'undefined' && typeof window.maxiBlocksOpenStyleCardsEditor === 'function') {
				window.maxiBlocksOpenStyleCardsEditor(editorOptions);
				return;
			}

			const styleCardsButton = typeof document !== 'undefined'
				? document.getElementById('maxi-button__style-cards')
				: null;

			if (styleCardsButton) {
				styleCardsButton.click();

				if (isHeadingRequest) {
					setTimeout(() => {
						const headingAccordionItem = document.querySelector('.maxi-blocks-sc__type--heading');

						if (headingAccordionItem) {
							const accordionBtn = headingAccordionItem.querySelector('.maxi-accordion-control__item__button');

							if (accordionBtn) {
								const isExpanded = accordionBtn.getAttribute('aria-expanded') === 'true';
								if (!isExpanded) {
									accordionBtn.click();
								}

								setTimeout(() => {
									const headingPanel = headingAccordionItem.querySelector('.maxi-accordion-control__item__panel');
									if (headingPanel) {
										const tabButtons = Array.from(headingPanel.querySelectorAll('[role="tab"], button'));
										const targetTab = tabButtons.find(btn =>
											btn.textContent.trim().toLowerCase() === editorOptions.headingLevel.toLowerCase()
										);

										if (targetTab) {
											targetTab.click();
										}
									}
								}, 100);
							}
						} else {
							const allAccordionButtons = document.querySelectorAll('.maxi-accordion-control__item__button');

							for (const btn of allAccordionButtons) {
								if (btn.textContent.toLowerCase().includes('heading')) {
									btn.click();
									break;
								}
							}
						}
					}, 500);
				}
			}
		}, 300);

		if (result.createdNew) {
			return __('Created new Style Card. Review and save in the editor.', 'maxi-blocks');
		}
		return __('Style Card updated. Review and save in the editor.', 'maxi-blocks');
	};

	return { handleUpdateStyleCard, handleApplyTheme };
};
