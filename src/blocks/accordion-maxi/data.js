/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import { createIconTransitions } from '@extensions/styles';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';
import { targets as paneTargets } from '@blocks/pane-maxi/data';

/**
 * Data object
 */
const name = 'accordion-maxi';
const copyPasteMapping = {
	_exclude: ['icon-content', 'active-icon-content'],
	settings: {
		[__('Accordion settings', 'maxi-blocks')]: {
			group: {
				[__('Accordion layout', 'maxi-blocks')]: 'accordionLayout',
				[__('Collapsible', 'maxi-blocks')]: 'isCollapsible',
				[__('Pane closes when another opens', 'maxi-blocks')]:
					'autoPaneClose',
				[__('Pane spacing', 'maxi-blocks')]: {
					props: ['pane-spacing', 'pane-spacing-unit'],
					hasBreakpoints: true,
				},
				[__('Animation duration', 'maxi-blocks')]: 'animationDuration',
			},
		},
		[__('Accordion line', 'maxi-blocks')]: {
			groupAttributes: 'accordionLine',
		},
		[__('Accordion title', 'maxi-blocks')]: {
			groupAttributes: 'accordionTitle',
		},
		[__('Icon', 'maxi-blocks')]: { groupAttributes: 'accordionIcon' },
		[__('Active icon', 'maxi-blocks')]: {
			groupAttributes: 'accordionIcon',
			prefix: 'active-',
		},
		[__('Background', 'maxi-blocks')]: {
			template: 'blockBackground',
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
		},
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
	},
};

const { normalPaneTarget, activePaneTarget } = paneTargets;

const customCss = {
	selectors: {
		...createSelectors({
			accordion: '.maxi-accordion-block',
		}),
		'before accordion': {
			normal: {
				label: __('before', 'maxi-blocks'),
				target: '.maxi-accordion-block::before',
			},
			hover: {
				label: __('::before on hover', 'maxi-blocks'),
				target: '.maxi-accordion-block:hover::before',
			},
		},
		'after accordion': {
			normal: {
				label: __('after', 'maxi-blocks'),
				target: '.maxi-accordion-block::after',
			},
			hover: {
				label: __('::after on hover', 'maxi-blocks'),
				target: '.maxi-accordion-block:hover::after',
			},
		},
		pane: {
			normal: {
				label: __('pane', 'maxi-blocks'),
				target: ' .maxi-pane-block',
			},
			hover: {
				label: __('pane on hover', 'maxi-blocks'),
				target: ' .maxi-pane-block:hover',
			},
			active: {
				label: __('pane on active state', 'maxi-blocks'),
				target: ` ${activePaneTarget}`,
			},
		},
		'before pane': {
			normal: {
				label: __('pane ::before', 'maxi-blocks'),
				target: ' .maxi-pane-block::before',
			},
			hover: {
				label: __('pane ::before on hover', 'maxi-blocks'),
				target: ' .maxi-pane-block:hover::before',
			},
			active: {
				label: __('pane ::before on active state', 'maxi-blocks'),
				target: ` ${activePaneTarget}::before`,
			},
		},
		'after pane': {
			normal: {
				label: __('pane ::after', 'maxi-blocks'),
				target: ' .maxi-pane-block::after',
			},
			hover: {
				label: __('pane ::after on hover', 'maxi-blocks'),
				target: ' .maxi-pane-block:hover::after',
			},
			active: {
				label: __('pane ::after on active state', 'maxi-blocks'),
				target: ` ${activePaneTarget}::after`,
			},
		},
		'pane header': {
			normal: {
				label: __('pane header', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header`,
			},
			hover: {
				label: __('pane header on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header:hover`,
			},
			active: {
				label: __('pane header on active state', 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__header`,
			},
		},
		'before header': {
			normal: {
				label: __('pane header ::before', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header::before`,
			},
			hover: {
				label: __('pane header ::before on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header:hover::before`,
			},
			active: {
				label: __(
					'pane header ::before on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget} .maxi-pane-block__header::before`,
			},
		},
		'after header': {
			normal: {
				label: __('pane header ::after', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header::after`,
			},
			hover: {
				label: __('pane header ::after on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header:hover::after`,
			},
			active: {
				label: __('pane header ::after on active state', 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__header::after`,
			},
		},
		'before header content': {
			normal: {
				label: __('pane header content::before', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header-content::before`,
			},
			hover: {
				label: __(
					'pane header content::before on hover',
					'maxi-blocks'
				),
				target: `${normalPaneTarget} .maxi-pane-block__header-content:hover::before`,
			},
			active: {
				label: __(
					'pane header content::before on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget} .maxi-pane-block__header-content::before`,
			},
		},
		'after header content': {
			normal: {
				label: __('pane header content::after', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header-content::after`,
			},
			hover: {
				label: __('pane header content::after on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header-content:hover::after`,
			},
			active: {
				label: __(
					'pane header content::after on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget} .maxi-pane-block__header-content::after`,
			},
		},
		'pane icon': {
			normal: {
				label: __('icon', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon`,
			},
			svg: {
				label: __("icon's svg", 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon svg`,
			},
			insideSvg: {
				label: __('everything inside svg (svg > *)', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon svg > *`,
			},
			path: {
				label: __("svg's path", 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon svg path`,
			},
			hover: {
				label: __('icon on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover`,
			},
			hoverSvg: {
				label: __("icon's svg on hover", 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover svg`,
			},
			hoverInsideSvg: {
				label: __(
					'everything inside svg on hover (:hover svg > *)',
					'maxi-blocks'
				),
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover svg > *`,
			},
			hoverPath: {
				label: __("svg's path on hover", 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover svg path`,
			},
			active: {
				label: __('active icon', 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__icon`,
			},
			activeSvg: {
				label: __("active icon's svg", 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__icon svg`,
			},
			activeInsideSvg: {
				label: __(
					'everything inside active svg (svg > *)',
					'maxi-blocks'
				),
				target: `${activePaneTarget} .maxi-pane-block__icon svg > *`,
			},
			activePath: {
				label: __("active svg's path", 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__icon svg path`,
			},
		},
		'before icon': {
			normal: {
				label: __('icon ::before', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon::before`,
			},
			hover: {
				label: __('icon ::before on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover::before`,
			},
			active: {
				label: __('icon ::before on active state', 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__icon::before`,
			},
		},
		'after icon': {
			normal: {
				label: __('icon ::after', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon::after`,
			},
			hover: {
				label: __('icon ::after on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover::after`,
			},
			active: {
				label: __('icon ::after on active state', 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__icon::after`,
			},
		},
		'pane content': {
			normal: {
				label: __('pane content', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__content`,
			},
			hover: {
				label: __('pane content on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__content:hover`,
			},
			active: {
				label: __('pane content active state', 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__content`,
			},
		},
		'before content': {
			normal: {
				label: __('pane content ::before', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__content::before`,
			},
			hover: {
				label: __('pane content ::before on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__content:hover::before`,
			},
			active: {
				label: __(
					'pane content ::before on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget} .maxi-pane-block__content::before`,
			},
		},
		'after content': {
			normal: {
				label: __('pane content ::after', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__content::after`,
			},
			hover: {
				label: __('pane content ::after on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__content:hover::after`,
			},
			active: {
				label: __(
					'pane content ::after on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget} .maxi-pane-block__content::after`,
			},
		},
		'pane header content': {
			normal: {
				label: __('header content', 'maxi-blocks'),
				target: ` ${normalPaneTarget} .maxi-pane-block__header-content`,
			},
			hover: {
				label: __('header content on hover', 'maxi-blocks'),
				target: ` ${normalPaneTarget} .maxi-pane-block__header-content:hover`,
			},
			active: {
				label: __('header content on active state', 'maxi-blocks'),
				target: ` ${activePaneTarget} .maxi-pane-block__header-content`,
			},
		},
		'pane header line': {
			normal: {
				label: __('header line', 'maxi-blocks'),
				target: ` ${normalPaneTarget} .maxi-pane-block__header-line`,
			},
			hover: {
				label: __('header line on hover', 'maxi-blocks'),
				target: ` ${normalPaneTarget} .maxi-pane-block__header-line:hover`,
			},
			active: {
				label: __('header line on active state', 'maxi-blocks'),
				target: ` ${activePaneTarget} .maxi-pane-block__header-line`,
			},
		},
		'pane content line': {
			normal: {
				label: __('content line', 'maxi-blocks'),
				target: ` ${normalPaneTarget} .maxi-pane-block__content-line`,
			},
			hover: {
				label: __('content line on hover', 'maxi-blocks'),
				target: ` ${normalPaneTarget} .maxi-pane-block__content-line:hover`,
			},
			active: {
				label: __('content line on active state', 'maxi-blocks'),
				target: ` ${activePaneTarget} .maxi-pane-block__content-line`,
			},
		},
	},
	categories: [
		'accordion',
		'before accordion',
		'after accordion',
		'pane',
		'before pane',
		'after pane',
		'pane header',
		'before header',
		'after header',
		'pane header content',
		'pane header line',
		'pane content line',
		'pane content',
		'before content',
		'after content',
		'before header content',
		'after header content',
		'pane icon',
		'before icon',
		'after icon',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = ['accordion'];
const transition = {
	...transitionDefault,
	block: {
		'header line': {
			title: __('Header line', 'maxi-blocks'),
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__line',
			hoverProp: 'header-line-status-hover',
			limitless: true,
		},
		'content line': {
			title: __('Content line', 'maxi-blocks'),
			target: ' > .maxi-pane-block > .maxi-pane-block__content-wrapper > .maxi-pane-block__line-container .maxi-pane-block__line',
			hoverProp: 'content-line-status-hover',
			limitless: true,
		},
		'pane title': {
			title: __('Pane title', 'maxi-blocks'),
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__title',
			property: false,
			hoverProp: [
				'title-typography-status-hover',
				'title-typography-status-active',
			],
		},
		'pane title background': {
			title: __('Pane title background', 'maxi-blocks'),
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__header-content',
			property: 'background-color',
			hoverProp: 'title-background-status-hover',
		},
		...createIconTransitions({
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__icon',
			prefix: 'icon-',
			titlePrefix: 'icon',
		}),
	},
};
const interactionBuilderSettings = {
	block: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const inlineStylesTargets = {
	block: '',
	headerLine: `> ${normalPaneTarget} > .maxi-pane-block__header > .maxi-pane-block__header-line-container > .maxi-pane-block__header-line`,
	activeHeaderLine: `> ${activePaneTarget} > .maxi-pane-block__header > .maxi-pane-block__header-line-container > .maxi-pane-block__header-line`,
	contentLine: `> ${normalPaneTarget} > .maxi-pane-block__content-line-container > .maxi-pane-block__content-line`,
	activeContentLine: `> ${activePaneTarget} > .maxi-pane-block__content-line-container > .maxi-pane-block__content-line`,
	contentWrapper: '> .maxi-pane-block > .maxi-pane-block__content-wrapper',
	icon: `> ${normalPaneTarget} > .maxi-pane-block__header .maxi-pane-block__icon`,
	activeIcon: `> ${activePaneTarget} > .maxi-pane-block__header .maxi-pane-block__icon`,
	iconPath: `> ${normalPaneTarget} > .maxi-pane-block__header  .maxi-pane-block__icon svg path`,
	activeIconPath: `> ${activePaneTarget} > .maxi-pane-block__header  .maxi-pane-block__icon svg path`,
	title: `> ${normalPaneTarget} > .maxi-pane-block__header .maxi-pane-block__title`,
	activeTitle: `> ${activePaneTarget} > .maxi-pane-block__header .maxi-pane-block__title`,
};

const attributesToStyles = {
	'active-icon-stroke': {
		target: inlineStylesTargets.activeIconPath,
		property: 'stroke-width',
		isMultiplySelector: true,
	},
	'active-icon-border-top-left-radius': {
		target: inlineStylesTargets.activeIcon,
		property: 'border-top-left-radius',
		isMultiplySelector: true,
	},
	'active-icon-border-top-right-radius': {
		target: inlineStylesTargets.activeIcon,
		property: 'border-top-right-radius',
		isMultiplySelector: true,
	},
	'active-icon-border-bottom-right-radius': {
		target: inlineStylesTargets.activeIcon,
		property: 'border-bottom-right-radius',
		isMultiplySelector: true,
	},
	'active-icon-border-bottom-left-radius': {
		target: inlineStylesTargets.activeIcon,
		property: 'border-bottom-left-radius',
		isMultiplySelector: true,
	},
	'active-icon-border-top-width': {
		target: inlineStylesTargets.activeIcon,
		property: 'border-top-width',
		isMultiplySelector: true,
	},
	'active-icon-border-bottom-width': {
		target: inlineStylesTargets.activeIcon,
		property: 'border-bottom-width',
		isMultiplySelector: true,
	},
	'active-icon-border-right-width': {
		target: inlineStylesTargets.activeIcon,
		property: 'border-right-width',
		isMultiplySelector: true,
	},
	'active-icon-border-left-width': {
		target: inlineStylesTargets.activeIcon,
		property: 'border-left-width',
		isMultiplySelector: true,
	},
	'icon-stroke': {
		target: inlineStylesTargets.iconPath,
		property: 'stroke-width',
		isMultiplySelector: true,
	},
	'icon-border-top-left-radius': {
		target: inlineStylesTargets.icon,
		property: 'border-top-left-radius',
		isMultiplySelector: true,
	},
	'icon-border-top-right-radius': {
		target: inlineStylesTargets.icon,
		property: 'border-top-right-radius',
		isMultiplySelector: true,
	},
	'icon-border-bottom-right-radius': {
		target: inlineStylesTargets.icon,
		property: 'border-bottom-right-radius',
		isMultiplySelector: true,
	},
	'icon-border-bottom-left-radius': {
		target: inlineStylesTargets.icon,
		property: 'border-bottom-left-radius',
		isMultiplySelector: true,
	},
	'icon-border-top-width': {
		target: inlineStylesTargets.icon,
		property: 'border-top-width',
		isMultiplySelector: true,
	},
	'icon-border-bottom-width': {
		target: inlineStylesTargets.icon,
		property: 'border-bottom-width',
		isMultiplySelector: true,
	},
	'icon-border-right-width': {
		target: inlineStylesTargets.icon,
		property: 'border-right-width',
		isMultiplySelector: true,
	},
	'icon-border-left-width': {
		target: inlineStylesTargets.icon,
		property: 'border-left-width',
		isMultiplySelector: true,
	},
	'title-font-size': {
		target: inlineStylesTargets.title,
		property: 'font-size',
		isMultiplySelector: true,
	},
	'title-line-height': {
		target: inlineStylesTargets.title,
		property: 'line-height',
		isMultiplySelector: true,
	},
	'title-letter-spacing': {
		target: inlineStylesTargets.title,
		property: 'letter-spacing',
		isMultiplySelector: true,
	},
	'title-text-indent': {
		target: inlineStylesTargets.title,
		property: 'text-indent',
		isMultiplySelector: true,
	},
	'title-word-spacing': {
		target: inlineStylesTargets.title,
		property: 'word-spacing',
		isMultiplySelector: true,
	},
	'title-bottom-gap': {
		target: inlineStylesTargets.title,
		property: 'margin-bottom',
		isMultiplySelector: true,
	},
	'active-title-font-size': {
		target: inlineStylesTargets.activeTitle,
		property: 'font-size',
		isMultiplySelector: true,
	},
	'active-title-line-height': {
		target: inlineStylesTargets.activeTitle,
		property: 'line-height',
		isMultiplySelector: true,
	},
	'active-title-letter-spacing': {
		target: inlineStylesTargets.activeTitle,
		property: 'letter-spacing',
		isMultiplySelector: true,
	},
	'active-title-text-indent': {
		target: inlineStylesTargets.activeTitle,
		property: 'text-indent',
		isMultiplySelector: true,
	},
	'active-title-word-spacing': {
		target: inlineStylesTargets.activeTitle,
		property: 'word-spacing',
		isMultiplySelector: true,
	},
	'active-title-bottom-gap': {
		target: inlineStylesTargets.activeTitle,
		property: 'margin-bottom',
		isMultiplySelector: true,
	},
	'header-divider-border-top-width': {
		target: inlineStylesTargets.headerLine,
		property: 'border-bottom-width',
		isMultiplySelector: true,
	},
	'header-divider-width': {
		target: inlineStylesTargets.headerLine,
		property: 'width',
		isMultiplySelector: true,
	},
	'header-active-divider-border-top-width': {
		target: inlineStylesTargets.activeHeaderLine,
		property: 'border-bottom-width',
		isMultiplySelector: true,
	},
	'header-active-divider-width': {
		target: inlineStylesTargets.activeHeaderLine,
		property: 'width',
		isMultiplySelector: true,
	},
	'content-divider-border-top-width': {
		target: inlineStylesTargets.contentLine,
		property: 'border-bottom-width',
		isMultiplySelector: true,
	},
	'content-divider-width': {
		target: inlineStylesTargets.contentLine,
		property: 'width',
		isMultiplySelector: true,
	},
	'content-active-divider-border-top-width': {
		target: inlineStylesTargets.activeContentLine,
		property: 'border-bottom-width',
		isMultiplySelector: true,
	},
	'content-active-divider-width': {
		target: inlineStylesTargets.activeContentLine,
		property: 'width',
		isMultiplySelector: true,
	},
	'border-top-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-left-radius',
	},
	'border-top-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-right-radius',
	},
	'border-bottom-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-right-radius',
	},
	'border-bottom-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-left-radius',
	},
	'border-top-width': {
		target: inlineStylesTargets.block,
		property: 'border-top-width',
	},
	'border-right-width': {
		target: inlineStylesTargets.block,
		property: 'border-right-width',
	},
	'border-bottom-width': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-width',
	},
	'border-left-width': {
		target: inlineStylesTargets.block,
		property: 'border-left-width',
	},
	opacity: {
		target: inlineStylesTargets.block,
		property: 'opacity',
	},
	'flex-grow': {
		target: inlineStylesTargets.block,
		property: 'flex-grow',
	},
	'flex-shrink': {
		target: inlineStylesTargets.block,
		property: 'flex-shrink',
	},
	'row-gap': {
		target: inlineStylesTargets.block,
		property: 'row-gap',
	},
	'column-gap': {
		target: inlineStylesTargets.block,
		property: 'column-gap',
	},
	order: {
		target: inlineStylesTargets.block,
		property: 'order',
	},
	'margin-top': {
		target: inlineStylesTargets.block,
		property: 'margin-top',
	},
	'margin-right': {
		target: inlineStylesTargets.block,
		property: 'margin-right',
	},
	'margin-bottom': {
		target: inlineStylesTargets.block,
		property: 'margin-bottom',
	},
	'margin-left': {
		target: inlineStylesTargets.block,
		property: 'margin-left',
	},
	'padding-top': {
		target: inlineStylesTargets.block,
		property: 'padding-top',
	},
	'padding-right': {
		target: inlineStylesTargets.block,
		property: 'padding-right',
	},
	'padding-bottom': {
		target: inlineStylesTargets.block,
		property: 'padding-bottom',
	},
	'padding-left': {
		target: inlineStylesTargets.block,
		property: 'padding-left',
	},
	'position-top': {
		target: inlineStylesTargets.block,
		property: 'top',
	},
	'position-right': {
		target: inlineStylesTargets.block,
		property: 'right',
	},
	'position-bottom': {
		target: inlineStylesTargets.block,
		property: 'bottom',
	},
	'position-left': {
		target: inlineStylesTargets.block,
		property: 'left',
	},
	width: {
		target: inlineStylesTargets.block,
		property: 'width',
	},
	height: {
		target: inlineStylesTargets.block,
		property: 'height',
	},
	'min-width': {
		target: inlineStylesTargets.block,
		property: 'min-width',
	},
	'min-height': {
		target: inlineStylesTargets.block,
		property: 'min-height',
	},
	'max-width': {
		target: inlineStylesTargets.block,
		property: 'max-width',
	},
	'max-height': {
		target: inlineStylesTargets.block,
		property: 'max-height',
	},
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
