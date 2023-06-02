/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/attributes/custom-css';
import { AlignmentControl, TypographyControl } from '../../components';
import {
	getAlignmentTextStyles,
	getTypographyStyles,
} from '../../extensions/styles/helpers';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';
import { transitionDefault } from '../../extensions/attributes/transitions';

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
	_exclude: ['_c'],
	settings: {
		'Text content': '_c',
		'Heading / Paragraph tag': '_tl',
		'List options': {
			group: {
				'List indent': {
					props: '_lin',
					hasBreakpoints: true,
				},
				'List indent unit': {
					props: '_lin.u',
					hasBreakpoints: true,
				},
				'List gap': {
					props: '_lg',
					hasBreakpoints: true,
				},
				'List gap unit': {
					props: '_lg.u',
					hasBreakpoints: true,
				},
				'List paragraph spacing': {
					props: '_lps',
					hasBreakpoints: true,
				},
				'List paragraph spacing unit': {
					props: '_lps.u',
					hasBreakpoints: true,
				},
				'Marker size': {
					props: '_lms',
					hasBreakpoints: true,
				},
				'Marker size unit': {
					props: '_lms.u',
					hasBreakpoints: true,
				},
				'List marker indent': {
					props: '_lmi',
					hasBreakpoints: true,
				},
				'List marker indent unit': {
					props: '_lmi.u',
					hasBreakpoints: true,
				},
				'List marker line height': {
					props: '_lmlh',
					hasBreakpoints: true,
				},
				'List marker line height unit': {
					props: '_lmlh.u',
					hasBreakpoints: true,
				},
				'List colour': {
					props: 'l',
					isPalette: true,
				},
				'List text position': {
					props: '_ltp',
					hasBreakpoints: true,
				},
				'List type': '_tol',
				'List style': '_lsty',
				'List style custom': '_lsc',
				'List start': '_lst',
				'List reversed': '_lr',
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
				'te w': '',
				ls: linkClass,
				'or lt': ' ol.maxi-text-block__content',
				'u lt': ' ul.maxi-text-block__content',
			},
			false
		),
		...createSelectors({
			te: contentClass,
		}),
	},
	categories: [
		'te w',
		'te',
		'ls',
		'or lt',
		'u lt',
		'be te',
		'a te',
		'bg',
		'bg h',
	],
};
const transition = {
	c: {
		...transitionDefault.c,
		ty: {
			ti: 'Typography',
			ta: [contentClass, `${contentClass} li`, `${contentClass} ol`],
			p: false,
			hp: 't.sh',
		},
		li: {
			ti: 'Link',
			ta: [linkClass, `${linkClass} span`],
			p: 'color',
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			label: __('Alignment', 'maxi-blocks'),
			attrGroupName: 'textAlignment',
			component: props => <AlignmentControl {...props} type='text' />,
			helper: props => getAlignmentTextStyles(props.obj),
			disableTransition: true,
		},
		{
			label: __('Typography', 'maxi-blocks'),
			transitionTarget: transition.c.ty.ta,
			hoverProp: 't.sh',
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
	],
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
