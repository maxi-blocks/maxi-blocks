/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import {
	SvgColorControl,
	SvgStrokeWidthControl,
	BackgroundControl,
	BorderControl,
} from '../../components';
import {
	getBackgroundStyles,
	getBorderStyles,
	getSVGStyles,
} from '../../extensions/styles/helpers';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-svg-icon-block';
const iconClass = `${blockClass}__icon`;

const prefix = 'svg-';

/**
 * Data object
 */
const name = 'svg-icon-maxi';
const copyPasteMapping = {
	settings: {
		'Icon content': ['svgType', 'content'],
		Alignment: {
			groupAttributes: 'alignment',
		},
		'Icon alt': {
			group: {
				'Alt title': 'altTitle',
				'Alt description': 'altDescription',
			},
		},
		'Icon colour': {
			group: {
				'Icon hover status': 'svg-status-hover',
				'Fill colour': { props: 'svg-fill', isPalette: true },
				'Line colour': { label: 'svg-line', isPalette: true },
				'Fill hover colour': {
					props: 'svg-fill',
					isPalette: true,
					isHover: true,
				},
				'Line hover colour': {
					props: 'svg-line',
					isPalette: true,
					isHover: true,
				},
			},
		},
		'Icon line width': {
			props: 'svg-stroke',
			hasBreakpoints: true,
		},
		'Icon background': {
			group: {
				'Background colour': {
					groupAttributes: ['background', 'backgroundColor'],
				},
				'Background color hover': {
					groupAttributes: ['background', 'backgroundColor'],
				},
				'Background gradient': {
					groupAttributes: ['background', 'backgroundGradient'],
				},
				'Background gradient hover': {
					groupAttributes: [
						'backgroundHover',
						'backgroundGradientHover',
					],
				},
			},
			prefix,
		},
		Border: {
			template: 'border',
			prefix,
		},
		'Box shadow': {
			template: 'boxShadow',
			prefix,
		},
		Size: {
			template: 'size',
			prefix,
		},
		'Margin/Padding': {
			template: 'marginPadding',
			prefix,
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
			canvas: '',
		}),
		...createSelectors({ svg: `${iconClass} svg` }, false),
	},
	categories: [
		'canvas',
		'before canvas',
		'after canvas',
		'svg',
		'background',
		'background hover',
	],
};
const transition = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: iconClass,
			property: 'border',
			prefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: iconClass,
			property: 'box-shadow',
			prefix,
		},
	},
};
const interactionBuilderSettings = [
	{
		label: __('Icon colour'),
		attrGroupName: 'svg',
		component: props => {
			const { attributes, onChange } = props;
			const { blockStyle, content, svgType } = attributes;

			return (
				<SvgColorControl
					{...props}
					onChangeFill={onChange}
					onChangeStroke={onChange}
					blockStyle={blockStyle}
					content={content}
					svgType={svgType}
					disableHover
				/>
			);
		},
		helper: props =>
			getSVGStyles({
				...props,
				target: ' .maxi-svg-icon-block__icon',
				prefix: 'svg-',
			}),
	},
	{
		label: __('Icon line width', 'maxi-blocks'),
		attrGroupName: 'svg',
		component: props => {
			const { attributes } = props;
			const { content } = attributes;

			return (
				<SvgStrokeWidthControl
					{...props}
					content={content}
					prefix='svg-'
				/>
			);
		},
		helper: props =>
			getSVGStyles({
				...props,
				target: ' .maxi-svg-icon-block__icon',
				prefix: 'svg-',
			}),
	},
	{
		label: __('Icon background', 'maxi-blocks'),
		attrGroupName: ['background', 'backgroundColor', 'backgroundGradient'],
		prefix: 'svg-',
		component: props => (
			<BackgroundControl
				{...props}
				disableImage
				disableVideo
				disableClipPath
				disableSVG
			/>
		),
		helper: props =>
			getBackgroundStyles({ ...props, ...props.obj }).background,
		target: ' .maxi-svg-icon-block__icon',
	},
	{
		label: __('Icon border', 'maxi-blocks'),
		attrGroupName: ['border', 'borderWidth', 'borderRadius'],
		prefix: 'svg-',
		component: props => <BorderControl {...props} />,
		helper: props => getBorderStyles(props),
		target: ' .maxi-svg-icon-block__icon',
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
