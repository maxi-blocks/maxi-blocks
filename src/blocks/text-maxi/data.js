/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AlignmentControl from '@components/alignment-control';
import TypographyControl from '@components/typography-control';
import { createSelectors } from '@extensions/styles/custom-css';
import {
	getAlignmentTextStyles,
	getTypographyStyles,
} from '@extensions/styles/helpers';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

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
	_exclude: ['content', 'linkSettings', 'custom-formats'],
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
				'ordered list': ' ol.maxi-text-block__content',
				'unordered list': ' ul.maxi-text-block__content',
			},
			false
		),
		...createSelectors({
			text: contentClass,
		}),
	},
	categories: [
		'text wrapper',
		'text',
		'links',
		'ordered list',
		'unordered list',
		'before text',
		'after text',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = ['text wrapper', 'text', 'list'];
const transition = {
	canvas: {
		...transitionDefault.canvas,
		typography: {
			title: 'Typography',
			target: [contentClass, `${contentClass} li`, `${contentClass} ol`],
			property: false,
			hoverProp: 'typography-status-hover',
		},
		link: {
			title: 'Link',
			target: [linkClass, `${linkClass} span`],
			property: 'color',
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			sid: 'a',
			label: __('Alignment', 'maxi-blocks'),
			attrGroupName: 'textAlignment',
			component: props => <AlignmentControl {...props} type='text' />,
			helper: props => getAlignmentTextStyles(props.obj),
			disableTransition: true,
		},
		{
			sid: 'ty',
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
					forceIndividualChanges
				/>
			),
			helper: props => getTypographyStyles({ ...props }),
			target: contentClass,
		},
		...getCanvasSettings({ name }),
	],
	advanced: getAdvancedSettings({ customCss }),
};
const scProps = {
	scElements: [1, 2, 3, 4, 5, 6, 7, 8],
	scType: 'color',
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	scProps,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	scProps,
	ariaLabelsCategories,
};
export default data;
