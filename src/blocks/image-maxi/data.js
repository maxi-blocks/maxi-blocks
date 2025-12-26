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
import { Suspense, lazy } from '@wordpress/element';
import Spinner from '@components/spinner';
const ClipPathControl = lazy(() => import(/* webpackChunkName: "maxi-shape-mask" */ '@components/clip-path-control'));
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
				<Suspense fallback={<Spinner />}>
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
				</Suspense>
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
