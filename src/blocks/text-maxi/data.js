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
		[__('Text content', 'maxi-blocks')]: 'content',
		[__('Heading / Paragraph tag', 'maxi-blocks')]: 'textLevel',
		[__('List options', 'maxi-blocks')]: {
			group: {
				[__('List indent', 'maxi-blocks')]: {
					props: 'list-indent',
					hasBreakpoints: true,
				},
				[__('List indent unit', 'maxi-blocks')]: {
					props: 'list-indent-unit',
					hasBreakpoints: true,
				},
				[__('List gap', 'maxi-blocks')]: {
					props: 'list-gap',
					hasBreakpoints: true,
				},
				[__('List gap unit', 'maxi-blocks')]: {
					props: 'list-gap-unit',
					hasBreakpoints: true,
				},
				[__('List paragraph spacing', 'maxi-blocks')]: {
					props: 'list-paragraph-spacing',
					hasBreakpoints: true,
				},
				[__('List paragraph spacing unit', 'maxi-blocks')]: {
					props: 'list-paragraph-spacing-unit',
					hasBreakpoints: true,
				},
				[__('Marker size', 'maxi-blocks')]: {
					props: 'list-marker-size',
					hasBreakpoints: true,
				},
				[__('Marker size unit', 'maxi-blocks')]: {
					props: 'list-marker-size-unit',
					hasBreakpoints: true,
				},
				[__('List marker indent', 'maxi-blocks')]: {
					props: 'list-marker-indent',
					hasBreakpoints: true,
				},
				[__('List marker indent unit', 'maxi-blocks')]: {
					props: 'list-marker-indent-unit',
					hasBreakpoints: true,
				},
				[__('List marker line height', 'maxi-blocks')]: {
					props: 'list-marker-line-height',
					hasBreakpoints: true,
				},
				[__('List marker line height unit', 'maxi-blocks')]: {
					props: 'list-marker-line-height-unit',
					hasBreakpoints: true,
				},
				[__('List colour', 'maxi-blocks')]: {
					props: 'list',
					isPalette: true,
				},
				[__('List text position', 'maxi-blocks')]: {
					props: 'list-text-position',
					hasBreakpoints: true,
				},
				[__('List type', 'maxi-blocks')]: 'typeOfList',
				[__('List style', 'maxi-blocks')]: 'listStyle',
				[__('List style custom', 'maxi-blocks')]: 'listStyleCustom',
				[__('List start', 'maxi-blocks')]: 'listStart',
				[__('List reversed', 'maxi-blocks')]: 'listReversed',
			},
		},
		[__('Text alignment', 'maxi-blocks')]: {
			groupAttributes: 'textAlignment',
		},
		[__('Typography', 'maxi-blocks')]: {
			template: 'typography',
		},
		[__('Background', 'maxi-blocks')]: {
			template: 'blockBackground',
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
		},
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
		[__('Opacity', 'maxi-blocks')]: {
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
			title: __('Typography', 'maxi-blocks'),
			target: [contentClass, `${contentClass} li`, `${contentClass} ol`],
			property: false,
			hoverProp: 'typography-status-hover',
		},
		link: {
			title: __('Link', 'maxi-blocks'),
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
