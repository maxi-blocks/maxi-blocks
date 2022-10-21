/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import { AlignmentControl, ImageShape, InfoBox } from '../../components';
import {
	getAlignmentFlexStyles,
	getImageShapeStyles,
} from '../../extensions/styles/helpers';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

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
				'Image width': 'imgWidth',
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
		Padding: {
			groupAttributes: 'padding',
			prefix,
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
const transition = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: `${imageWrapperClass} img`,
			property: ['border', 'border-radius'],
			hoverProp: `${prefix}border-status-hover`,
		},
		'box shadow': {
			title: 'Box shadow',
			target: `${imageWrapperClass} img`,
			property: 'box-shadow',
			hoverProp: `${prefix}box-shadow-status-hover`,
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			label: __('Alignment', 'maxi-blocks'),
			attrGroupName: 'alignment',
			component: props => (
				<AlignmentControl {...props} disableJustify {...props} />
			),
			helper: props => getAlignmentFlexStyles(props.obj),
			target: ' .maxi-image-block-wrapper',
		},
		{
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
	],
	canvas: getCanvasSettings({ name, customCss }),
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
