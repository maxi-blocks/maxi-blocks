/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import * as Controls from '../../components';
import * as styleHelpers from '../../extensions/styles/helpers';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

const canvasSettings = [
	{
		label: __('Background / Layer', 'maxi-blocks'),
		attrGroupName: [
			'blockBackground',
			'border',
			'borderWidth',
			'borderRadius',
		],
		component: props => (
			<Controls.BlockBackgroundControl {...props} disableAddLayer />
		),
		helper: ({ obj, blockStyle }) =>
			styleHelpers.getBlockBackgroundStyles({ ...obj, blockStyle }),
	},
	{
		label: __('Border', 'maxi-blocks'),
		attrGroupName: ['border', 'borderWidth', 'borderRadius'],
		component: props => <Controls.BorderControl {...props} />,
		helper: props => styleHelpers.getBorderStyles(props),
	},
	{
		label: __('Box shadow', 'maxi-blocks'),
		attrGroupName: 'boxShadow',
		component: props => <Controls.BoxShadowControl {...props} />,
		helper: props => styleHelpers.getBoxShadowStyles(props),
	},
	{
		label: __('Opacity', 'maxi-blocks'),
		attrGroupName: 'opacity',
		component: props => (
			<Controls.OpacityControl
				{...props}
				opacity={getLastBreakpointAttribute({
					target: 'opacity',
					breakpoint: props.breakpoint,
					attributes: getGroupAttributes(props, 'opacity'),
				})}
				onChange={val =>
					props.onChange({ [`opacity-${props.breakpoint}`]: val })
				}
			/>
		),
		helper: props => styleHelpers.getOpacityStyles(props.obj),
	},
	{
		label: __('Height / Width', 'maxi-blocks'),
		attrGroupName: 'size',
		component: props => {
			const fullWidth = getLastBreakpointAttribute({
				target: 'full-width',
				breakpoint: props.breakpoint,
				attributes: getGroupAttributes(props, 'size'),
			});

			const isBlockFullWidth = fullWidth === 'full';

			return (
				<Controls.FullSizeControl
					{...props}
					hideWidth={isBlockFullWidth}
					hideMaxWidth={isBlockFullWidth}
					isBlockFullWidth={isBlockFullWidth}
				/>
			);
		},
		helper: props => styleHelpers.getSizeStyles(props.obj, props.prefix),
	},
	{
		label: __('Margin / Padding', 'maxi-blocks'),
		attrGroupName: ['margin', 'padding'],
		component: props => (
			<>
				<Controls.MarginControl {...props} />
				<Controls.PaddingControl {...props} />
			</>
		),
		helper: props => styleHelpers.getMarginPaddingStyles(props),
	},
	{
		label: __('Transform', 'maxi-blocks'),
		attrGroupName: 'transform',
		component: props => (
			<Controls.TransformControl
				{...props}
				uniqueID={props.attributes.uniqueID}
				depth={2}
			/>
		),
		helper: props => styleHelpers.getTransformStyles(props.obj),
	},
	{
		label: __('Position', 'maxi-blocks'),
		attrGroupName: 'position',
		component: props => <Controls.PositionControl {...props} />,
		helper: props => styleHelpers.getPositionStyles(props.obj),
	},
];

const settings = {
	'maxi-blocks/button-maxi': [
		{
			label: __('Button icon', 'maxi-blocks'),
			attrGroupName: [
				'icon',
				'iconBackground',
				'iconBackgroundGradient',
				'iconBackgroundColor',
				'iconBorder',
				'iconBorderWidth',
				'iconBorderRadius',
				'iconPadding',
			],
			component: props => {
				const { attributes } = props;
				const { svgType, 'icon-content': iconContent } = attributes;

				return iconContent ? (
					<Controls.IconControl {...props} svgType={svgType} />
				) : (
					'Add button icon to be able to use this control'
				);
			},
			helper: props => styleHelpers.getButtonIconStyles(props),
		},
		{
			label: __('Button typography', 'maxi-blocks'),
			attrGroupName: 'typography',
			component: props => (
				<Controls.TypographyControl
					{...props}
					hideAlignment
					disableCustomFormats
				/>
			),
			helper: props =>
				styleHelpers.getTypographyStyles({
					...props,
					textLevel: 'button',
				}),
			target: '.maxi-button-block__content',
		},
		{
			label: __('Button border', 'maxi-blocks'),
			attrGroupName: ['border', 'borderWidth', 'borderRadius'],
			prefix: 'button-',
			component: props => <Controls.BorderControl {...props} />,
			helper: props => styleHelpers.getBorderStyles(props),
			target: '.maxi-button-block__button',
		},
		{
			label: __('Button background', 'maxi-blocks'),
			attrGroupName: [
				'background',
				'backgroundColor',
				'backgroundGradient',
			],
			prefix: 'button-',
			component: props => (
				<Controls.BackgroundControl
					{...props}
					disableImage
					disableVideo
					disableSVG
				/>
			),
			helper: props =>
				styleHelpers.getBackgroundStyles({
					...props,
					...props.obj,
					isButton: true,
				}).background,
			target: '.maxi-button-block__button',
		},
		{
			label: __('Button box shadow', 'maxi-blocks'),
			attrGroupName: 'boxShadow',
			prefix: 'button-',
			component: props => <Controls.BoxShadowControl {...props} />,
			helper: props => styleHelpers.getBoxShadowStyles(props),
			target: '.maxi-button-block__button',
		},
		{
			label: __('Button margin/padding', 'maxi-blocks'),
			attrGroupName: ['margin', 'padding'],
			prefix: 'button-',
			component: props => (
				<>
					<Controls.MarginControl {...props} />
					<Controls.PaddingControl {...props} />
				</>
			),
			helper: props => styleHelpers.getMarginPaddingStyles(props),
			target: '.maxi-button-block__button',
		},
		...canvasSettings,
	],
	'maxi-blocks/column-maxi': [...canvasSettings],
	'maxi-blocks/container-maxi': [...canvasSettings],
	'maxi-blocks/divider-maxi': [
		{
			label: __('Divider box shadow', 'maxi-blocks'),
			attrGroupName: 'boxShadow',
			prefix: 'divider-',
			component: props => <Controls.BoxShadowControl {...props} />,
			helper: props => styleHelpers.getBoxShadowStyles(props),
			target: ' hr.maxi-divider-block__divider',
		},
		{
			label: __('Line settings', 'maxi-blocks'),
			attrGroupName: ['divider', 'size'],
			component: props => <Controls.DividerControl {...props} />,
			helper: props =>
				styleHelpers.getDividerStyles(
					props.obj,
					'line',
					props.blockStyle
				),
			target: ' hr.maxi-divider-block__divider',
		},
		...canvasSettings,
	],
	'maxi-blocks/group-maxi': [...canvasSettings],
	'maxi-blocks/image-maxi': [
		{
			label: __('Alignment', 'maxi-blocks'),
			attrGroupName: 'alignment',
			component: props => <Controls.AlignmentControl {...props} />,
			helper: props => styleHelpers.getAlignmentFlexStyles(props.obj),
		},
		...canvasSettings,
	],
	'maxi-blocks/map-maxi': [...canvasSettings],
	'maxi-blocks/number-counter-maxi': [...canvasSettings],
	'maxi-blocks/row-maxi': [...canvasSettings],
	'maxi-blocks/svg-icon-maxi': [
		{
			label: __('Icon colour'),
			attrGroupName: 'svg',
			component: props => {
				const { attributes, onChange } = props;
				const { blockStyle, content, svgType } = attributes;

				return (
					<Controls.SvgColorControl
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
				styleHelpers.getSVGStyles({
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
					<Controls.SvgStrokeWidthControl
						{...props}
						content={content}
						prefix='svg-'
					/>
				);
			},
			helper: props =>
				styleHelpers.getSVGStyles({
					...props,
					target: ' .maxi-svg-icon-block__icon',
					prefix: 'svg-',
				}),
		},
		{
			label: __('Icon background', 'maxi-blocks'),
			attrGroupName: [
				'background',
				'backgroundColor',
				'backgroundGradient',
			],
			prefix: 'svg-',
			component: props => (
				<Controls.BackgroundControl
					{...props}
					disableImage
					disableVideo
					disableClipPath
					disableSVG
				/>
			),
			helper: props =>
				styleHelpers.getBackgroundStyles({ ...props, ...props.obj })
					.background,
			target: ' .maxi-svg-icon-block__icon',
		},
		{
			label: __('Icon border', 'maxi-blocks'),
			attrGroupName: ['border', 'borderWidth', 'borderRadius'],
			prefix: 'svg-',
			component: props => <Controls.BorderControl {...props} />,
			helper: props => styleHelpers.getBorderStyles(props),
			target: ' .maxi-svg-icon-block__icon',
		},
		...canvasSettings,
	],
	'maxi-blocks/text-maxi': [
		{
			label: __('Alignment', 'maxi-blocks'),
			attrGroupName: 'textAlignment',
			component: props => (
				<Controls.AlignmentControl {...props} type='text' />
			),
			helper: props => styleHelpers.getAlignmentTextStyles(props.obj),
		},
		{
			label: __('Typography', 'maxi-blocks'),
			attrGroupName: 'typography',
			component: props => (
				<Controls.TypographyControl
					{...props}
					styleCardPrefix=''
					hideAlignment
					disableCustomFormats
				/>
			),
			helper: props => styleHelpers.getTypographyStyles({ ...props }),
			target: '.maxi-text-block__content',
		},
		...canvasSettings,
	],
};

export default settings;
