/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/attributes/custom-css';
import {
	createIconTransitions,
	transitionDefault,
} from '../../extensions/attributes/transitions';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';

import { targets as paneTargets } from '../pane-maxi/data';

/**
 * Data object
 */
const name = 'accordion-maxi';
const copyPasteMapping = {
	_exclude: ['i_c', 'a-i_c'],
	settings: {
		'Accordion settings': {
			group: {
				'Accordion layout': '_acl',
				Collapsible: '_ico',
				'Pane closes when another opens': '_apc',
				'Pane spacing': {
					props: ['_rg', '_rg.u'],
					hasBreakpoints: true,
				},
				'Animation duration': '_ad',
			},
		},
		'Accordion line': { groupAttributes: 'accordionLine' },
		'Accordion title': { groupAttributes: 'accordionTitle' },
		Icon: {
			group: {
				Icon: { groupAttributes: ['icon', 'iconHover'] },
				'Icon border': {
					groupAttributes: [
						'iconBorder',
						'iconBorderWidth',
						'iconBorderRadius',
						'iconBorderHover',
						'iconBorderWidthHover',
						'iconBorderRadiusHover',
					],
				},
				'Icon background': {
					groupAttributes: [
						'iconBackground',
						'iconBackgroundColor',
						'iconBackgroundGradient',
						'iconBackgroundHover',
						'iconBackgroundColorHover',
						'iconBackgroundGradientHover',
					],
				},
				'Icon padding': {
					groupAttributes: 'iconPadding',
				},
			},
		},
		'Active icon': {
			group: {
				Icon: {
					groupAttributes: ['icon', 'iconHover'],
					prefix: 'a-',
				},
				'Icon border': {
					groupAttributes: [
						'iconBorder',
						'iconBorderWidth',
						'iconBorderRadius',
						'iconBorderHover',
						'iconBorderWidthHover',
						'iconBorderRadiusHover',
					],
					prefix: 'a-',
				},
				'Icon background': {
					groupAttributes: [
						'iconBackground',
						'iconBackgroundColor',
						'iconBackgroundGradient',
						'iconBackgroundHover',
						'iconBackgroundColorHover',
						'iconBackgroundGradientHover',
					],
					prefix: 'a-',
				},
				'Icon padding': {
					groupAttributes: 'iconPadding',
					prefix: 'a-',
				},
			},
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
			accordion: '',
		}),
		'pane header': {
			normal: {
				label: 'pane header',
				target: ` ${normalPaneTarget} .maxi-pane-block__header`,
			},
			hover: {
				label: 'pane header on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__header:hover`,
			},
			active: {
				label: 'pane header on active state',
				target: ` ${activePaneTarget} .maxi-pane-block__header`,
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
		'pane icon': {
			normal: {
				label: 'icon',
				target: ` ${normalPaneTarget} .maxi-pane-block__icon`,
			},
			svg: {
				label: "icon's svg",
				target: ` ${normalPaneTarget} .maxi-pane-block__icon svg`,
			},
			insideSvg: {
				label: 'everything inside svg (svg > *)',
				target: ` ${normalPaneTarget} .maxi-pane-block__icon svg > *`,
			},
			path: {
				label: "svg's path",
				target: ` ${normalPaneTarget} .maxi-pane-block__icon svg path`,
			},
			hover: {
				label: 'icon on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__icon:hover`,
			},
			hoverSvg: {
				label: "icon's svg on hover",
				target: ` ${normalPaneTarget} .maxi-pane-block__icon:hover svg`,
			},
			hoverInsideSvg: {
				label: 'everything inside svg on hover (:hover svg > *)',
				target: ` ${normalPaneTarget} .maxi-pane-block__icon:hover svg > *`,
			},
			hoverPath: {
				label: "svg's path on hover",
				target: ` ${normalPaneTarget} .maxi-pane-block__icon:hover svg path`,
			},
			active: {
				label: 'active icon',
				target: ` ${activePaneTarget} .maxi-pane-block__icon`,
			},
			activeSvg: {
				label: "active icon's svg",
				target: ` ${activePaneTarget} .maxi-pane-block__icon svg`,
			},
			activeInsideSvg: {
				label: 'everything inside active svg (svg > *)',
				target: ` ${activePaneTarget} .maxi-pane-block__icon svg > *`,
			},
			activePath: {
				label: "active svg's path",
				target: ` ${activePaneTarget} .maxi-pane-block__icon svg path`,
			},
		},
		'pane content': {
			normal: {
				label: 'pane content',
				target: ` ${normalPaneTarget} .maxi-pane-block__content`,
			},
			hover: {
				label: 'pane content on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__content:hover`,
			},
		},
	},
	categories: [
		'accordion',
		'before accordion',
		'after accordion',
		'pane header',
		'pane header content',
		'pane header line',
		'pane content line',
		'pane content',
		'pane icon',
		'background',
		'background hover',
	],
};
const transition = {
	...transitionDefault,
	block: {
		'he ln': {
			ti: 'Header line',
			ta: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__line',
			hp: 'he_li.sh',
			l: true,
		},
		'cn ln': {
			ti: 'Content line',
			ta: ' > .maxi-pane-block > .maxi-pane-block__content-wrapper > .maxi-pane-block__line-container .maxi-pane-block__line',
			hp: 'c_li.sh',
			l: true,
		},
		'pa ti': {
			ti: 'Pane title',
			ta: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__title',
			p: false,
			hp: ['ti-t.sh', 'ti-t.sa'],
		},
		'pa ti bg': {
			ti: 'Pane title background',
			ta: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__header-content',
			p: 'background-color',
			hp: 'ti-b.sh',
		},
		...createIconTransitions({
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__icon',
			prefix: 'i-',
			titlePrefix: 'icon',
			shortPrefix: 'i',
		}),
	},
};
const interactionBuilderSettings = {
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
