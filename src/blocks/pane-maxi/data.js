/**
 * Internal dependencies
 */
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

const headerPrefix = 'header-';
const contentPrefix = 'content-';

/**
 * Data object
 */
const name = 'pane-maxi';
const copyPasteMapping = {
	settings: {
		Border: {
			template: 'border',
		},
		'Box shadow': {
			template: 'boxShadow',
		},
		Size: {
			template: 'size',
		},
		'Margin/Padding': {
			template: 'marginPadding',
		},
	},
	canvas: {
		Size: {
			template: 'size',
		},
		Background: {
			template: 'blockBackground',
		},
		Border: {
			template: 'border',
		},
		'Box shadow': {
			template: 'boxShadow',
		},
		Opacity: {
			template: 'opacity',
		},
		'Margin/Padding': {
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
				label: 'pane',
				target: `${normalPaneTarget}.maxi-block`,
			},
			hover: {
				label: 'pane on hover',
				target: `.maxi-block${normalPaneTarget}:hover`,
			},
			active: {
				label: 'pane on active state',
				target: `.maxi-block${activePaneTarget}`,
			},
		},
		'before pane': {
			normal: {
				label: 'pane ::before',
				target: `.wp-block-maxi-blocks-pane-maxi${normalPaneTarget}::before`,
			},
			hover: {
				label: 'pane ::before on hover',
				target: `.wp-block-maxi-blocks-pane-maxi${normalPaneTarget}:hover::before`,
			},
			active: {
				label: 'pane ::before on active state',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block::before`,
			},
		},
		'after pane': {
			normal: {
				label: 'pane ::after',
				target: `.wp-block-maxi-blocks-pane-maxi${normalPaneTarget}::after`,
			},
			hover: {
				label: 'pane ::after on hover',
				target: `.wp-block-maxi-blocks-pane-maxi${normalPaneTarget}:hover::after`,
			},
			active: {
				label: 'pane ::after on active state',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block::after`,
			},
		},
		'pane header': {
			normal: {
				label: 'pane header',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header`,
			},
			hover: {
				label: 'pane header on hover',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header:hover`,
			},
			active: {
				label: 'pane header on active state',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header`,
			},
		},
		'before header': {
			normal: {
				label: 'pane header ::before',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header::before`,
			},
			hover: {
				label: 'pane header ::before on hover',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header:hover::before`,
			},
			active: {
				label: 'pane header ::before on active state',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header::before`,
			},
		},
		'after header': {
			normal: {
				label: 'pane header ::after',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header::after`,
			},
			hover: {
				label: 'pane header ::after on hover',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header:hover::after`,
			},
			active: {
				label: 'pane header ::after on active state',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__header::after`,
			},
		},
		'header content': {
			normal: {
				label: 'header content',
				target: `${normalPaneTarget} .maxi-pane-block__header-content`,
			},
			hover: {
				label: 'header content on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header-content:hover`,
			},
			active: {
				label: 'header content on active state',
				target: `${activePaneTarget} .maxi-pane-block__header-content`,
			},
		},
		'header line': {
			normal: {
				label: 'header line',
				target: `${normalPaneTarget} .maxi-pane-block__header-line`,
			},
			hover: {
				label: 'header line on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header-line:hover`,
			},
			active: {
				label: 'header line on active state',
				target: `${activePaneTarget} .maxi-pane-block__header-line`,
			},
		},
		'content line': {
			normal: {
				label: 'content line',
				target: `${normalPaneTarget} .maxi-pane-block__content-line`,
			},
			hover: {
				label: 'content line on hover',
				target: `${normalPaneTarget} .maxi-pane-block__content-line:hover`,
			},
			active: {
				label: 'content line on active state',
				target: `${activePaneTarget} .maxi-pane-block__content-line`,
			},
		},
		'before header content': {
			normal: {
				label: 'accordion pane header content::before',
				target: `${normalPaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content::before`,
			},
			hover: {
				label: 'accordion pane header content::before on hover',
				target: `${normalPaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content:hover::before`,
			},
			active: {
				label: 'accordion pane header content::before on active state',
				target: `${activePaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content::before`,
			},
		},
		'after header content': {
			normal: {
				label: 'accordion pane header content::after',
				target: `${normalPaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content::after`,
			},
			hover: {
				label: 'pane header content::after on hover',
				target: `${normalPaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content:hover::after`,
			},
			active: {
				label: 'pane header content::after on active state',
				target: `${activePaneTarget}.maxi-block.wp-block-maxi-blocks-pane-maxi .maxi-pane-block__header .maxi-pane-block__header-content::after`,
			},
		},
		'pane icon': {
			normal: {
				label: 'icon',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon`,
			},
			svg: {
				label: "icon's svg",
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg`,
			},
			insideSvg: {
				label: 'everything inside svg (svg > *)',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg > *`,
			},
			path: {
				label: "svg's path",
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg path`,
			},
			hover: {
				label: 'icon on hover',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon:hover`,
			},
			hoverSvg: {
				label: "icon's svg on hover",
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon:hover svg`,
			},
			hoverInsideSvg: {
				label: 'everything inside svg on hover (:hover svg > *)',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon:hover svg > *`,
			},
			hoverPath: {
				label: "svg's path on hover",
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon:hover svg path`,
			},
			active: {
				label: 'active icon',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon`,
			},
			activeSvg: {
				label: "active icon's svg",
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg`,
			},
			activeInsideSvg: {
				label: 'everything inside active svg (svg > *)',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg > *`,
			},
			activePath: {
				label: "active svg's path",
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__icon svg path`,
			},
		},
		'before icon': {
			normal: {
				label: 'icon ::before',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon::before`,
			},
			hover: {
				label: 'icon ::before on hover',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon:hover::before`,
			},
			active: {
				label: 'icon ::before on active state',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon::before`,
			},
		},
		'after icon': {
			normal: {
				label: 'icon ::after',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon::after`,
			},
			hover: {
				label: 'icon ::after on hover',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon:hover::after`,
			},
			active: {
				label: 'icon ::after on active state',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__icon::after`,
			},
		},
		'pane content': {
			normal: {
				label: 'pane content',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__content`,
			},
			hover: {
				label: 'pane content on hover',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__content:hover`,
			},
			active: {
				label: 'pane content on active state',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block  .maxi-pane-block__content`,
			},
		},
		'before content': {
			normal: {
				label: 'pane content ::before',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content::before`,
			},
			hover: {
				label: 'pane content ::before on hover',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content:hover::before`,
			},
			active: {
				label: 'pane content ::before on active state',
				target: `${activePaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content::before`,
			},
		},
		'after content': {
			normal: {
				label: 'pane content ::after',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content::after`,
			},
			hover: {
				label: 'pane content ::after on hover',
				target: `${normalPaneTarget}.wp-block-maxi-blocks-pane-maxi.maxi-block.maxi-pane-block .maxi-pane-block__content:hover::after`,
			},
			active: {
				label: 'pane content ::after on active state',
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
			title: 'Border',
			target: ' .maxi-pane-block__header',
			property: 'border',
			hoverProp: [
				`${headerPrefix}border-status-hover`,
				`${headerPrefix}border-status-active`,
			],
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-pane-block__header',
			property: 'box-shadow',
			hoverProp: [
				`${headerPrefix}box-shadow-status-hover`,
				`${headerPrefix}box-shadow-status-active`,
			],
		},
		background: {
			title: 'Background',
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
			title: 'Border',
			target: ' .maxi-pane-block__content',
			property: 'border',
			hoverProp: [
				`${contentPrefix}border-status-hover`,
				`${contentPrefix}border-status-active`,
			],
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-pane-block__content',
			property: 'box-shadow',
			hoverProp: [
				`${contentPrefix}box-shadow-status-hover`,
				`${contentPrefix}box-shadow-status-active`,
			],
		},
		background: {
			title: 'Background',
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

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	targets,
	ariaLabelsCategories,
};
export default data;
