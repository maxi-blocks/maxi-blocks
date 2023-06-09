/**
 * Internal dependencies
 */
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

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
				target: '',
			},
			hover: {
				label: 'pane on hover',
				target: ':hover',
			},
			active: {
				label: 'pane on active state',
				target: activePaneTarget,
			},
		},
		'before pane': {
			normal: {
				label: 'pane ::before',
				target: '::before',
			},
			hover: {
				label: 'pane ::before on hover',
				target: ':hover::before',
			},
			active: {
				label: 'pane ::before on active state',
				target: `${activePaneTarget}::before`,
			},
		},
		'after pane': {
			normal: {
				label: 'pane ::after',
				target: '::after',
			},
			hover: {
				label: 'pane ::after on hover',
				target: ':hover::after',
			},
			active: {
				label: 'pane ::after on active state',
				target: `${activePaneTarget}::after`,
			},
		},
		header: {
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
				target: '::before',
			},
			hover: {
				label: 'pane header ::before on hover',
				target: ':hover::before',
			},
			active: {
				label: 'pane header ::before on active state',
				target: `${activePaneTarget}::before`,
			},
		},
		'after header': {
			normal: {
				label: 'pane header ::after',
				target: '::after',
			},
			hover: {
				label: 'pane header ::after on hover',
				target: ':hover::after',
			},
			active: {
				label: 'pane header ::after on active state',
				target: `${activePaneTarget}::after`,
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
		icon: {
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
		content: {
			normal: {
				label: 'pane content',
				target: `${normalPaneTarget} .maxi-pane-block__content`,
			},
			hover: {
				label: 'pane content on hover',
				target: `${normalPaneTarget} .maxi-pane-block__content:hover`,
			},
		},
	},
	categories: [
		'pane',
		'before pane',
		'after pane',
		'header',
		'before header',
		'after header',
		'header content',
		'header line',
		'content line',
		'content',
		'icon',
		'background',
		'background hover',
	],
};
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
