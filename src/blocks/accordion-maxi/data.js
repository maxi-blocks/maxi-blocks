/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import { createIconTransitions } from '@extensions/styles';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';
import { targets as paneTargets } from '@blocks/pane-maxi/data';

/**
 * Data object
 */
const name = 'accordion-maxi';
const copyPasteMapping = {
	_exclude: ['icon-content', 'active-icon-content'],
	settings: {
		'Accordion settings': {
			group: {
				'Accordion layout': 'accordionLayout',
				Collapsible: 'isCollapsible',
				'Pane closes when another opens': 'autoPaneClose',
				'Pane spacing': {
					props: ['pane-spacing', 'pane-spacing-unit'],
					hasBreakpoints: true,
				},
				'Animation duration': 'animationDuration',
			},
		},
		'Accordion line': { groupAttributes: 'accordionLine' },
		'Accordion title': { groupAttributes: 'accordionTitle' },
		Icon: { groupAttributes: 'accordionIcon' },
		'Active icon': { groupAttributes: 'accordionIcon', prefix: 'active-' },
		Background: {
			template: 'blockBackground',
		},
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
				label: 'before',
				target: '.maxi-accordion-block::before',
			},
			hover: {
				label: '::before on hover',
				target: '.maxi-accordion-block:hover::before',
			},
		},
		'after accordion': {
			normal: {
				label: 'after',
				target: '.maxi-accordion-block::after',
			},
			hover: {
				label: '::after on hover',
				target: '.maxi-accordion-block:hover::after',
			},
		},
		pane: {
			normal: {
				label: 'pane',
				target: ' .maxi-pane-block',
			},
			hover: {
				label: 'pane on hover',
				target: ' .maxi-pane-block:hover',
			},
			active: {
				label: 'pane on active state',
				target: ` ${activePaneTarget}`,
			},
		},
		'before pane': {
			normal: {
				label: 'pane ::before',
				target: ' .maxi-pane-block::before',
			},
			hover: {
				label: 'pane ::before on hover',
				target: ' .maxi-pane-block:hover::before',
			},
			active: {
				label: 'pane ::before on active state',
				target: ` ${activePaneTarget}::before`,
			},
		},
		'after pane': {
			normal: {
				label: 'pane ::after',
				target: ' .maxi-pane-block::after',
			},
			hover: {
				label: 'pane ::after on hover',
				target: ' .maxi-pane-block:hover::after',
			},
			active: {
				label: 'pane ::after on active state',
				target: ` ${activePaneTarget}::after`,
			},
		},
		'pane header': {
			normal: {
				label: 'pane header',
				target: `${normalPaneTarget} .maxi-pane-block__header`,
			},
			hover: {
				label: 'pane header on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header:hover`,
			},
			active: {
				label: 'pane header on active state',
				target: `${activePaneTarget} .maxi-pane-block__header`,
			},
		},
		'before header': {
			normal: {
				label: 'pane header ::before',
				target: `${normalPaneTarget} .maxi-pane-block__header::before`,
			},
			hover: {
				label: 'pane header ::before on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header:hover::before`,
			},
			active: {
				label: 'pane header ::before on active state',
				target: `${activePaneTarget} .maxi-pane-block__header::before`,
			},
		},
		'after header': {
			normal: {
				label: 'pane header ::after',
				target: `${normalPaneTarget} .maxi-pane-block__header::after`,
			},
			hover: {
				label: 'pane header ::after on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header:hover::after`,
			},
			active: {
				label: 'pane header ::after on active state',
				target: `${activePaneTarget} .maxi-pane-block__header::after`,
			},
		},
		'before header content': {
			normal: {
				label: 'pane header content::before',
				target: `${normalPaneTarget} .maxi-pane-block__header-content::before`,
			},
			hover: {
				label: 'pane header content::before on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header-content:hover::before`,
			},
			active: {
				label: 'pane header content::before on active state',
				target: `${activePaneTarget} .maxi-pane-block__header-content::before`,
			},
		},
		'after header content': {
			normal: {
				label: 'pane header content::after',
				target: `${normalPaneTarget} .maxi-pane-block__header-content::after`,
			},
			hover: {
				label: 'pane header content::after on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header-content:hover::after`,
			},
			active: {
				label: 'pane header content::after on active state',
				target: `${activePaneTarget} .maxi-pane-block__header-content::after`,
			},
		},
		'pane icon': {
			normal: {
				label: 'icon',
				target: `${normalPaneTarget} .maxi-pane-block__icon`,
			},
			svg: {
				label: "icon's svg",
				target: `${normalPaneTarget} .maxi-pane-block__icon svg`,
			},
			insideSvg: {
				label: 'everything inside svg (svg > *)',
				target: `${normalPaneTarget} .maxi-pane-block__icon svg > *`,
			},
			path: {
				label: "svg's path",
				target: `${normalPaneTarget} .maxi-pane-block__icon svg path`,
			},
			hover: {
				label: 'icon on hover',
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover`,
			},
			hoverSvg: {
				label: "icon's svg on hover",
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover svg`,
			},
			hoverInsideSvg: {
				label: 'everything inside svg on hover (:hover svg > *)',
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover svg > *`,
			},
			hoverPath: {
				label: "svg's path on hover",
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover svg path`,
			},
			active: {
				label: 'active icon',
				target: `${activePaneTarget} .maxi-pane-block__icon`,
			},
			activeSvg: {
				label: "active icon's svg",
				target: `${activePaneTarget} .maxi-pane-block__icon svg`,
			},
			activeInsideSvg: {
				label: 'everything inside active svg (svg > *)',
				target: `${activePaneTarget} .maxi-pane-block__icon svg > *`,
			},
			activePath: {
				label: "active svg's path",
				target: `${activePaneTarget} .maxi-pane-block__icon svg path`,
			},
		},
		'before icon': {
			normal: {
				label: 'icon ::before',
				target: `${normalPaneTarget} .maxi-pane-block__icon::before`,
			},
			hover: {
				label: 'icon ::before on hover',
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover::before`,
			},
			active: {
				label: 'icon ::before on active state',
				target: `${activePaneTarget} .maxi-pane-block__icon::before`,
			},
		},
		'after icon': {
			normal: {
				label: 'icon ::after',
				target: `${normalPaneTarget} .maxi-pane-block__icon::after`,
			},
			hover: {
				label: 'icon ::after on hover',
				target: `${normalPaneTarget} .maxi-pane-block__icon:hover::after`,
			},
			active: {
				label: 'icon ::after on active state',
				target: `${activePaneTarget} .maxi-pane-block__icon::after`,
			},
		},
		'pane content': {
			normal: {
				label: 'pane content',
				target: `${normalPaneTarget} .maxi-pane-block__content`,
			},
			hover: {
				label: 'pane content on hover',
				target: `${normalPaneTarget} .maxi-pane-block__content:hover`,
			},
			active: {
				label: 'pane content active state',
				target: `${activePaneTarget} .maxi-pane-block__content`,
			},
		},
		'before content': {
			normal: {
				label: 'pane content ::before',
				target: `${normalPaneTarget} .maxi-pane-block__content::before`,
			},
			hover: {
				label: 'pane content ::before on hover',
				target: `${normalPaneTarget} .maxi-pane-block__content:hover::before`,
			},
			active: {
				label: 'pane content ::before on active state',
				target: `${activePaneTarget} .maxi-pane-block__content::before`,
			},
		},
		'after content': {
			normal: {
				label: 'pane content ::after',
				target: `${normalPaneTarget} .maxi-pane-block__content::after`,
			},
			hover: {
				label: 'pane content ::after on hover',
				target: `${normalPaneTarget} .maxi-pane-block__content:hover::after`,
			},
			active: {
				label: 'pane content ::after on active state',
				target: `${activePaneTarget} .maxi-pane-block__content::after`,
			},
		},
		'pane header content': {
			normal: {
				label: 'header content',
				target: ` ${normalPaneTarget} .maxi-pane-block__header-content`,
			},
			hover: {
				label: 'header content on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__header-content:hover`,
			},
			active: {
				label: 'header content on active state',
				target: ` ${activePaneTarget} .maxi-pane-block__header-content`,
			},
		},
		'pane header line': {
			normal: {
				label: 'header line',
				target: ` ${normalPaneTarget} .maxi-pane-block__header-line`,
			},
			hover: {
				label: 'header line on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__header-line:hover`,
			},
			active: {
				label: 'header line on active state',
				target: ` ${activePaneTarget} .maxi-pane-block__header-line`,
			},
		},
		'pane content line': {
			normal: {
				label: 'content line',
				target: ` ${normalPaneTarget} .maxi-pane-block__content-line`,
			},
			hover: {
				label: 'content line on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__content-line:hover`,
			},
			active: {
				label: 'content line on active state',
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
			title: 'Header line',
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__line',
			hoverProp: 'header-line-status-hover',
			limitless: true,
		},
		'content line': {
			title: 'Content line',
			target: ' > .maxi-pane-block > .maxi-pane-block__content-wrapper > .maxi-pane-block__line-container .maxi-pane-block__line',
			hoverProp: 'content-line-status-hover',
			limitless: true,
		},
		'pane title': {
			title: 'Pane title',
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__title',
			property: false,
			hoverProp: [
				'title-typography-status-hover',
				'title-typography-status-active',
			],
		},
		'pane title background': {
			title: 'Pane title background',
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
	ariaLabelsCategories,
};
export default data;
