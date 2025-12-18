/**
 * Internal dependencies
 */
import { processCss } from '@extensions/styles/store/controls';

/**
 * External dependencies
 */
import { times, compact } from 'lodash';

const styles = ['light', 'dark'];
const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const levels = ['p', ...headings];
const elements = ['button', ...levels, 'icon', 'divider', 'link', 'navigation'];
const breakpoints = {
	xxl: 1921,
	xl: 1920,
	l: 1366,
	m: 1024,
	s: 767,
	xs: 480,
};
const breakpointsKeys = ['general', ...Object.keys(breakpoints)];
const settings = [
	'font-family',
	'font-size',
	'font-style',
	'font-weight',
	'line-height',
	'text-decoration',
	'text-transform',
	'letter-spacing',
	'white-space',
	'word-spacing',
	'text-indent',
	'margin-bottom',
	'padding-bottom',
	'padding-top',
	'padding-left',
	'padding-right',
];

const getOrganizedValues = styleCard => {
	let organizedValues = {};

	styles.forEach(style => {
		elements.forEach(element => {
			breakpointsKeys.forEach(breakpoint => {
				settings.forEach(setting => {
					const label = `--maxi-${style}-${element}-${setting}-${breakpoint}`;

					if (styleCard[label]) {
						organizedValues = {
							...organizedValues,
							[style]: {
								...organizedValues?.[style],
								[element]: {
									...organizedValues[style]?.[element],
									[breakpoint]: {
										...organizedValues?.[style]?.[
											element
										]?.[breakpoint],
										[setting]: styleCard[label],
									},
								},
							},
						};

						delete styleCard[label];
					}
				});
			});
		});
	});

	// Colors
	styles.forEach(style => {
		times(8, i => {
			const label = `--maxi-${style}-color-${i + 1}`;

			if (styleCard[label]) {
				organizedValues = {
					...organizedValues,
					[style]: {
						...organizedValues?.[style],
						color: {
							...organizedValues?.[style]?.color,
							[i + 1]: styleCard[label],
						},
					},
				};

				delete styleCard[label];
			}
		});
	});

	return organizedValues;
};

const getLinkColorsString = ({ organizedValues, prefix, style }) => {
	let response = '';

	if (organizedValues[style]?.color) {
		times(8, i => {
			const colorNumber = i + 1;

			if (organizedValues[style]?.color[colorNumber]) {
				// Link color
				response += `${prefix} .maxi-${style}.maxi-sc-${style}-link-color-${colorNumber}.maxi-block--has-link { --maxi-${style}-link-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style}.maxi-sc-${style}-link-color-${colorNumber} a.maxi-block--has-link { --maxi-${style}-link-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style} .maxi-sc-${style}-link-color-${colorNumber}.maxi-block--has-link { --maxi-${style}-link-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style} .maxi-sc-${style}-link-color-${colorNumber} a.maxi-block--has-link { --maxi-${style}-link-palette: var(--maxi-${style}-color-${colorNumber});}`;

				// Link hover color
				response += `${prefix} .maxi-${style}.maxi-sc-${style}-link-hover-color-${colorNumber}.maxi-block--has-link { --maxi-${style}-link-hover-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style}.maxi-sc-${style}-link-hover-color-${colorNumber} a.maxi-block--has-link { --maxi-${style}-link-hover-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style} .maxi-sc-${style}-link-hover-color-${colorNumber}.maxi-block--has-link { --maxi-${style}-link-hover-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style} .maxi-sc-${style}-link-hover-color-${colorNumber} a.maxi-block--has-link { --maxi-${style}-link-hover-palette: var(--maxi-${style}-color-${colorNumber});}`;

				// Link active color
				response += `${prefix} .maxi-${style}.maxi-sc-${style}-link-active-color-${colorNumber}.maxi-block--has-link { --maxi-${style}-link-active-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style}.maxi-sc-${style}-link-active-color-${colorNumber} a.maxi-block--has-link { --maxi-${style}-link-active-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style} .maxi-sc-${style}-link-active-color-${colorNumber}.maxi-block--has-link { --maxi-${style}-link-active-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style} .maxi-sc-${style}-link-active-color-${colorNumber} a.maxi-block--has-link { --maxi-${style}-link-active-palette: var(--maxi-${style}-color-${colorNumber});}`;

				// Link visited color
				response += `${prefix} .maxi-${style}.maxi-sc-${style}-link-visited-color-${colorNumber}.maxi-block--has-link { --maxi-${style}-link-visited-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style}.maxi-sc-${style}-link-visited-color-${colorNumber} a.maxi-block--has-link { --maxi-${style}-link-visited-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style} .maxi-sc-${style}-link-visited-color-${colorNumber}.maxi-block--has-link { --maxi-${style}-link-visited-palette: var(--maxi-${style}-color-${colorNumber});}`;
				response += `${prefix} .maxi-${style} .maxi-sc-${style}-link-visited-color-${colorNumber} a.maxi-block--has-link { --maxi-${style}-link-visited-palette: var(--maxi-${style}-color-${colorNumber});}`;
			}
		});
	}

	return response;
};

const addStylesByBreakpoints = (addStylesByBreakpoint, isBackend) => {
	let addedResponse = '';

	// General
	addedResponse += addStylesByBreakpoint('general');

	// Media queries
	Object.entries(breakpoints).forEach(([breakpoint, breakpointValue]) => {
		if (isBackend)
			addedResponse += addStylesByBreakpoint(
				breakpoint,
				`.edit-post-visual-editor[maxi-blocks-responsive="${breakpoint}"]`
			);
		else {
			addedResponse += `@media (${
				breakpoint !== 'xxl' ? 'max' : 'min'
			}-width: ${breakpointValue}px) {`;
			addedResponse += addStylesByBreakpoint(breakpoint);
			addedResponse += '}';
		}
	});

	return addedResponse;
};

const getSentencesByBreakpoint = ({
	organizedValues,
	style,
	breakpoint,
	targets,
}) => {
	const sentences = targets.reduce((acc, target) => {
		acc[target] = compact(
			settings.map(setting => {
				const value =
					organizedValues?.[style]?.[target]?.[breakpoint]?.[setting];

				if (value)
					return `${setting}: var(--maxi-${style}-${target}-${setting}-${breakpoint});`;

				return null;
			})
		);

		return acc;
	}, {});

	return sentences;
};

const getMaxiSCStyles = ({ organizedValues, styleCard, prefix, style, isBackend }) => {
	let response = '';

	const addStylesByBreakpoint = (breakpoint, secondPrefix = '') => {
		let addedResponse = '';

		const breakpointLevelSentences = getSentencesByBreakpoint({
			organizedValues,
			style,
			breakpoint,
			targets: levels,
		});

		Object.entries({ ...breakpointLevelSentences }).forEach(
			([level, sentences]) => {
				const targets = [
					`${prefix} ${secondPrefix} .maxi-${style}.maxi-block.maxi-text-block`,
					`${prefix} ${secondPrefix} .maxi-${style} .maxi-block.maxi-text-block`,
					`${prefix} ${secondPrefix} .maxi-${style}.maxi-map-block__popup__content`,
					`${prefix} ${secondPrefix} .maxi-${style} .maxi-map-block__popup__content`,
					`${prefix} ${secondPrefix} .maxi-${style} .maxi-pane-block .maxi-pane-block__header`,
				];

				// Remove margin-bottom sentences
				const marginSentence = sentences?.find(
					sentence => sentence?.indexOf('margin-bottom') > -1
				);

				if (marginSentence)
					sentences?.splice(sentences?.indexOf(marginSentence), 1);

				// Only generate styles if there are non-empty sentences
				if (sentences?.length > 0) {
					const styles = sentences?.join(' ').trim();
					if (styles) {
						targets.forEach(target => {
							addedResponse += `${target} ${level} {${styles}}`;
						});
					}
				}

				if (marginSentence && marginSentence.trim()) {
					// margin-bottom for Text Maxi
					addedResponse += `${prefix} ${secondPrefix} .maxi-${style}.maxi-block.maxi-text-block ${level} {${marginSentence}}`;
					addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .maxi-block.maxi-text-block ${level} {${marginSentence}}`;
				}
			}
		);

		// Text Maxi list styles
		[
			`${prefix} ${secondPrefix} .maxi-${style}maxi-list-block ul.maxi-text-block__content`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-list-block ul.maxi-text-block__content`,
			`${prefix} ${secondPrefix} .maxi-${style}maxi-list-block ol.maxi-text-block__content`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-list-block ol.maxi-text-block__content`,
		].forEach(target => {
			const sentences = [...breakpointLevelSentences.p];

			const marginSentence = sentences?.find(
				sentence => sentence?.indexOf('margin-bottom') > -1
			);

			if (marginSentence && marginSentence.trim()) {
				addedResponse += `${target} {${marginSentence}}`;
			}
		});

		[
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-block.maxi-text-block li`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-block.maxi-text-block li`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-pagination a`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-pagination span.maxi-pagination__link--current`,
		].forEach(target => {
			const sentences = [...breakpointLevelSentences.p];

			// Remove margin-bottom sentences
			const marginSentence = sentences?.find(
				sentence => sentence?.indexOf('margin-bottom') > -1
			);

			if (marginSentence)
				sentences?.splice(sentences?.indexOf(marginSentence), 1);

			if (sentences?.length > 0) {
				const styles = sentences?.join(' ').trim();
				if (styles) {
					addedResponse += `${target} {${styles}}`;
				}
			}
		});

		// Text Maxi when has link
		const textMaxiLinkPrefix = `${prefix} ${secondPrefix} .maxi-${style}.maxi-block.maxi-block--has-link > .maxi-text-block__content:not(p)`;

		addedResponse += `${textMaxiLinkPrefix} { color: var(--maxi-${style}-link); }`;
		addedResponse += `${textMaxiLinkPrefix}:hover { color: var(--maxi-${style}-link-hover); }`;
		addedResponse += `${textMaxiLinkPrefix}:focus { color: var(--maxi-${style}-link-hover); }`;
		addedResponse += `${textMaxiLinkPrefix}:active { color: var(--maxi-${style}-link-active); }`;
		addedResponse += `${textMaxiLinkPrefix}:visited { color: var(--maxi-${style}-link-visited); }`;
		addedResponse += `${textMaxiLinkPrefix}:visited:hover { color: var(--maxi-${style}-link-hover); }`;

		[
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-block.maxi-text-block a.maxi-block--has-link`,
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-block .maxi-text-block a.maxi-block--has-link`,
		].forEach(target => {
			addedResponse += `${target} { color: var(--maxi-${style}-link); }`;
			addedResponse += `${target}:hover { color: var(--maxi-${style}-link-hover); }`;
			addedResponse += `${target}:hover span { color: var(--maxi-${style}-link-hover); }`;
			addedResponse += `${target}:focus { color: var(--maxi-${style}-link-hover); }`;
			addedResponse += `${target}:focus span { color: var(--maxi-${style}-link-hover); }`;
			addedResponse += `${target}:active { color: var(--maxi-${style}-link-active); }`;
			addedResponse += `${target}:active span { color: var(--maxi-${style}-link-active); }`;
			addedResponse += `${target}:visited { color: var(--maxi-${style}-link-visited); }`;
			addedResponse += `${target}:visited span { color: var(--maxi-${style}-link-visited); }`;
			addedResponse += `${target}:visited:hover { color: var(--maxi-${style}-link-hover); }`;
			addedResponse += `${target}:visited:hover span { color: var(--maxi-${style}-link-hover); }`;
		});

		// Image Maxi
		[
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-image-block .maxi-hover-details`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-image-block .maxi-hover-details`,
		].forEach(target => {
			const imageSentences = {
				h4: [...breakpointLevelSentences.h4],
				p: [...breakpointLevelSentences.p],
			};

			Object.entries(imageSentences).forEach(([level, sentences]) => {
				if (level !== 'p') {
					// Remove margin-bottom sentences
					const marginSentence = sentences?.find(
						sentence => sentence?.indexOf('margin-bottom') > -1
					);

					if (marginSentence)
						sentences?.splice(
							sentences?.indexOf(marginSentence),
							1
						);
				}

				if (sentences?.length > 0) {
					const styles = sentences?.join(' ').trim();
					if (styles) {
						addedResponse += `${target} ${level} {${styles}}`;
					}
				}
			});
		});

		// Image Maxi caption
		[
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-image-block figcaption`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-image-block figcaption`,
		].forEach(target => {
			const sentences = [...breakpointLevelSentences.p];

			// Remove margin-bottom sentences
			const marginSentence = sentences?.find(
				sentence => sentence?.indexOf('margin-bottom') > -1
			);

			if (marginSentence)
				sentences?.splice(sentences?.indexOf(marginSentence), 1);

			if (sentences?.length > 0) {
				const styles = sentences?.join(' ').trim();
				if (styles) {
					addedResponse += `${target} {${styles}}`;
				}
			}
		});

		// Search Maxi
		[
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-search-block .maxi-search-block__input`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-search-block .maxi-search-block__input`,
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-search-block .maxi-search-block__button__content`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-search-block .maxi-search-block__button__content`,
		].forEach(target => {
			const sentences = [...breakpointLevelSentences.p];

			// Remove margin-bottom sentences
			const marginSentence = sentences?.find(
				sentence => sentence?.indexOf('margin-bottom') > -1
			);

			if (marginSentence)
				sentences?.splice(sentences?.indexOf(marginSentence), 1);

			if (sentences?.length > 0) {
				const styles = sentences?.join(' ').trim();
				if (styles) {
					addedResponse += `${target} {${styles}}`;
				}
			}
		});

		// Button Maxi
		const buttonSentences = getSentencesByBreakpoint({
			organizedValues,
			style,
			breakpoint,
			targets: ['button'],
		});

		[
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-block.maxi-button-block .maxi-button-block__content`,
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-block .maxi-button-block .maxi-button-block__content`,
		].forEach(target => {
			const sentences = [...buttonSentences.button];

			// Set font-family paragraph variable as backup for the button font-family variables
			sentences.forEach((sentence, i) => {
				if (sentence?.includes('font-family')) {
					const pVar = sentence
						.replace('font-family: ', '')
						.replace('button', 'p')
						.replace(';', '');
					const newSentence = sentence.replace(')', `, ${pVar})`);

					sentences[i] = newSentence;
				}
			});

			if (
				!sentences?.some(sentence => sentence?.includes('font-family'))
			) {
				const pFontFamilyVar = [...breakpointLevelSentences.p]?.filter(
					sentence => sentence?.includes('font-family')
				)[0];

				if (pFontFamilyVar) {
					sentences?.push(pFontFamilyVar);
				}
			}

			// Remove margin-bottom sentences
			const marginSentence = sentences?.find(
				sentence => sentence?.indexOf('margin-bottom') > -1
			);

			if (marginSentence)
				sentences?.splice(sentences?.indexOf(marginSentence), 1);

			if (sentences?.length > 0) {
				const styles = sentences?.join(' ').trim();
				if (styles) {
					addedResponse += `${target} {${styles}}`;
				}
			}
		});

		// Button Maxi - apply border-radius to __button element
		const borderRadius = styleCard[`--maxi-${style}-button-border-radius`];
		const isGlobal = styleCard[`--maxi-${style}-button-border-radius-global`];

		if (borderRadius != null && borderRadius !== '') {
			const important = isGlobal ? ' !important' : '';

			// Define base selector parts once for maintainability
			const baseClass = `.maxi-${style}.maxi-block`;
			const btnClass = '.maxi-button-block .maxi-button-block__button';

			const targets = [
				`${prefix} ${secondPrefix} ${baseClass}.maxi-button-block ${btnClass}`,
				`${prefix} ${secondPrefix} ${baseClass} ${btnClass}`,
			];

			targets.forEach(target => {
				addedResponse += `${target} { border-radius: ${borderRadius}${important}; }`;
			});
		}

		// Navigation inside Maxi Container
		const navigationSentences = getSentencesByBreakpoint({
			organizedValues,
			style,
			breakpoint,
			targets: ['navigation'],
		});

		const targetItem = `${prefix} ${secondPrefix} .maxi-${style}.maxi-container-block .wp-block-navigation .wp-block-navigation__container .wp-block-navigation-item`;
		const sentences = [...navigationSentences.navigation];

		// Remove margin-bottom sentences
		const marginSentence = sentences?.find(
			sentence => sentence?.indexOf('margin-bottom') > -1
		);

		if (marginSentence)
			sentences?.splice(sentences?.indexOf(marginSentence), 1);

		if (sentences?.length > 0) {
			const styles = sentences?.join(' ').trim();
			if (styles) {
				addedResponse += `${targetItem} {${styles}}`;
			}
		}

		const targetLink = `${targetItem} a`;
		const targetButton = `${targetItem} button`;

		[targetLink, targetButton].forEach(target => {
			addedResponse += `${target} { color: var(--maxi-${style}-menu-item); transition: color 0.3s 0s ease;}`;
			addedResponse += `${target} span { color: var(--maxi-${style}-menu-item); transition: color 0.3s 0s ease; }`;
			addedResponse += `${target} + span { color: var(--maxi-${style}-menu-item); transition: color 0.3s 0s ease;}`;
			addedResponse += `${target} + button { color: var(--maxi-${style}-menu-item); transition: color 0.3s 0s ease;}`;

			addedResponse += `${target}:hover { color: var(--maxi-${style}-menu-item-hover); }`;
			addedResponse += `${target}:hover span { color: var(--maxi-${style}-menu-item-hover); }`;
			addedResponse += `${target}:hover + span { color: var(--maxi-${style}-menu-item-hover); }`;
			addedResponse += `${target}:hover + button { color: var(--maxi-${style}-menu-item-hover); }`;
		});

		addedResponse += `${targetLink}:focus { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLink}:focus span { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLink}:focus + span { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLink}:focus + button { color: var(--maxi-${style}-menu-item-hover); }`;

		addedResponse += `${targetLink}:visited { color: var(--maxi-${style}-menu-item-visited); }`;
		addedResponse += `${targetLink}:visited span { color: var(--maxi-${style}-menu-item-visited); }`;
		addedResponse += `${targetLink}:visited + span { color: var(--maxi-${style}-menu-item-visited); }`;
		addedResponse += `${targetLink}:visited + button { color: var(--maxi-${style}-menu-item-visited); }`;

		addedResponse += `${targetLink}:visited:hover { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLink}:visited:hover span { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLink}:visited:hover + span { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLink}:visited:hover + button { color: var(--maxi-${style}-menu-item-hover); }`;

		const targetLinkCurrent = `${targetItem}.current-menu-item > a`;

		addedResponse += `${targetLinkCurrent} { color: var(--maxi-${style}-menu-item-current); }`;
		addedResponse += `${targetLinkCurrent} span { color: var(--maxi-${style}-menu-item-current); }`;
		addedResponse += `${targetLinkCurrent} + span { color: var(--maxi-${style}-menu-item-current); }`;
		addedResponse += `${targetLinkCurrent} + button { color: var(--maxi-${style}-menu-item-current); }`;

		addedResponse += `${targetLinkCurrent}:hover { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLinkCurrent}:hover span { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLinkCurrent}:hover + span { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLinkCurrent}:hover + button { color: var(--maxi-${style}-menu-item-hover); }`;

		addedResponse += `${targetLinkCurrent}:focus { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLinkCurrent}:focus span { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLinkCurrent}:focus + span { color: var(--maxi-${style}-menu-item-hover); }`;
		addedResponse += `${targetLinkCurrent}:focus + button { color: var(--maxi-${style}-menu-item-hover); }`;

		// mobile menu icon / text
		const burgerItem = `${prefix} ${secondPrefix} .maxi-${style}.maxi-container-block .wp-block-navigation button.wp-block-navigation__responsive-container-open`;
		const burgerItemClose = `${prefix} ${secondPrefix} .maxi-${style}.maxi-container-block .wp-block-navigation button.wp-block-navigation__responsive-container-close`;

		[burgerItem, burgerItemClose].forEach(target => {
			addedResponse += `${target} { color: var(--maxi-${style}-menu-burger); }`;
			sentences.forEach((sentence, i) => {
				if (sentence?.includes('font-family')) {
					addedResponse += `${target} { font-family: var(--maxi-${style}-navigation-font-family-general); }`;
				}
			});
		});

		// mobile menu background
		const mobileMenuBgTarget = `${prefix} ${secondPrefix} .maxi-${style}.maxi-container-block .wp-block-navigation .wp-block-navigation__responsive-container.has-modal-open`;

		addedResponse += `${mobileMenuBgTarget} { background-color: var(--maxi-${style}-menu-mobile-bg) !important; }`;

		// sub-menus
		const subMenuTarget = `${prefix} ${secondPrefix} .maxi-${style}.maxi-container-block .wp-block-navigation .wp-block-navigation__container ul li`;
		const subMenuTargetEditor = `${prefix} ${secondPrefix} .maxi-${style}.maxi-container-block .wp-block-navigation .wp-block-navigation__container .wp-block-navigation__submenu-container > div`;

		addedResponse += `${subMenuTarget} { background-color: var(--maxi-${style}-menu-item-sub-bg); }`;
		addedResponse += `${subMenuTarget}:hover { background-color: var(--maxi-${style}-menu-item-sub-bg-hover); }`;

		addedResponse += `${subMenuTargetEditor} { background-color: var(--maxi-${style}-menu-item-sub-bg) !important;  }`;
		addedResponse += `${subMenuTargetEditor}:hover { background-color: var(--maxi-${style}-menu-item-sub-bg-hover) !important; }`;

		[subMenuTarget, subMenuTargetEditor].forEach(target => {
			addedResponse += `${target}.current-menu-item { background-color: var(--maxi-${style}-menu-item-sub-bg-current); }`;
			addedResponse += `${target}.current-menu-item:hover { background-color: var(--maxi-${style}-menu-item-sub-bg-hover); }`;
		});

		return addedResponse;
	};

	response += addStylesByBreakpoints(addStylesByBreakpoint, isBackend);

	return response;
};

const getWPNativeStyles = ({
	organizedValues,
	styleCard,
	prefix,
	style,
	isBackend,
}) => {
	let response = '';
	const nativeWPPrefix = isBackend
		? 'wp-block[data-type^="core/"]'
		: 'maxi-block--use-sc';

	const addStylesByBreakpoint = (breakpoint, secondPrefix = '') => {
		let addedResponse = '';

		const breakpointLevelSentences = getSentencesByBreakpoint({
			organizedValues,
			style,
			breakpoint,
			targets: levels,
		});

		Object.entries({ ...breakpointLevelSentences }).forEach(
			([level, sentences]) => {
				// Remove margin-bottom sentences
				const marginSentence = sentences?.find(
					sentence => sentence?.indexOf('margin-bottom') > -1
				);

				if (marginSentence)
					sentences?.splice(sentences?.indexOf(marginSentence), 1);

				const selectors = compact([
					`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} ${level}`,
					`${prefix} ${secondPrefix} .maxi-${style} ${level}.${nativeWPPrefix}`,
					`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} ${level} a`,
					`${prefix} ${secondPrefix} .maxi-${style} ${level}.${nativeWPPrefix} a`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} div:has(> a, > time > a):not(.wp-element-button):not(.wp-block-navigation-item):not(.maxi-group-block)`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .wp-block-comments  div:not(.wp-element-button):not(.wp-block-navigation-item):not(.maxi-group-block)`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-block-post-comments-form .comment-form textarea`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-block-post-comments-form .comment-form p:not(.form-submit) input`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-block-post-comments-form .comment-reply-title small a`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-post-comments-form .comment-form textarea`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-post-comments-form .comment-form p:not(.form-submit) input`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-post-comments-form .comment-reply-title small a`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-post-navigation-link a`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-query-pagination-previous`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-query-pagination-next`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-query-pagination-numbers a`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-query-pagination-numbers span`,
				]).join(', ');

				if (selectors && sentences?.length > 0) {
					const styles = sentences?.join(' ').trim();
					if (styles) {
						addedResponse += `${selectors} {${styles}}`;
					}
				}

				// fix for .has-small-font-size
				if (level === 'p') {
					addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .wp-block-comments div:has(> a, > time > a):not(.wp-element-button):not(.wp-block-navigation-item):not(.maxi-group-block).has-small-font-size {font-size: inherit !important;}`;
					addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .wp-block-comments div:not(.wp-element-button):not(.wp-block-navigation-item):not(.maxi-group-block).has-small-font-size {font-size: inherit !important;}`;
				}

				// In case the level is paragraph, we add the same styles for lists
				if (level === 'p' && sentences?.length > 0) {
					const styles = sentences?.join(' ').trim();
					if (styles) {
						addedResponse += `${prefix} ${secondPrefix} .maxi-${style} li.${nativeWPPrefix} {${styles}}`;
					}
				}

				// In case the level is paragraph, we add the same styles for span data-rich-text-placeholder on backend
				if (
					level === 'p' &&
					style === 'light' &&
					sentences?.length > 0
				) {
					const styles = sentences?.join(' ').trim();
					if (styles) {
						addedResponse += `${prefix} ${secondPrefix} p > span[data-rich-text-placeholder]::after {${styles}}`;
					}
				}

				// In case the level is H1, we add the same styles the backends titles
				if (
					level === 'h1' &&
					style === 'light' &&
					sentences?.length > 0
				) {
					const styles = sentences?.join(' ').trim();
					if (styles) {
						addedResponse += `${prefix} .editor-editor-canvas__post-title-wrapper > h1.editor-post-title {${styles}}`;
					}
				}

				// Adds margin-bottom sentence to all elements except the last one
				if (marginSentence && marginSentence.trim() && selectors) {
					addedResponse += `:is(${selectors}):not(:last-child) {
						${marginSentence}
					}`;
				}
			}
		);

		// WP native block when has link
		const WPNativeLinkPrefix = `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} a`;

		['', ' span'].forEach(suffix => {
			addedResponse += `${WPNativeLinkPrefix}${suffix} { color: var(--maxi-${style}-link); }`;
			if (styleCard[`--maxi-${style}-link-hover`]) {
				addedResponse += `${WPNativeLinkPrefix}${suffix}:hover { color: var(--maxi-${style}-link-hover); }`;
				addedResponse += `${WPNativeLinkPrefix}${suffix}:focus { color: var(--maxi-${style}-link-hover); }`;
			}
			if (styleCard[`--maxi-${style}-link-active`]) {
				addedResponse += `${WPNativeLinkPrefix}${suffix}:active { color: var(--maxi-${style}-link-active); }`;
			}
			if (styleCard[`--maxi-${style}-link-visited`]) {
				addedResponse += `${WPNativeLinkPrefix}${suffix}:visited { color: var(--maxi-${style}-link-visited); }`;
				if (styleCard[`--maxi-${style}-link-hover`]) {
					addedResponse += `${WPNativeLinkPrefix}${suffix}:visited:hover { color: var(--maxi-${style}-link-hover); }`;
				}
			}
		});

		// Button Maxi
		const buttonSentences = [
			...getSentencesByBreakpoint({
				organizedValues,
				style,
				breakpoint,
				targets: ['button'],
			}).button,
		];

		// Set font-family paragraph variable as backup for the button font-family variables
		buttonSentences.forEach((sentence, i) => {
			if (sentence?.includes('font-family')) {
				const pVar = sentence
					.replace('font-family: ', '')
					.replace('button', 'p')
					.replace(';', '');
				const newSentence = sentence.replace(')', `, ${pVar})`);

				buttonSentences[i] = newSentence;
			}
		});

		if (
			!buttonSentences?.some(sentence =>
				sentence?.includes('font-family')
			)
		) {
			const pFontFamilyVar = [...breakpointLevelSentences.p]?.filter(
				sentence => sentence?.includes('font-family')
			)[0];

			if (pFontFamilyVar) {
				buttonSentences?.push(pFontFamilyVar);
			}
		}

		// Remove margin-bottom sentences
		const marginSentence = buttonSentences?.find(
			sentence => sentence?.indexOf('margin-bottom') > -1
		);

		if (marginSentence)
			buttonSentences?.splice(
				buttonSentences?.indexOf(marginSentence),
				1
			);

		if (styleCard[`--maxi-${style}-button-border-radius`] != null) {
			const borderRadiusGlobal = styleCard[`--maxi-${style}-button-border-radius-global`];
			const important = borderRadiusGlobal ? ' !important' : '';
			buttonSentences?.push(
				`border-radius: ${styleCard[`--maxi-${style}-button-border-radius`]}${important};`
			);
		}

		if (buttonSentences?.length > 0) {
			const styles = buttonSentences?.join(' ').trim();
			if (styles) {
				addedResponse += `${`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-element-button`} {${[
					...buttonSentences,
					styleCard[`--maxi-${style}-button-color`]
						? `color: var(--maxi-${style}-button-color);`
						: `color: var(--maxi-${style}-p-color,rgba(var(--maxi-${style}-color-3,155,155,155),1));`,
				]?.join(' ')}}`;
			}
		}

		if (styleCard[`--maxi-${style}-button-color`]) {
			addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-block-post-comments-form .comment-form p.form-submit input {
				color: var(--maxi-${style}-button-color);
			}`;
		}

		if (styleCard[`--maxi-${style}-button-color-hover`]) {
			addedResponse += `${`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-element-button:hover`} {
				color: var(--maxi-${style}-button-color-hover);
			}`;
		}

		// General color
		addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}, ${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-block-post-comments-form .comment-reply-title small {
			color: var(--maxi-${style}-p-color,rgba(var(--maxi-${style}-color-3,155,155,155),1));
		}`;

		// Headings color
		headings.forEach(heading => {
			addedResponse += `${prefix} ${secondPrefix} .maxi-${style} ${heading}.${nativeWPPrefix}, ${prefix} .maxi-${style} .${nativeWPPrefix} ${heading} {
				color: var(--maxi-${style}-${heading}-color,rgba(var(--maxi-${style}-color-5,0,0,0),1));
			}`;
		});

		// backend page / post title
		addedResponse += `${prefix} .editor-editor-canvas__post-title-wrapper > h1.editor-post-title {
			color: var(--maxi-light-h1-color,rgba(var(--maxi-light-color-5,0,0,0),1));
		}`;

		// Button color
		addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-element-button {
			background: var(--maxi-${style}-button-background-color,rgba(var(--maxi-${style}-color-4,255,74,23),1));
		}`;

		// Button color hover
		if (styleCard[`--maxi-${style}-button-background-color-hover`]) {
			addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-element-button:hover {
				background: var(--maxi-${style}-button-background-color-hover);
			}`;
		}

		// Remove form textarea background
		addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-block-post-comments-form .comment-form textarea {
				background: transparent;
				color: inherit;
				max-width: 100%;
		}`;

		addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-post-comments-form .comment-form textarea {
			background: transparent;
			color: inherit;
			max-width: 100%;
		}`;

		// Remove form input background
		addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-block-post-comments-form .comment-form p:not(.form-submit) input {
			background: transparent;
			color: inherit;
			max-width: 100%;
		}`;

		addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix}.wp-block-post-comments-form .comment-form p:not(.form-submit) input {
			background: transparent;
			color: inherit;
			max-width: 100%;
		}`;

		return addedResponse;
	};

	response += addStylesByBreakpoints(addStylesByBreakpoint, isBackend);

	return response;
};

/**
 * Giving a style card object, returns the CSS styles for SC for each block.
 */
const getSCStyles = (
	rawStyleCard,
	gutenbergBlocksStatus,
	isBackend = false
) => {
	const styleCard = { ...rawStyleCard };

	let response = '';
	const prefix = 'body.maxi-blocks--active';

	const organizedValues = getOrganizedValues(styleCard);

	// Create styles
	styles.forEach(style => {
		// Link colors
		response += getLinkColorsString({ organizedValues, prefix, style });

		// Maxi styles
		response += getMaxiSCStyles({
			organizedValues,
			styleCard,
			prefix,
			style,
			isBackend,
		});

		// WP native blocks styles
		if (gutenbergBlocksStatus) {
			response += getWPNativeStyles({
				organizedValues,
				styleCard,
				prefix,
				style,
				isBackend,
			});
		}
	});

	return processCss(response);
};

export default getSCStyles;
