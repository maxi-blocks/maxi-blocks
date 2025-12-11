/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import AlignmentControl from '@components/alignment-control';
import BorderControl from '@components/border-control';
import ImageShape from '@components/image-shape';
import InfoBox from '@components/info-box';
import ClipPathControl from '@components/clip-path-control';
import {
	getAlignmentFlexStyles,
	getBorderStyles,
	getClipPathStyles,
	getImageShapeStyles,
} from '@extensions/styles/helpers';
import { getGroupAttributes } from '@extensions/styles';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';
import { getEditorWrapper } from '@extensions/dom';

/**
 * Classnames
 */
const blockClass = ' .maxi-image-block';
const imageClass = `${blockClass}__image`;
const imageWrapperClass = `${blockClass}-wrapper`;

const prefix = 'image-';

/**
 * Data object
 */
const name = 'image-maxi';
const copyPasteMapping = {
	_exclude: [
		'mediaID',
		'isImageUrl',
		'mediaURL',
		'mediaWidth',
		'mediaHeight',
		'mediaAlt',
		'captionContent',
	],
	settings: {
		[__('Image', 'maxi-blocks')]: [
			'mediaID',
			'isImageUrl',
			'mediaURL',
			'mediaWidth',
			'mediaHeight',
			'mediaAlt',
		],
		[__('Dimension', 'maxi-blocks')]: {
			group: {
				[__('Image size', 'maxi-blocks')]: 'imageSize',
				[__('Use original size', 'maxi-blocks')]: 'useInitSize',
				[__('Image width', 'maxi-blocks')]: 'img-width-general',
				[__('Image ratio', 'maxi-blocks')]: 'imageRatio',
			},
		},
		[__('Alignment', 'maxi-blocks')]: {
			groupAttributes: 'alignment',
		},
		[__('Alt tag', 'maxi-blocks')]: ['mediaAlt', 'altSelector'],
		[__('Caption', 'maxi-blocks')]: {
			group: {
				[__('Caption type', 'maxi-blocks')]: 'captionType',
				[__('Caption content', 'maxi-blocks')]: 'captionContent',
				[__('Caption position', 'maxi-blocks')]: 'captionPosition',
				[__('Caption gap', 'maxi-blocks')]: {
					props: 'caption-gap',
					hasBreakpoints: true,
				},
				[__('Caption gap unit', 'maxi-blocks')]: {
					props: 'caption-gap-unit',
					hasBreakpoints: true,
				},
				[__('Typography', 'maxi-blocks')]: {
					groupAttributes: 'typography',
				},
				[__('Text alignment', 'maxi-blocks')]: {
					groupAttributes: 'textAlignment',
				},
				[__('Link', 'maxi-blocks')]: { groupAttributes: 'link' },
			},
		},
		[__('Hover effects', 'maxi-blocks')]: {
			group: {
				[__('Hover', 'maxi-blocks')]: {
					groupAttributes: 'hover',
				},
				[__('Hover background', 'maxi-blocks')]: {
					groupAttributes: 'hoverBackground',
				},
				[__('Hover background color', 'maxi-blocks')]: {
					groupAttributes: 'hoverBackgroundColor',
				},
				[__('Hover background gradient', 'maxi-blocks')]: {
					groupAttributes: 'hoverBackgroundGradient',
				},
				[__('Hover border', 'maxi-blocks')]: {
					groupAttributes: 'hoverBorder',
				},
				[__('Hover border radius', 'maxi-blocks')]: {
					groupAttributes: 'hoverBorderRadius',
				},
				[__('Hover border width', 'maxi-blocks')]: {
					groupAttributes: 'hoverBorderWidth',
				},
				[__('Hover content typography', 'maxi-blocks')]: {
					groupAttributes: 'hoverContentTypography',
				},
				[__('Hover margin', 'maxi-blocks')]: {
					groupAttributes: 'hoverMargin',
				},
				[__('Hover padding', 'maxi-blocks')]: {
					groupAttributes: 'hoverPadding',
				},
				[__('Hover title typography', 'maxi-blocks')]: {
					groupAttributes: 'hoverTitleTypography',
				},
			},
		},
		[__('Clip path', 'maxi-blocks')]: {
			groupAttributes: 'clipPath',
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
		},
	},
	canvas: {
		blockSpecific: {
			[__('Size', 'maxi-blocks')]: {
				template: 'size',
			},
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
	selectors: createSelectors({
		canvas: '',
		image: imageClass,
	}),
	categories: [
		'canvas',
		'before canvas',
		'after canvas',
		'image',
		'before image',
		'after image',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = ['canvas', 'image'];
const transition = {
	...transitionDefault,
	block: {
		border: {
			title: __('Border', 'maxi-blocks'),
			target: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
			property: ['border', 'border-radius'],
			hoverProp: `${prefix}border-status-hover`,
		},
		'box shadow': {
			title: __('Box shadow', 'maxi-blocks'),
			target: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
			property: 'box-shadow',
			hoverProp: `${prefix}box-shadow-status-hover`,
		},
		'clip path': {
			title: __('Clip path', 'maxi-blocks'),
			target: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
			property: 'clip-path',
			hoverProp: 'clip-path-status-hover',
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			sid: 'a',
			label: __('Alignment', 'maxi-blocks'),
			attrGroupName: 'alignment',
			component: props => <AlignmentControl disableJustify {...props} />,
			helper: props => getAlignmentFlexStyles(props.obj),
			target: imageWrapperClass,
			disableTransition: true,
		},
		{
			sid: 'sm',
			label: __('Shape mask', 'maxi-blocks'),
			attrGroupName: 'imageShape',
			component: props => {
				const { SVGElement } = props.blockAttributes;

				return SVGElement ? (
					<ImageShape
						{...props}
						icon={SVGElement}
						disableModal
						disableImagePosition
						disableImageRatio
					/>
				) : (
					<InfoBox
						message={__(
							'Add shape icon to be able to use this control'
						)}
					/>
				);
			},
			helper: props =>
				Object.entries({
					' .maxi-image-block-wrapper > svg:first-child': 'svg',
					' .maxi-image-block-wrapper > svg:first-child pattern image':
						'image',
				}).reduce((acc, [key, type]) => {
					acc[key] = {
						transform: getImageShapeStyles(
							type,
							props.obj,
							'',
							true
						),
					};
					return acc;
				}, {}),
		},
		{
			sid: 'cp',
			label: __('Clip-path', 'maxi-blocks'),
			attrGroupName: 'clipPath',
			transitionTarget: transition.block['clip path'].target,
			hoverProp: 'clip-path-status-hover',
			component: props => (
				<ClipPathControl
					{...props}
					getBounds={() =>
						getEditorWrapper()
							.querySelector(
								`.${props.attributes.uniqueID}${imageClass}`
							)
							.getBoundingClientRect()
					}
					getBlockClipPath={() =>
						getGroupAttributes(props.blockAttributes, 'clipPath')
					}
					isIB
				/>
			),
			helper: props => getClipPathStyles(props),
			target: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
			styleAttrs: ['clip-path-status'],
		},
		{
			sid: 'imb',
			label: __('Border', 'maxi-blocks'),
			transitionTarget: transition.block.border.target,
			hoverProp: 'image-border-status-hover',
			attrGroupName: ['border', 'borderWidth', 'borderRadius'],
			prefix,
			component: props => <BorderControl {...props} />,
			helper: props => getBorderStyles(props),
			target: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
		},
	],
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const inlineStylesTargets = {
	block: '',
	image: imageClass,
	imageWrapper: imageWrapperClass,
	caption: `${blockClass}__caption`,
};

const attributesToStyles = {
	// 'img-width': {
	// 	target: `${inlineStylesTargets.image}, ${inlineStylesTargets.caption}`,
	// 	property: 'width',
	// 	unit: 'px',
	// },
	'font-size': {
		target: inlineStylesTargets.caption,
		property: 'font-size',
	},
	'line-height': {
		target: inlineStylesTargets.caption,
		property: 'line-height',
	},
	'letter-spacing': {
		target: inlineStylesTargets.caption,
		property: 'letter-spacing',
	},
	'text-indent': {
		target: inlineStylesTargets.caption,
		property: 'text-indent',
	},
	'word-spacing': {
		target: inlineStylesTargets.caption,
		property: 'word-spacing',
	},
	'image-border-top-width': {
		target: inlineStylesTargets.image,
		property: 'border-top-width',
	},
	'image-border-right-width': {
		target: inlineStylesTargets.image,
		property: 'border-right-width',
	},
	'image-border-bottom-width': {
		target: inlineStylesTargets.image,
		property: 'border-bottom-width',
	},
	'image-border-left-width': {
		target: inlineStylesTargets.image,
		property: 'border-left-width',
	},
	'image-border-top-left-radius': {
		target: inlineStylesTargets.image,
		property: 'border-top-left-radius',
	},
	'image-border-top-right-radius': {
		target: inlineStylesTargets.image,
		property: 'border-top-right-radius',
	},
	'image-border-bottom-right-radius': {
		target: inlineStylesTargets.image,
		property: 'border-bottom-right-radius',
	},
	'image-border-bottom-left-radius': {
		target: inlineStylesTargets.image,
		property: 'border-bottom-left-radius',
	},
	'image-margin-top': {
		target: inlineStylesTargets.image,
		property: 'margin-top',
	},
	'image-margin-right': {
		target: inlineStylesTargets.image,
		property: 'margin-right',
	},
	'image-margin-bottom': {
		target: inlineStylesTargets.image,
		property: 'margin-bottom',
	},
	'image-margin-left': {
		target: inlineStylesTargets.image,
		property: 'margin-left',
	},
	'image-padding-top': {
		target: inlineStylesTargets.imageWrapper,
		property: 'padding-top',
	},
	'image-padding-right': {
		target: inlineStylesTargets.imageWrapper,
		property: 'padding-right',
	},
	'image-padding-bottom': {
		target: inlineStylesTargets.imageWrapper,
		property: 'padding-bottom',
	},
	'image-padding-left': {
		target: inlineStylesTargets.imageWrapper,
		property: 'padding-left',
	},
	'image-width': {
		target: inlineStylesTargets.image,
		property: 'width',
	},
	'image-height': {
		target: inlineStylesTargets.image,
		property: 'height',
	},
	'image-min-width': {
		target: inlineStylesTargets.image,
		property: 'min-width',
	},
	'image-min-height': {
		target: inlineStylesTargets.image,
		property: 'min-height',
	},
	'image-max-width': {
		target: inlineStylesTargets.image,
		property: 'max-width',
	},
	'image-max-height': {
		target: inlineStylesTargets.image,
		property: 'max-height',
	},
	'border-top-width': {
		target: inlineStylesTargets.block,
		property: 'border-top-width',
	},
	'border-right-width': {
		target: inlineStylesTargets.block,
		property: 'border-right-width',
	},
	'border-bottom-width': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-width',
	},
	'border-left-width': {
		target: inlineStylesTargets.block,
		property: 'border-left-width',
	},
	'border-top-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-left-radius',
	},
	'border-top-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-right-radius',
	},
	'border-bottom-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-right-radius',
	},
	'border-bottom-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-left-radius',
	},
	opacity: {
		target: inlineStylesTargets.block,
		property: 'opacity',
	},
	'flex-grow': {
		target: inlineStylesTargets.block,
		property: 'flex-grow',
	},
	'flex-shrink': {
		target: inlineStylesTargets.block,
		property: 'flex-shrink',
	},
	'row-gap': {
		target: inlineStylesTargets.block,
		property: 'row-gap',
	},
	'column-gap': {
		target: inlineStylesTargets.block,
		property: 'column-gap',
	},
	order: {
		target: inlineStylesTargets.block,
		property: 'order',
	},
	'margin-top': {
		target: inlineStylesTargets.block,
		property: 'margin-top',
	},
	'margin-right': {
		target: inlineStylesTargets.block,
		property: 'margin-right',
	},
	'margin-bottom': {
		target: inlineStylesTargets.block,
		property: 'margin-bottom',
	},
	'margin-left': {
		target: inlineStylesTargets.block,
		property: 'margin-left',
	},
	'padding-top': {
		target: inlineStylesTargets.block,
		property: 'padding-top',
	},
	'padding-right': {
		target: inlineStylesTargets.block,
		property: 'padding-right',
	},
	'padding-bottom': {
		target: inlineStylesTargets.block,
		property: 'padding-bottom',
	},
	'padding-left': {
		target: inlineStylesTargets.block,
		property: 'padding-left',
	},
	'position-top': {
		target: inlineStylesTargets.block,
		property: 'top',
	},
	'position-right': {
		target: inlineStylesTargets.block,
		property: 'right',
	},
	'position-bottom': {
		target: inlineStylesTargets.block,
		property: 'bottom',
	},
	'position-left': {
		target: inlineStylesTargets.block,
		property: 'left',
	},
	width: {
		target: inlineStylesTargets.block,
		property: 'width',
	},
	height: {
		target: inlineStylesTargets.block,
		property: 'height',
	},
	'min-width': {
		target: inlineStylesTargets.block,
		property: 'min-width',
	},
	'min-height': {
		target: inlineStylesTargets.block,
		property: 'min-height',
	},
	'max-width': {
		target: inlineStylesTargets.block,
		property: 'max-width',
	},
	'max-height': {
		target: inlineStylesTargets.block,
		property: 'max-height',
	},
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
