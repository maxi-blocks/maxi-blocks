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
			ac: '',
		}),
		'pa he': {
			n: {
				label: 'pane header',
				target: ` ${normalPaneTarget} .maxi-pane-block__header`,
			},
			h: {
				label: 'pane header on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__header:hover`,
			},
			active: {
				label: 'pane header on active state',
				target: ` ${activePaneTarget} .maxi-pane-block__header`,
			},
		},
		'pa he cn': {
			n: {
				label: 'header content',
				target: ` ${normalPaneTarget} .maxi-pane-block__header-content`,
			},
			h: {
				label: 'header content on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__header-content:hover`,
			},
			active: {
				label: 'header content on active state',
				target: ` ${activePaneTarget} .maxi-pane-block__header-content`,
			},
		},
		'pa he ln': {
			n: {
				label: 'header line',
				target: ` ${normalPaneTarget} .maxi-pane-block__header-line`,
			},
			h: {
				label: 'header line on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__header-line:hover`,
			},
			active: {
				label: 'header line on active state',
				target: ` ${activePaneTarget} .maxi-pane-block__header-line`,
			},
		},
		'pa cn ln': {
			n: {
				label: 'content line',
				target: ` ${normalPaneTarget} .maxi-pane-block__content-line`,
			},
			h: {
				label: 'content line on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__content-line:hover`,
			},
			active: {
				label: 'content line on active state',
				target: ` ${activePaneTarget} .maxi-pane-block__content-line`,
			},
		},
		'pa i': {
			n: {
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
			h: {
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
		'pa cn': {
			n: {
				label: 'pane content',
				target: ` ${normalPaneTarget} .maxi-pane-block__content`,
			},
			h: {
				label: 'pane content on hover',
				target: ` ${normalPaneTarget} .maxi-pane-block__content:hover`,
			},
		},
	},
	categories: [
		'ac',
		'b ac',
		'a ac',
		'pa he',
		'pa he cn',
		'pa he ln',
		'pa cn ln',
		'pa cn',
		'pa i',
		'bg',
		'bg h',
	],
};
const transition = {
	...transitionDefault,
	b: {
		'he ln': {
			ti: 'Header line',
			ta: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block_-line',
			hp: 'he-li.sh',
			l: true,
		},
		'cn ln': {
			ti: 'Content line',
			ta: ' > .maxi-pane-block > .maxi-pane-block__content-wrapper > .maxi-pane-block_-line-container .maxi-pane-block_-line',
			hp: 'c-li.sh',
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
