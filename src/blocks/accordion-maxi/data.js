/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import { createIconTransitions } from '../../extensions/styles';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Data object
 */
const name = 'accordion-maxi';
const copyPasteMapping = {
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
const customCss = {
	selectors: {
		...createSelectors({
			accordion: '',
		}),
		'pane header': {
			normal: {
				label: 'pane header',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__header',
			},
			hover: {
				label: 'pane header on hover',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__header:hover',
			},
			active: {
				label: 'pane header on active state',
				target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__header',
			},
		},
		'pane header content': {
			normal: {
				label: 'header content',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__header-content',
			},
			hover: {
				label: 'header content on hover',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__header-content:hover',
			},
			active: {
				label: 'header content on active state',
				target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__header-content',
			},
		},
		'pane header line': {
			normal: {
				label: 'header line',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__header-line',
			},
			hover: {
				label: 'header line on hover',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__header-line:hover',
			},
			active: {
				label: 'header line on active state',
				target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__header-line',
			},
		},
		'pane content line': {
			normal: {
				label: 'content line',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__content-line',
			},
			hover: {
				label: 'content line on hover',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__content-line:hover',
			},
			active: {
				label: 'content line on active state',
				target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__content-line',
			},
		},
		'pane icon': {
			normal: {
				label: 'icon',
				target: ' .maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon',
			},
			svg: {
				label: "icon's svg",
				target: ' .maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon svg',
			},
			insideSvg: {
				label: 'everything inside svg (svg > *)',
				target: ' .maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon svg > *',
			},
			path: {
				label: "svg's path",
				target: ' .maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon svg path',
			},
			hover: {
				label: 'icon on hover',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__icon:hover',
			},
			hoverSvg: {
				label: "icon's svg on hover",
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__icon:hover svg',
			},
			hoverInsideSvg: {
				label: 'everything inside svg on hover (:hover svg > *)',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__icon:hover svg > *',
			},
			hoverPath: {
				label: "svg's path on hover",
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__icon:hover svg path',
			},
			active: {
				label: 'active icon',
				target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon',
			},
			activeSvg: {
				label: "active icon's svg",
				target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon svg',
			},
			activeInsideSvg: {
				label: 'everything inside active svg (svg > *)',
				target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon svg > *',
			},
			activePath: {
				label: "active svg's path",
				target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon svg path',
			},
		},
		'pane content': {
			normal: {
				label: 'pane content',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__content',
			},
			hover: {
				label: 'pane content on hover',
				target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__content:hover',
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
			hoverProp: 'title-typography-status-hover',
		},
		...createIconTransitions({
			target: ' > .maxi-pane-block > .maxi-pane-block__header .maxi-pane-block__icon',
			prefix: 'icon-',
			titlePrefix: 'icon',
		}),
	},
};
const interactionBuilderSettings = getCanvasSettings({ name, customCss });

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
