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
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-list-item-block';
const contentClass = `${blockClass}__content`;
const linkClass = `${blockClass}--link`;

/**
 * Data object
 */
const name = 'list-item-maxi';
const copyPasteMapping = {
	_exclude: ['content', 'linkSettings', 'custom-formats'],
	settings: {
		'Text content': 'content',
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
				'list item wrapper': '',
				links: linkClass,
			},
			false
		),
		...createSelectors({
			'list item': contentClass,
		}),
	},
	categories: [
		'list item wrapper',
		'list item',
		'links',
		'before list item',
		'after list item',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = ['list item wrapper', 'list item'];
const transition = {
	canvas: {
		...transitionDefault.canvas,
		typography: {
			title: 'Typography',
			target: contentClass,
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
