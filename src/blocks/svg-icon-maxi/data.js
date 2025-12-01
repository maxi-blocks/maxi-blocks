/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BackgroundControl from '@components/background-control';
import BorderControl from '@components/border-control';
import SvgColorControl from './components/svg-color-control';
import { createSelectors } from '@extensions/styles/custom-css';
import { createIconTransitions } from '@extensions/styles';
import {
	getBackgroundStyles,
	getBorderStyles,
	getSVGStyles,
} from '@extensions/styles/helpers';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

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
	_exclude: ['content', 'svgType', 'altTitle', 'altDescription'],
	settings: {
		[__('Icon content', 'maxi-blocks')]: ['svgType', 'content'],
		[__('Alignment', 'maxi-blocks')]: {
			groupAttributes: 'alignment',
		},
		[__('Icon alt', 'maxi-blocks')]: {
			group: {
				[__('Alt title', 'maxi-blocks')]: 'altTitle',
				[__('Alt description', 'maxi-blocks')]: 'altDescription',
			},
		},
		[__('Icon colour', 'maxi-blocks')]: {
			group: {
				[__('Icon hover status', 'maxi-blocks')]: 'svg-status-hover',
				[__('Fill colour', 'maxi-blocks')]: {
					props: 'svg-fill',
					isPalette: true,
				},
				[__('Line colour', 'maxi-blocks')]: {
					label: 'svg-line',
					isPalette: true,
				},
				[__('Fill hover colour', 'maxi-blocks')]: {
					props: 'svg-fill',
					isPalette: true,
					isHover: true,
				},
				[__('Line hover colour', 'maxi-blocks')]: {
					props: 'svg-line',
					isPalette: true,
					isHover: true,
				},
			},
		},
		[__('Icon line width', 'maxi-blocks')]: {
			props: 'svg-stroke',
			hasBreakpoints: true,
		},
		[__('Icon background', 'maxi-blocks')]: {
			group: {
				[__('Background colour', 'maxi-blocks')]: {
					groupAttributes: ['background', 'backgroundColor'],
				},
				[__('Background color hover', 'maxi-blocks')]: {
					groupAttributes: ['background', 'backgroundColor'],
				},
				[__('Background gradient', 'maxi-blocks')]: {
					groupAttributes: ['background', 'backgroundGradient'],
				},
				[__('Background gradient hover', 'maxi-blocks')]: {
					groupAttributes: [
						'backgroundHover',
						'backgroundGradientHover',
					],
				},
			},
			prefix,
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
			prefix,
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
			prefix,
		},
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
			prefix,
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
			prefix,
		},
	},
	canvas: {
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
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
		[__('Opacity', 'maxi-blocks')]: {
			template: 'opacity',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
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
const ariaLabelsCategories = ['canvas', 'svg'];
const transition = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: iconClass,
			property: ['border', 'border-radius'],
			hoverProp: `${prefix}border-status-hover`,
		},
		'box shadow': {
			title: 'Box shadow',
			target: iconClass,
			property: 'box-shadow',
			hoverProp: `${prefix}box-shadow-status-hover`,
		},
		...createIconTransitions({
			target: iconClass,
			prefix,
			disableBackground: true,
			disableBorder: true,
			disableWidth: true,
		}),
		background: {
			title: 'Background',
			target: iconClass,
			property: 'background',
			hoverProp: `${prefix}background-status-hover`,
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			sid: 'ic',
			label: __('Icon colour', 'maxi-blocks'),
			transitionTarget: [
				transition.block.colour.target,
				transition.block['colour two'].target,
			],
			transitionTrigger: `${iconClass} svg`,
			hoverProp: 'svg-status-hover',
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
						// Needs a bit of a hack to get the correct value ⬇
						maxiSetAttributes={onChange}
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
		// TODO: fix #3619
		// {
		//  sid: 'ilw',
		// 	label: __('Icon line width', 'maxi-blocks'),
		// 	attrGroupName: 'svg',
		// 	component: props => {
		// 		const { attributes } = props;
		// 		const { content } = attributes;

		// 		return (
		// 			<SvgStrokeWidthControl
		// 				{...props}
		// 				content={content}
		// 				prefix='svg-'
		// 			/>
		// 		);
		// 	},
		// 	helper: props =>
		// 		getSVGStyles({
		// 			...props,
		// 			target: ' .maxi-svg-icon-block__icon',
		// 			prefix: 'svg-',
		// 		}),
		// },
		{
			sid: 'ibg',
			label: __('Icon background', 'maxi-blocks'),
			transitionTarget: transition.block.background.target,
			hoverProp: 'svg-background-status-hover',
			attrGroupName: [
				'background',
				'backgroundColor',
				'backgroundGradient',
			],
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
			styleAttrs: [
				'background-active-media',
				'background-gradient-opacity',
			],
		},
		{
			sid: 'ib',
			label: __('Icon border', 'maxi-blocks'),
			transitionTarget: transition.block.border.target,
			hoverProp: 'svg-border-status-hover',
			attrGroupName: ['border', 'borderWidth', 'borderRadius'],
			prefix: 'svg-',
			component: props => <BorderControl {...props} />,
			helper: props => getBorderStyles(props),
			target: ' .maxi-svg-icon-block__icon',
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

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
};
export default data;
