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
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '@extensions/relations';
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
