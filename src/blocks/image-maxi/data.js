/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/attributes/custom-css';
import {
	AlignmentControl,
	BorderControl,
	ImageShape,
	InfoBox,
	ClipPathControl,
} from '../../components';
import {
	getAlignmentFlexStyles,
	getBorderStyles,
	getClipPathStyles,
	getImageShapeStyles,
} from '../../extensions/styles/helpers';
import { getGroupAttributes } from '../../extensions/attributes';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';
import { transitionDefault } from '../../extensions/attributes/transitions';

import { getEditorWrapper } from '../../extensions/dom';

/**
 * Classnames
 */
const blockClass = ' .maxi-image-block';
const imageClass = `${blockClass}__image`;
const imageWrapperClass = `${blockClass}-wrapper`;

const prefix = 'im-';

/**
 * Data object
 */
const name = 'image-maxi';
const copyPasteMapping = {
	_exclude: ['_mi', '_iiu', '_mu', '_mew', '_meh', '_mal'],
	settings: {
		Image: ['_mi', '_iiu', '_mu', '_mew', '_meh', '_mal'],
		Dimension: {
			group: {
				'Image size': '_is',
				'Use original size': '_uis',
				'Image width': '_iw',
				'Image ratio': '_ir',
			},
		},
		Alignment: {
			groupAttributes: 'alignment',
		},
		'Alt tag': ['_mal', '_as'],
		Caption: {
			group: {
				'Caption type': '_ct',
				'Caption content': '_cco',
				'Caption position': '_cpo',
				'Caption gap': {
					props: '_cga',
					hasBreakpoints: true,
				},
				'Caption gap unit': {
					props: '_cga.u',
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
		c: '',
		im: imageClass,
	}),
	categories: ['c', 'be c', 'a c', 'im', 'be im', 'a im', 'bg', 'bg h'],
};
const transition = {
	...transitionDefault,
	b: {
		bo: {
			ti: 'Border',
			ta: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
			p: ['border', 'border-radius'],
			hp: `${prefix}bo.sh`,
		},
		bs: {
			ti: 'Box shadow',
			ta: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
			p: 'box-shadow',
			hp: `${prefix}bs.sh`,
		},
		cp: {
			ti: 'Clip path',
			ta: [`${imageWrapperClass} img`, `${imageWrapperClass} svg`],
			p: 'clip-path',
			hp: '_cp.sh',
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			label: __('Alignment', 'maxi-blocks'),
			attrGroupName: 'alignment',
			component: props => <AlignmentControl disableJustify {...props} />,
			helper: props => getAlignmentFlexStyles(props.obj),
			target: imageWrapperClass,
			disableTransition: true,
		},
		{
			label: __('Shape mask', 'maxi-blocks'),
			attrGroupName: 'imageShape',
			component: props => {
				const { _se: SVGElement } = props.blockAttributes;

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
			label: __('Clip-path', 'maxi-blocks'),
			attrGroupName: 'clipPath',
			transitionTarget: transition.b.cp.ta,
			hoverProp: '_cp.sh',
			component: props => (
				<ClipPathControl
					{...props}
					getBounds={() =>
						getEditorWrapper()
							.querySelector(
								`.${props.attributes._uid}${imageClass}`
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
		},
		{
			label: __('Border', 'maxi-blocks'),
			transitionTarget: transition.b.bo.ta,
			hoverProp: 'im-bo.sh',
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

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
