/**
 * Internal dependencies
 */
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';
import { transitionDefault } from '../../extensions/attributes/transitions';

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
		pa: {
			n: {
				label: 'pane',
				target: '',
			},
			h: {
				label: 'pane on hover',
				target: ':hover',
			},
			active: {
				label: 'pane on active state',
				target: activePaneTarget,
			},
		},
		'be pa': {
			n: {
				label: 'pane ::before',
				target: '::before',
			},
			h: {
				label: 'pane ::before on hover',
				target: ':h::before',
			},
			active: {
				label: 'pane ::before on active state',
				target: `${activePaneTarget}::before`,
			},
		},
		'a pa': {
			n: {
				label: 'pane ::after',
				target: '::after',
			},
			h: {
				label: 'pane ::after on hover',
				target: ':h::after',
			},
			active: {
				label: 'pane ::after on active state',
				target: `${activePaneTarget}::after`,
			},
		},
		he: {
			n: {
				label: 'pane header',
				target: `${normalPaneTarget} .maxi-pane-block__header`,
			},
			h: {
				label: 'pane header on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header:hover`,
			},
			active: {
				label: 'pane header on active state',
				target: `${activePaneTarget} .maxi-pane-block__header`,
			},
		},
		'he cn': {
			n: {
				label: 'header content',
				target: `${normalPaneTarget} .maxi-pane-block__header-content`,
			},
			h: {
				label: 'header content on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header-content:hover`,
			},
			active: {
				label: 'header content on active state',
				target: `${activePaneTarget} .maxi-pane-block__header-content`,
			},
		},
		'he ln': {
			n: {
				label: 'header line',
				target: `${normalPaneTarget} .maxi-pane-block__header-line`,
			},
			h: {
				label: 'header line on hover',
				target: `${normalPaneTarget} .maxi-pane-block__header-line:hover`,
			},
			active: {
				label: 'header line on active state',
				target: `${activePaneTarget} .maxi-pane-block__header-line`,
			},
		},
		'cn ln': {
			n: {
				label: 'content line',
				target: `${normalPaneTarget} .maxi-pane-block__content-line`,
			},
			h: {
				label: 'content line on hover',
				target: `${normalPaneTarget} .maxi-pane-block__content-line:hover`,
			},
			active: {
				label: 'content line on active state',
				target: `${activePaneTarget} .maxi-pane-block__content-line`,
			},
		},
		i: {
			n: {
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
			h: {
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
		cn: {
			n: {
				label: 'pane content',
				target: `${normalPaneTarget} .maxi-pane-block__content`,
			},
			h: {
				label: 'pane content on hover',
				target: `${normalPaneTarget} .maxi-pane-block__content:hover`,
			},
		},
	},
	categories: [
		'pa',
		'be pa',
		'a pa',
		'he',
		'he cn',
		'he ln',
		'cn ln',
		'cn',
		'i',
		'bg',
		'bg h',
	],
};
const transition = {
	pa: {
		...transitionDefault.c,
	},
	he: {
		bo: {
			ti: 'Border',
			ta: ' .maxi-pane-block__header',
			p: 'border',
			hp: [`${headerPrefix}bo.sh`, `${headerPrefix}bo.sa`],
		},
		bs: {
			ti: 'Box shadow',
			ta: ' .maxi-pane-block__header',
			p: 'box-shadow',
			hp: [`${headerPrefix}bs.sh`, `${headerPrefix}bs.sa`],
		},
		bg: {
			ti: 'Background',
			ta: ' .maxi-pane-block__header',
			p: 'background',
			hp: [`${headerPrefix}b.sh`, `${headerPrefix}b.sa`],
		},
	},
	cn: {
		bo: {
			ti: 'Border',
			ta: ' .maxi-pane-block__content',
			p: 'border',
			hp: [`${contentPrefix}bo.sh`, `${contentPrefix}bo.sa`],
		},
		bs: {
			ti: 'Box shadow',
			ta: ' .maxi-pane-block__content',
			p: 'box-shadow',
			hp: [`${contentPrefix}bs.sh`, `${contentPrefix}bs.sa`],
		},
		bg: {
			ti: 'Background',
			ta: ' .maxi-pane-block__content',
			p: 'background',
			hp: [`${contentPrefix}b.sh`, `${contentPrefix}b.sa`],
		},
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

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	targets,
};
export default data;
