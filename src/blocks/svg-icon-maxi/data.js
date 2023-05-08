/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BackgroundControl, BorderControl } from '../../components';
import { createSelectors } from '../../extensions/attributes/custom-css';
import {
	createIconTransitions,
	transitionDefault,
} from '../../extensions/attributes/transitions';
import {
	getAdvancedSettings,
	getCanvasSettings,
} from '../../extensions/relations';
import {
	getBackgroundStyles,
	getBorderStyles,
	getSVGStyles,
} from '../../extensions/styles/helpers';
import { SvgColorControl } from './components';

/**
 * Classnames
 */
const blockClass = ' .maxi-svg-icon-block';
const iconClass = `${blockClass}__icon`;

const prefix = 's-';

/**
 * Data object
 */
const name = 'svg-icon-maxi';
const copyPasteMapping = {
	_exclude: ['content', 'svgType'],
	settings: {
		'Icon content': ['_st', '_c'],
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
				'Icon hover status': 's.sh',
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
			property: ['border', 'border-radius'],
			hoverProp: `${prefix}bo.sh`,
		},
		'box shadow': {
			title: 'Box shadow',
			target: iconClass,
			property: 'box-shadow',
			hoverProp: `${prefix}bs.sh`,
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
			hoverProp: `${prefix}b.sh`,
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			label: __('Icon colour'),
			transitionTarget: [
				transition.block.colour.target,
				transition.block['colour two'].target,
			],
			transitionTrigger: `${iconClass} svg`,
			hoverProp: 's.sh',
			attrGroupName: 'svg',
			component: props => {
				const { attributes, onChange } = props;
				const {
					_bs: blockStyle,
					_c: content,
					_st: svgType,
				} = attributes;

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
					prefix: 's-',
				}),
		},
		// TODO: fix #3619
		// {
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
			label: __('Icon background', 'maxi-blocks'),
			transitionTarget: transition.block.background.target,
			hoverProp: 's-b.sh',
			attrGroupName: [
				'background',
				'backgroundColor',
				'backgroundGradient',
			],
			prefix: 's-',
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
			transitionTarget: transition.block.border.target,
			hoverProp: 'svg-border-status-hover',
			attrGroupName: ['border', 'borderWidth', 'borderRadius'],
			prefix: 's-',
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

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
