/**
 * Internal dependencies
 */
import { processCss } from '../styles/store/controls';

/**
 * External dependencies
 */
import { times, compact } from 'lodash';

const styles = ['light', 'dark'];
const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const levels = ['p', ...headings];
const elements = ['button', ...levels, 'icon', 'divider', 'link'];
const breakpoints = {
	xxl: 1921,
	xl: 1920,
	l: 1366,
	m: 1024,
	s: 768,
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
	'margin-bottom',
	'text-indent',
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

const getMaxiSCStyles = ({ organizedValues, prefix, style, isBackend }) => {
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

				targets.forEach(target => {
					addedResponse += `${target} ${level} {${sentences?.join(
						' '
					)}}`;
				});

				if (marginSentence) {
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

			if (marginSentence) addedResponse += `${target} ${marginSentence}`;
		});

		[
			`${prefix} ${secondPrefix} .maxi-${style}.maxi-block.maxi-text-block li`,
			`${prefix} ${secondPrefix} .maxi-${style} .maxi-block.maxi-text-block li`,
		].forEach(target => {
			const sentences = [...breakpointLevelSentences.p];

			// Remove margin-bottom sentences
			const marginSentence = sentences?.find(
				sentence => sentence?.indexOf('margin-bottom') > -1
			);

			if (marginSentence)
				sentences?.splice(sentences?.indexOf(marginSentence), 1);

			addedResponse += `${target} {${sentences?.join(' ')}}`;
		});

		// Text Maxi when has link
		const textMaxiLinkPrefix = `${prefix} ${secondPrefix} .maxi-${style}.maxi-block.maxi-block--has-link .maxi-text-block__content`;

		addedResponse += `${textMaxiLinkPrefix} { color: var(--maxi-${style}-link); }`;
		addedResponse += `${textMaxiLinkPrefix}:hover { color: var(--maxi-${style}-link-hover); }`;
		addedResponse += `${textMaxiLinkPrefix}:focus { color: var(--maxi-${style}-link-hover); }`;
		addedResponse += `${textMaxiLinkPrefix}:active { color: var(--maxi-${style}-link-active); }`;
		addedResponse += `${textMaxiLinkPrefix}:visited { color: var(--maxi-${style}-link-visited); }`;

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

				addedResponse += `${target} ${level} {${sentences?.join(' ')}}`;
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

			addedResponse += `${target} {${sentences?.join(' ')}}`;
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

			addedResponse += `${target} {${sentences?.join(' ')}}`;
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

				sentences?.push(pFontFamilyVar);
			}

			// Remove margin-bottom sentences
			const marginSentence = sentences?.find(
				sentence => sentence?.indexOf('margin-bottom') > -1
			);

			if (marginSentence)
				sentences?.splice(sentences?.indexOf(marginSentence), 1);

			addedResponse += `${target} {${sentences?.join(' ')}}`;
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

				const selectors = [
					`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} ${level}`,
					`${prefix} ${secondPrefix} .maxi-${style} ${level}.${nativeWPPrefix}`,
					`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} ${level} a`,
					`${prefix} ${secondPrefix} .maxi-${style} ${level}.${nativeWPPrefix} a`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} div:has(> a, > time > a):not(.wp-element-button)`,
					level === 'p' &&
						`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-block-post-comments-form .comment-form textarea`,
				].join(', ');

				addedResponse += `${selectors} {${sentences?.join(' ')}}`;

				// In case the level is paragraph, we add the same styles for lists
				if (level === 'p')
					addedResponse += `${prefix} ${secondPrefix} .maxi-${style} li.${nativeWPPrefix} {${sentences?.join(
						' '
					)}}`;

				// Adds margin-bottom sentence to all elements except the last one
				if (marginSentence)
					addedResponse += `:is(${selectors}):not(:last-child) {
						${marginSentence}
					}`;
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

			buttonSentences?.push(pFontFamilyVar);
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

		addedResponse += `${`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-element-button`} {${[
			...buttonSentences,
			styleCard[`--maxi-${style}-button-color`]
				? `color: var(--maxi-${style}-button-color);`
				: `color: var(--maxi-${style}-p-color,rgba(var(--maxi-${style}-color-3,155,155,155),1));`,
		]?.join(' ')}}`;

		if (styleCard[`--maxi-${style}-button-color-hover`]) {
			addedResponse += `${`${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} .wp-element-button:hover`} {
				color: var(--maxi-${style}-button-color-hover);
			}`;
		}

		// General color
		addedResponse += `${prefix} ${secondPrefix} .maxi-${style} .${nativeWPPrefix} {
			color: var(--maxi-${style}-p-color,rgba(var(--maxi-${style}-color-3,155,155,155),1));
		}`;

		// Headings color
		headings.forEach(heading => {
			addedResponse += `${prefix} ${secondPrefix} .maxi-${style} ${heading}.${nativeWPPrefix}, ${prefix} .maxi-${style} .${nativeWPPrefix} ${heading} {
				color: var(--maxi-${style}-${heading}-color,rgba(var(--maxi-${style}-color-5,0,0,0),1));
			}`;
		});

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
		}`;

		return addedResponse;
	};

	response += addStylesByBreakpoints(addStylesByBreakpoint, isBackend);

	return response;
};

/**
 * Giving a style card object, returns the CSS styles for SC for each block.
 */
const getSCStyles = async (
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
