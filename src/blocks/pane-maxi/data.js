/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

const headerPrefix = 'header-';
const contentPrefix = 'content-';

/**
 * Data object
 */
const name = 'pane-maxi';
const copyPasteMapping = {
	settings: {
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
	canvas: {
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
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
		[__('Opacity', 'maxi-blocks')]: {
			template: 'opacity',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
	},
};

const normalPaneTarget = '.maxi-pane-block[aria-expanded]';
const activePaneTarget = '.maxi-pane-block[aria-expanded=true]';

const targets = {
	normalPaneTarget,
	activePaneTarget,
};

const customCss = {
	selectors: {
		pane: {
			normal: {
				label: __('pane', 'maxi-blocks'),
				target: `${normalPaneTarget}.maxi-block`,
			},
			hover: {
				label: __('pane on hover', 'maxi-blocks'),
				target: `.maxi-block${normalPaneTarget}:hover`,
			},
			active: {
				label: __('pane on active state', 'maxi-blocks'),
				target: `.maxi-block${activePaneTarget}`,
			},
		},
		'before pane': {
			normal: {
				label: __('pane ::before', 'maxi-blocks'),
				target: `.wp-block-maxi-blocks-pane-maxi${normalPaneTarget}::before`,
			},
			hover: {
				label: __('pane ::before on hover', 'maxi-blocks'),
				target: `.wp-block-maxi-blocks-pane-maxi${normalPaneTarget}:hover::before`,
			},
			active: {
				label: __('pane ::before on active state', 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block::before`,
			},
		},
		'after pane': {
			normal: {
				label: __('pane ::after', 'maxi-blocks'),
				target: `.wp-block-maxi-blocks-pane-maxi${normalPaneTarget}::after`,
			},
			hover: {
				label: __('pane ::after on hover', 'maxi-blocks'),
				target: `.wp-block-maxi-blocks-pane-maxi${normalPaneTarget}:hover::after`,
			},
			active: {
				label: __('pane ::after on active state', 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block::after`,
			},
		},
		'pane header': {
			normal: {
				label: __('pane header', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header`,
			},
			hover: {
				label: __('pane header on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header:hover`,
			},
			active: {
				label: __('pane header on active state', 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header`,
			},
		},
		'before header': {
			normal: {
				label: __('pane header ::before', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header::before`,
			},
			hover: {
				label: __('pane header ::before on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header:hover::before`,
			},
			active: {
				label: __(
					'pane header ::before on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header::before`,
			},
		},
		'after header': {
			normal: {
				label: __('pane header ::after', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header::after`,
			},
			hover: {
				label: __('pane header ::after on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header:hover::after`,
			},
			active: {
				label: __('pane header ::after on active state', 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header::after`,
			},
		},
		'header content': {
			normal: {
				label: __('header content', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header-content`,
			},
			hover: {
				label: __('header content on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header-content:hover`,
			},
			active: {
				label: __('header content on active state', 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__header-content`,
			},
		},
		'header line': {
			normal: {
				label: __('header line', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header-line`,
			},
			hover: {
				label: __('header line on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__header-line:hover`,
			},
			active: {
				label: __('header line on active state', 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__header-line`,
			},
		},
		'content line': {
			normal: {
				label: __('content line', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__content-line`,
			},
			hover: {
				label: __('content line on hover', 'maxi-blocks'),
				target: `${normalPaneTarget} .maxi-pane-block__content-line:hover`,
			},
			active: {
				label: __('content line on active state', 'maxi-blocks'),
				target: `${activePaneTarget} .maxi-pane-block__content-line`,
			},
		},
		'before header content': {
			normal: {
				label: __(
					'accordion pane header content::before',
					'maxi-blocks'
				),
				target: `${normalPaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content::before`,
			},
			hover: {
				label: __(
					'accordion pane header content::before on hover',
					'maxi-blocks'
				),
				target: `${normalPaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content:hover::before`,
			},
			active: {
				label: __(
					'accordion pane header content::before on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content::before`,
			},
		},
		'after header content': {
			normal: {
				label: __(
					'accordion pane header content::after',
					'maxi-blocks'
				),
				target: `${normalPaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content::after`,
			},
			hover: {
				label: __('pane header content::after on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content:hover::after`,
			},
			active: {
				label: __(
					'pane header content::after on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content::after`,
			},
		},
		'pane icon': {
			normal: {
				label: __('icon', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon`,
			},
			svg: {
				label: __("icon's svg", 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg`,
			},
			insideSvg: {
				label: __('everything inside svg (svg > *)', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg > *`,
			},
			path: {
				label: __("svg's path", 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg path`,
			},
			hover: {
				label: __('icon on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon:hover`,
			},
			hoverSvg: {
				label: __("icon's svg on hover", 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon:hover svg`,
			},
			hoverInsideSvg: {
				label: __(
					'everything inside svg on hover (:hover svg > *)',
					'maxi-blocks'
				),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon:hover svg > *`,
			},
			hoverPath: {
				label: __("svg's path on hover", 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon:hover svg path`,
			},
			active: {
				label: __('active icon', 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon`,
			},
			activeSvg: {
				label: __("active icon's svg", 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg`,
			},
			activeInsideSvg: {
				label: __(
					'everything inside active svg (svg > *)',
					'maxi-blocks'
				),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg > *`,
			},
			activePath: {
				label: __("active svg's path", 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg path`,
			},
		},
		'before icon': {
			normal: {
				label: __('icon ::before', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon::before`,
			},
			hover: {
				label: __('icon ::before on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon:hover::before`,
			},
			active: {
				label: __('icon ::before on active state', 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon::before`,
			},
		},
		'after icon': {
			normal: {
				label: __('icon ::after', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon::after`,
			},
			hover: {
				label: __('icon ::after on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon:hover::after`,
			},
			active: {
				label: __('icon ::after on active state', 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon::after`,
			},
		},
		'pane content': {
			normal: {
				label: __('pane content', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__content`,
			},
			hover: {
				label: __('pane content on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__content:hover`,
			},
			active: {
				label: __('pane content on active state', 'maxi-blocks'),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__content`,
			},
		},
		'before content': {
			normal: {
				label: __('pane content ::before', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content::before`,
			},
			hover: {
				label: __('pane content ::before on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content:hover::before`,
			},
			active: {
				label: __(
					'pane content ::before on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content::before`,
			},
		},
		'after content': {
			normal: {
				label: __('pane content ::after', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content::after`,
			},
			hover: {
				label: __('pane content ::after on hover', 'maxi-blocks'),
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content:hover::after`,
			},
			active: {
				label: __(
					'pane content ::after on active state',
					'maxi-blocks'
				),
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content::after`,
			},
		},
	},
	categories: [
		'pane',
		'before pane',
		'after pane',
		'pane header',
		'before header',
		'after header',
		'header content',
		'header line',
		'content line',
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
const ariaLabelsCategories = ['pane', 'header', 'content', 'icon'];
const transition = {
	pane: {
		...transitionDefault.canvas,
	},
	header: {
		border: {
			title: __('Border', 'maxi-blocks'),
			target: ' .maxi-pane-block__header',
			property: 'border',
			hoverProp: [
				`${headerPrefix}border-status-hover`,
				`${headerPrefix}border-status-active`,
			],
		},
		'box shadow': {
			title: __('Box shadow', 'maxi-blocks'),
			target: ' .maxi-pane-block__header',
			property: 'box-shadow',
			hoverProp: [
				`${headerPrefix}box-shadow-status-hover`,
				`${headerPrefix}box-shadow-status-active`,
			],
		},
		background: {
			title: __('Background', 'maxi-blocks'),
			target: ' .maxi-pane-block__header',
			property: 'background',
			hoverProp: [
				`${headerPrefix}background-status-hover`,
				`${headerPrefix}background-status-active`,
			],
		},
	},
	content: {
		border: {
			title: __('Border', 'maxi-blocks'),
			target: ' .maxi-pane-block__content',
			property: 'border',
			hoverProp: [
				`${contentPrefix}border-status-hover`,
				`${contentPrefix}border-status-active`,
			],
		},
		'box shadow': {
			title: __('Box shadow', 'maxi-blocks'),
			target: ' .maxi-pane-block__content',
			property: 'box-shadow',
			hoverProp: [
				`${contentPrefix}box-shadow-status-hover`,
				`${contentPrefix}box-shadow-status-active`,
			],
		},
		background: {
			title: __('Background', 'maxi-blocks'),
			target: ' .maxi-pane-block__content',
			property: 'background',
			hoverProp: [
				`${contentPrefix}background-status-hover`,
				`${contentPrefix}background-status-active`,
			],
		},
	},
};
const interactionBuilderSettings = {
	block: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const inlineStylesTargets = {
	block: '',
	header: `${normalPaneTarget} .maxi-pane-block__header`,
	content: `${normalPaneTarget} .maxi-pane-block__content`,
	activeHeader: `${activePaneTarget} .maxi-pane-block__header`,
	activeContent: `${activePaneTarget} .maxi-pane-block__content`,
};

const attributesToStyles = {
	'header-border-top-width': {
		target: inlineStylesTargets.header,
		property: 'border-top-width',
	},
	'header-border-right-width': {
		target: inlineStylesTargets.header,
		property: 'border-right-width',
	},
	'header-border-bottom-width': {
		target: inlineStylesTargets.header,
		property: 'border-bottom-width',
	},
	'header-border-left-width': {
		target: inlineStylesTargets.header,
		property: 'border-left-width',
	},
	'header-border-top-left-radius': {
		target: inlineStylesTargets.header,
		property: 'border-top-left-radius',
	},
	'header-border-top-right-radius': {
		target: inlineStylesTargets.header,
		property: 'border-top-right-radius',
	},
	'header-border-bottom-right-radius': {
		target: inlineStylesTargets.header,
		property: 'border-bottom-right-radius',
	},
	'header-border-bottom-left-radius': {
		target: inlineStylesTargets.header,
		property: 'border-bottom-left-radius',
	},
	'header-active-border-top-width': {
		target: inlineStylesTargets.activeHeader,
		property: 'border-top-width',
	},
	'header-active-border-right-width': {
		target: inlineStylesTargets.activeHeader,
		property: 'border-right-width',
	},
	'header-active-border-bottom-width': {
		target: inlineStylesTargets.activeHeader,
		property: 'border-bottom-width',
	},
	'header-active-border-left-width': {
		target: inlineStylesTargets.activeHeader,
		property: 'border-left-width',
	},
	'header-active-border-top-left-radius': {
		target: inlineStylesTargets.activeHeader,
		property: 'border-top-left-radius',
	},
	'header-active-border-top-right-radius': {
		target: inlineStylesTargets.activeHeader,
		property: 'border-top-right-radius',
	},
	'header-active-border-bottom-right-radius': {
		target: inlineStylesTargets.activeHeader,
		property: 'border-bottom-right-radius',
	},
	'header-active-border-bottom-left-radius': {
		target: inlineStylesTargets.activeHeader,
		property: 'border-bottom-left-radius',
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
	'header-margin-top': {
		target: inlineStylesTargets.header,
		property: 'margin-top',
	},
	'header-margin-right': {
		target: inlineStylesTargets.header,
		property: 'margin-right',
	},
	'header-margin-bottom': {
		target: inlineStylesTargets.header,
		property: 'margin-bottom',
	},
	'header-margin-left': {
		target: inlineStylesTargets.header,
		property: 'margin-left',
	},
	'header-padding-top': {
		target: inlineStylesTargets.header,
		property: 'padding-top',
	},
	'header-padding-right': {
		target: inlineStylesTargets.header,
		property: 'padding-right',
	},
	'header-padding-bottom': {
		target: inlineStylesTargets.header,
		property: 'padding-bottom',
	},
	'header-padding-left': {
		target: inlineStylesTargets.header,
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
	'header-width': {
		target: inlineStylesTargets.header,
		property: 'width',
	},
	'header-height': {
		target: inlineStylesTargets.header,
		property: 'height',
	},
	'header-min-width': {
		target: inlineStylesTargets.header,
		property: 'min-width',
	},
	'header-min-height': {
		target: inlineStylesTargets.header,
		property: 'min-height',
	},
	'header-max-width': {
		target: inlineStylesTargets.header,
		property: 'max-width',
	},
	'header-max-height': {
		target: inlineStylesTargets.header,
		property: 'max-height',
	},
	'content-border-top-width': {
		target: inlineStylesTargets.content,
		property: 'border-top-width',
	},
	'content-border-right-width': {
		target: inlineStylesTargets.content,
		property: 'border-right-width',
	},
	'content-border-bottom-width': {
		target: inlineStylesTargets.content,
		property: 'border-bottom-width',
	},
	'content-border-left-width': {
		target: inlineStylesTargets.content,
		property: 'border-left-width',
	},
	'content-border-top-left-radius': {
		target: inlineStylesTargets.content,
		property: 'border-top-left-radius',
	},
	'content-border-top-right-radius': {
		target: inlineStylesTargets.content,
		property: 'border-top-right-radius',
	},
	'content-border-bottom-right-radius': {
		target: inlineStylesTargets.content,
		property: 'border-bottom-right-radius',
	},
	'content-border-bottom-left-radius': {
		target: inlineStylesTargets.content,
		property: 'border-bottom-left-radius',
	},
	'content-active-border-top-width': {
		target: inlineStylesTargets.activeContent,
		property: 'border-top-width',
	},
	'content-active-border-right-width': {
		target: inlineStylesTargets.activeContent,
		property: 'border-right-width',
	},
	'content-active-border-bottom-width': {
		target: inlineStylesTargets.activeContent,
		property: 'border-bottom-width',
	},
	'content-active-border-left-width': {
		target: inlineStylesTargets.activeContent,
		property: 'border-left-width',
	},
	'content-active-border-top-left-radius': {
		target: inlineStylesTargets.activeContent,
		property: 'border-top-left-radius',
	},
	'content-active-border-top-right-radius': {
		target: inlineStylesTargets.activeContent,
		property: 'border-top-right-radius',
	},
	'content-active-border-bottom-right-radius': {
		target: inlineStylesTargets.activeContent,
		property: 'border-bottom-right-radius',
	},
	'content-active-border-bottom-left-radius': {
		target: inlineStylesTargets.activeContent,
		property: 'border-bottom-left-radius',
	},
	'content-margin-top': {
		target: inlineStylesTargets.content,
		property: 'margin-top',
	},
	'content-margin-right': {
		target: inlineStylesTargets.content,
		property: 'margin-right',
	},
	'content-margin-bottom': {
		target: inlineStylesTargets.content,
		property: 'margin-bottom',
	},
	'content-margin-left': {
		target: inlineStylesTargets.content,
		property: 'margin-left',
	},
	'content-padding-top': {
		target: inlineStylesTargets.content,
		property: 'padding-top',
	},
	'content-padding-right': {
		target: inlineStylesTargets.content,
		property: 'padding-right',
	},
	'content-padding-bottom': {
		target: inlineStylesTargets.content,
		property: 'padding-bottom',
	},
	'content-padding-left': {
		target: inlineStylesTargets.content,
		property: 'padding-left',
	},
	'content-width': {
		target: inlineStylesTargets.content,
		property: 'width',
	},
	'content-height': {
		target: inlineStylesTargets.content,
		property: 'height',
	},
	'content-min-width': {
		target: inlineStylesTargets.content,
		property: 'min-width',
	},
	'content-min-height': {
		target: inlineStylesTargets.content,
		property: 'min-height',
	},
	'content-max-width': {
		target: inlineStylesTargets.content,
		property: 'max-width',
	},
	'content-max-height': {
		target: inlineStylesTargets.content,
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
	targets,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
