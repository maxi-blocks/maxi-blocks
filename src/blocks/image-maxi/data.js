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
		Image: [
			'mediaID',
			'isImageUrl',
			'mediaURL',
			'mediaWidth',
			'mediaHeight',
			'mediaAlt',
		],
		Dimension: {
			group: {
				'Image size': 'imageSize',
				'Use original size': 'useInitSize',
				'Image width': 'img-width-general',
				'Image ratio': 'imageRatio',
			},
		},
		Alignment: {
			groupAttributes: 'alignment',
		},
		'Alt tag': ['mediaAlt', 'altSelector'],
		Caption: {
			group: {
				'Caption type': 'captionType',
				'Caption content': 'captionContent',
				'Caption position': 'captionPosition',
				'Caption gap': {
					props: 'caption-gap',
					hasBreakpoints: true,
				},
				'Caption gap unit': {
					props: 'caption-gap-unit',
					hasBreakpoints: true,
				},
				Typography: {
					groupAttributes: 'typography',
				},
				'Text alignment': {
					groupAttributes: 'textAlignment',
				},
				Link: { groupAttributes: 'link' },
			},
		},
		'Hover effects': {
			group: {
				Hover: {
					groupAttributes: 'hover',
				},
				'Hover background': {
					groupAttributes: 'hoverBackground',
				},
				'Hover background color': {
					groupAttributes: 'hoverBackgroundColor',
				},
				'Hover background gradient': {
					groupAttributes: 'hoverBackgroundGradient',
				},
				'Hover border': {
					groupAttributes: 'hoverBorder',
				},
				'Hover border radius': {
					groupAttributes: 'hoverBorderRadius',
				},
				'Hover border width': {
					groupAttributes: 'hoverBorderWidth',
				},
				'Hover content typography': {
					groupAttributes: 'hoverContentTypography',
				},
				'Hover margin': {
					groupAttributes: 'hoverMargin',
				},
				'Hover padding': {
					groupAttributes: 'hoverPadding',
				},
				'Hover title typography': {
					groupAttributes: 'hoverTitleTypography',
				},
			},
		},
		'Clip path': {
			groupAttributes: 'clipPath',
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
		},
	},
	canvas: {
		blockSpecific: {
			Size: {
				template: 'size',
			},
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
			title: 'Border',
			target: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
			property: ['border', 'border-radius'],
			hoverProp: `${prefix}border-status-hover`,
		},
		'box shadow': {
			title: 'Box shadow',
			target: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
			property: 'box-shadow',
			hoverProp: `${prefix}box-shadow-status-hover`,
		},
		'clip path': {
			title: 'Clip path',
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
