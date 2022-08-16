import { __ } from '@wordpress/i18n';

import { createSelectors } from '../../extensions/styles/custom-css';
import * as Controls from '../../components';
import * as styleHelpers from '../../extensions/styles/helpers';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-image-block';
const imageClass = `${blockClass}__image`;
const imageWrapperClass = `${blockClass}-wrapper`;

const prefix = 'image-';

const data = {
	name: 'image-maxi',
	copyPasteMapping: {
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
	},
	customCss: {
		selectors: createSelectors({
			canvas: {
				label: 'canvas',
				target: '',
			},
			image: {
				label: 'image',
				target: imageClass,
			},
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
	},
	transition: {
		...transitionDefault,
		block: {
			border: {
				title: 'Border',
				target: `${imageWrapperClass} img`,
				property: 'border',
				prefix,
			},
			'box shadow': {
				title: 'Box shadow',
				target: `${imageWrapperClass} img`,
				property: 'box-shadow',
				prefix,
			},
		},
	},
	get interactionBuilderSettings() {
		delete this.interactionBuilderSettings;
		this.interactionBuilderSettings = [
			{
				label: __('Alignment', 'maxi-blocks'),
				attrGroupName: 'alignment',
				component: props => <Controls.AlignmentControl {...props} />,
				helper: props => styleHelpers.getAlignmentFlexStyles(props.obj),
				target: ' .maxi-image-block-wrapper',
			},
			{
				label: __('Shape mask', 'maxi-blocks'),
				attrGroupName: 'imageShape',
				component: props => {
					const { SVGElement } = props.blockAttributes;

					return SVGElement ? (
						<Controls.ImageShape
							{...props}
							icon={SVGElement}
							disableModal
							disableImagePosition
							disableImageRatio
						/>
					) : (
						<Controls.InfoBox
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
							transform: styleHelpers.getImageShapeStyles(
								type,
								props.obj,
								'',
								true
							),
						};
						return acc;
					}, {}),
			},
			...getCanvasSettings(this),
		];
		return this.interactionBuilderSettings;
	},
};

const { copyPasteMapping, customCss, transition, interactionBuilderSettings } =
	data;

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
