/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
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
const customCss = {
	selectors: {
		...createSelectors({
			pane: '',
		}),
		header: {
			normal: {
				label: 'pane header',
				target: '[aria-expanded] .maxi-pane-block__header',
			},
			hover: {
				label: 'pane header on hover',
				target: '[aria-expanded] .maxi-pane-block__header:hover',
			},
			active: {
				label: 'pane header on active state',
				target: '[aria-expanded=true] .maxi-pane-block__header',
			},
		},
		'header content': {
			normal: {
				label: 'header content',
				target: '[aria-expanded] .maxi-pane-block__header-content',
			},
			hover: {
				label: 'header content on hover',
				target: '[aria-expanded] .maxi-pane-block__header-content:hover',
			},
			active: {
				label: 'header content on active state',
				target: '[aria-expanded=true] .maxi-pane-block__header-content',
			},
		},
		'header line': {
			normal: {
				label: 'header line',
				target: '[aria-expanded] .maxi-pane-block__header-line',
			},
			hover: {
				label: 'header line on hover',
				target: '[aria-expanded] .maxi-pane-block__header-line:hover',
			},
			active: {
				label: 'header line on active state',
				target: '[aria-expanded=true] .maxi-pane-block__header-line',
			},
		},
		'content line': {
			normal: {
				label: 'content line',
				target: '[aria-expanded] .maxi-pane-block__content-line',
			},
			hover: {
				label: 'content line on hover',
				target: '[aria-expanded] .maxi-pane-block__content-line:hover',
			},
			active: {
				label: 'content line on active state',
				target: '[aria-expanded=true] .maxi-pane-block__content-line',
			},
		},
		icon: {
			normal: {
				label: 'icon',
				target: '[aria-expanded=false] .maxi-pane-block__icon',
			},
			svg: {
				label: "icon's svg",
				target: '[aria-expanded=false] .maxi-pane-block__icon svg',
			},
			insideSvg: {
				label: 'everything inside svg (svg > *)',
				target: '[aria-expanded=false] .maxi-pane-block__icon svg > *',
			},
			path: {
				label: "svg's path",
				target: '[aria-expanded=false] .maxi-pane-block__icon svg path',
			},
			hover: {
				label: 'icon on hover',
				target: '[aria-expanded] .maxi-pane-block__icon:hover',
			},
			hoverSvg: {
				label: "icon's svg on hover",
				target: '[aria-expanded] .maxi-pane-block__icon:hover svg',
			},
			hoverInsideSvg: {
				label: 'everything inside svg on hover (:hover svg > *)',
				target: '[aria-expanded] .maxi-pane-block__icon:hover svg > *',
			},
			hoverPath: {
				label: "svg's path on hover",
				target: '[aria-expanded] .maxi-pane-block__icon:hover svg path',
			},
			active: {
				label: 'active icon',
				target: '[aria-expanded=true] .maxi-pane-block__icon',
			},
			activeSvg: {
				label: "active icon's svg",
				target: '[aria-expanded=true] .maxi-pane-block__icon svg',
			},
			activeInsideSvg: {
				label: 'everything inside active svg (svg > *)',
				target: '[aria-expanded=true] .maxi-pane-block__icon svg > *',
			},
			activePath: {
				label: "active svg's path",
				target: '[aria-expanded=true] .maxi-pane-block__icon svg path',
			},
		},
		content: {
			normal: {
				label: 'pane content',
				target: '[aria-expanded] .maxi-pane-block__content',
			},
			hover: {
				label: 'pane content on hover',
				target: '[aria-expanded] .maxi-pane-block__content:hover',
			},
		},
	},
	categories: [
		'pane',
		'before pane',
		'after pane',
		'header',
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
			hoverProp: `${headerPrefix}border-status-hover`,
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-pane-block__header',
			property: 'box-shadow',
			hoverProp: `${headerPrefix}box-shadow-status-hover`,
		},
		background: {
			title: 'Background',
			target: ' .maxi-pane-block__header',
			property: 'background',
			hoverProp: `${headerPrefix}background-status-hover`,
		},
	},
	content: {
		border: {
			title: 'Border',
			target: ' .maxi-pane-block__content',
			property: 'border',
			hoverProp: `${contentPrefix}border-status-hover`,
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-pane-block__content',
			property: 'box-shadow',
			hoverProp: `${contentPrefix}box-shadow-status-hover`,
		},
		background: {
			title: 'Background',
			target: ' .maxi-pane-block__content',
			property: 'background',
			hoverProp: `${contentPrefix}background-status-hover`,
		},
	},
};
const interactionBuilderSettings = {
	canvas: getCanvasSettings({ name, customCss }),
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
