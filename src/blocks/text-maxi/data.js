/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import { AlignmentControl, TypographyControl } from '../../components';
import {
	getAlignmentTextStyles,
	getTypographyStyles,
} from '../../extensions/styles/helpers';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-text-block';
const contentClass = `${blockClass}__content`;
const linkClass = `${blockClass}--link`;

/**
 * Data object
 */
const name = 'text-maxi';
const copyPasteMapping = {
	settings: {
		'Text content': 'content',
		'Heading / Paragraph tag': 'textLevel',
		'List options': {
			group: {
				'List indent': {
					props: 'list-indent',
					hasBreakpoints: true,
				},
				'List indent unit': {
					props: 'list-indent-unit',
					hasBreakpoints: true,
				},
				'List gap': {
					props: 'list-gap',
					hasBreakpoints: true,
				},
				'List gap unit': {
					props: 'list-gap-unit',
					hasBreakpoints: true,
				},
				'List paragraph spacing': {
					props: 'list-paragraph-spacing',
					hasBreakpoints: true,
				},
				'List paragraph spacing unit': {
					props: 'list-paragraph-spacing-unit',
					hasBreakpoints: true,
				},
				'Marker size': {
					props: 'list-marker-size',
					hasBreakpoints: true,
				},
				'Marker size unit': {
					props: 'list-marker-size-unit',
					hasBreakpoints: true,
				},
				'List marker indent': {
					props: 'list-marker-indent',
					hasBreakpoints: true,
				},
				'List marker indent unit': {
					props: 'list-marker-indent-unit',
					hasBreakpoints: true,
				},
				'List marker line height': {
					props: 'list-marker-line-height',
					hasBreakpoints: true,
				},
				'List marker line height unit': {
					props: 'list-marker-line-height-unit',
					hasBreakpoints: true,
				},
				'List colour': {
					props: 'list',
					isPalette: true,
				},
				'List text position': {
					props: 'list-text-position',
					hasBreakpoints: true,
				},
				'List type': 'typeOfList',
				'List style': 'listStyle',
				'List style custom': 'listStyleCustom',
				'List start': 'listStart',
				'List reversed': 'listReversed',
			},
		},
		'Text alignment': {
			groupAttributes: 'textAlignment',
		},
		Typography: {
			template: 'typography',
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
		Opacity: {
			template: 'opacity',
		},
	},
};
const customCss = {
	selectors: {
		...createSelectors(
			{
				'text wrapper': '',
				links: linkClass,
			},
			false
		),
		...createSelectors({
			text: contentClass,
		}),
		lists: {
			ordered: {
				label: 'Ordered list',
				target: ' ol.maxi-text-block__content',
			},
			unordered: {
				label: 'Unordered list',
				target: ' ul.maxi-text-block__content',
			},
		},
	},
	categories: [
		'text wrapper',
		'text',
		'links',
		'lists',
		'before text',
		'after text',
		'background',
		'background hover',
	],
};
const transition = {
	canvas: {
		...transitionDefault.canvas,
		typography: {
			title: 'Typography',
			target: [contentClass, `${contentClass} li`, `${contentClass} ol`],
			property: 'typography',
			limitless: true,
		},
		link: {
			title: 'Link',
			target: [linkClass, `${linkClass} span`],
			property: 'color',
			ignoreHoverProp: true,
		},
	},
};
const interactionBuilderSettings = [
	{
		label: __('Alignment', 'maxi-blocks'),
		attrGroupName: 'textAlignment',
		component: props => <AlignmentControl {...props} type='text' />,
		helper: props => getAlignmentTextStyles(props.obj),
	},
	{
		label: __('Typography', 'maxi-blocks'),
		transitionTarget: transition.canvas.typography.target,
		hoverProp: 'typography-status-hover',
		attrGroupName: 'typography',
		component: props => (
			<TypographyControl
				{...props}
				styleCardPrefix=''
				hideAlignment
				disableCustomFormats
			/>
		),
		helper: props => getTypographyStyles({ ...props }),
		target: contentClass,
	},
	...getCanvasSettings({ name, customCss }),
];

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
