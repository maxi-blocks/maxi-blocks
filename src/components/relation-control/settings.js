/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * External dependencies.
 */
import { isEmpty, merge } from 'lodash';

/**
 * Internal dependencies.
 */
import InfoBox from '../info-box';
import * as Controls from '../../components';
import * as styleHelpers from '../../extensions/styles/helpers';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getIconWithColor,
} from '../../extensions/styles';
import getRowGapProps from '../../extensions/attributes/getRowGapProps';
import {
	getTransformCategories,
	getTransformSelectors,
} from '../transform-control/utils';
import getBlockCategoriesAndSelectors from '../../extensions/styles/getBlockCategoriesAndSelectors';
import getParentRowClientId from './getParentRowClientId';
import transitionsBlockObjs from '../../extensions/styles/transitions/transitionsBlockObjs';

const getTransformControl = name => {
	const { categories, selectors } = getBlockCategoriesAndSelectors(name);

	return {
		label: __('Transform', 'maxi-blocks'),
		attrGroupName: 'transform',
		component: props => (
			<Controls.TransformControl
				{...props}
				uniqueID={props.attributes.uniqueID}
				depth={2}
				selectors={getTransformSelectors(selectors)}
				categories={getTransformCategories(
					categories,
					props.attributes
				)}
				disableHover
			/>
		),
		helper: props =>
			styleHelpers.getTransformStyles(
				props.obj,
				getTransformSelectors(selectors)
			),
	};
};

const getCanvasSettings = name => [
	{
		label: __('Background / Layer', 'maxi-blocks'),
		transitionTarget: ' > .maxi-background-displayer > div',
		attrGroupName: [
			'blockBackground',
			'border',
			'borderWidth',
			'borderRadius',
		],
		component: props => {
			const { attributes } = props;
			const { 'background-layers': bgLayers } = attributes;

			return !isEmpty(bgLayers) ? (
				<Controls.BlockBackgroundControl {...props} disableAddLayer />
			) : (
				<InfoBox
					message={__('No background layers added', 'maxi-blocks')}
				/>
			);
		},
		helper: ({ obj, blockStyle }) =>
			styleHelpers.getBlockBackgroundStyles({ ...obj, blockStyle }),
	},
	{
		label: __('Border', 'maxi-blocks'),
		transitionTarget: ['', ' > .maxi-background-displayer'],
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
					hideWidth={isBlockFullWidth || name === 'column'}
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
		label: __('Position', 'maxi-blocks'),
		attrGroupName: 'position',
		component: props => <Controls.PositionControl {...props} />,
		helper: props => styleHelpers.getPositionStyles(props.obj),
	},
	...getTransformControl(name),
];

const settings = {
	'maxi-blocks/button-maxi': [
		{
			label: __('Button icon', 'maxi-blocks'),
			transitionTarget: [
				transitionsBlockObjs['button-maxi'].block['icon colour'].target,
				transitionsBlockObjs['button-maxi'].block['icon width'].target,
				transitionsBlockObjs['button-maxi'].block['icon background']
					.target,
				transitionsBlockObjs['button-maxi'].block['icon border'].target,
			],
			attrGroupName: [
				'icon',
				'iconBackground',
				'iconBackgroundGradient',
				'iconBackgroundColor',
				'iconBorder',
				'iconBorderWidth',
				'iconBorderRadius',
				'iconPadding',
				'typography',
			],
			component: props => {
				const { attributes, blockAttributes } = props;
				const { svgType, 'icon-content': iconContent } = attributes;
				const { 'icon-inherit': iconInherit } = blockAttributes;
				return iconContent ? (
					<Controls.IconControl
						{...props}
						svgType={svgType}
						isInteractionBuilder
						getIconWithColor={args =>
							getIconWithColor(attributes, args)
						}
						disableIconInherit={!iconInherit}
					/>
				) : (
					<InfoBox
						message={__(
							'Add button icon to be able to use this control'
						)}
					/>
				);
			},
			helper: props => styleHelpers.getButtonIconStyles(props),
		},
		{
			label: __('Button typography', 'maxi-blocks'),
			transitionTarget:
				transitionsBlockObjs['button-maxi'].block.typography.target,
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
			transitionTarget:
				transitionsBlockObjs['button-maxi'].block.border.target,
			attrGroupName: ['border', 'borderWidth', 'borderRadius'],
			prefix: 'button-',
			component: props => <Controls.BorderControl {...props} />,
			helper: props => styleHelpers.getBorderStyles(props),
			target: '.maxi-button-block__button',
		},
		{
			label: __('Button background', 'maxi-blocks'),
			transitionTarget:
				transitionsBlockObjs['button-maxi'].block['button background']
					.target,
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
					disableClipPath
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
			transitionTarget:
				transitionsBlockObjs['button-maxi'].block['box shadow'].target,
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
		...getCanvasSettings('button'),
	],
	'maxi-blocks/column-maxi': [
		{
			label: __('Column settings', 'maxi-blocks'),
			attrGroupName: ['columnSize', 'flex'],
			component: props => {
				const { getBlockAttributes } = select('core/block-editor');

				const rowPattern = getGroupAttributes(
					getBlockAttributes(getParentRowClientId(props.clientId)),
					'rowPattern'
				);

				return (
					<Controls.ColumnSizeControl
						{...props}
						rowPattern={rowPattern}
					/>
				);
			},
			helper: props => {
				const { getBlock } = select('core/block-editor');

				const parentRowBlock = getBlock(
					getParentRowClientId(props.clientId)
				);

				const columnsSize = parentRowBlock.innerBlocks.reduce(
					(acc, block) => ({
						...acc,
						[block.clientId]: getGroupAttributes(
							block.attributes,
							'columnSize'
						),
					}),
					{}
				);

				const columnNum = parentRowBlock.innerBlocks.length;
				const rowGapProps = getRowGapProps(parentRowBlock.attributes);

				return merge(
					styleHelpers.getColumnSizeStyles(
						props.obj,
						{
							...rowGapProps,
							columnNum,
							columnsSize,
						},
						props.clientId
					),
					styleHelpers.getFlexStyles(props.obj)
				);
			},
		},
		...getCanvasSettings('column'),
	],
	'maxi-blocks/container-maxi': [...getCanvasSettings('container')],
	'maxi-blocks/divider-maxi': [
		{
			label: __('Divider box shadow', 'maxi-blocks'),
			transitionTarget:
				transitionsBlockObjs['divider-maxi'].block['box shadow'].target,
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
		...getCanvasSettings('divider'),
	],
	'maxi-blocks/group-maxi': [...getCanvasSettings('group')],
	'maxi-blocks/image-maxi': [
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
		...getCanvasSettings('image'),
	],
	'maxi-blocks/map-maxi': [...getCanvasSettings('map')],
	'maxi-blocks/number-counter-maxi': [...getCanvasSettings('number-counter')],
	'maxi-blocks/row-maxi': [...getCanvasSettings('row')],
	'maxi-blocks/svg-icon-maxi': [
		{
			label: __('Icon colour'),
			transitionTarget:
				transitionsBlockObjs['svg-icon-maxi'].block.colour.target,
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
						// Needs a bit of a hack to get the correct value ⬇
						maxiSetAttributes={onChange}
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
			transitionTarget:
				transitionsBlockObjs['svg-icon-maxi'].block.background.target,
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
			transitionTarget:
				transitionsBlockObjs['svg-icon-maxi'].block.border.target,
			attrGroupName: ['border', 'borderWidth', 'borderRadius'],
			prefix: 'svg-',
			component: props => <Controls.BorderControl {...props} />,
			helper: props => styleHelpers.getBorderStyles(props),
			target: ' .maxi-svg-icon-block__icon',
		},
		...getCanvasSettings('svg-icon'),
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
			transitionTarget:
				transitionsBlockObjs['text-maxi'].canvas.typography.target,
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
		...getCanvasSettings('text'),
	],
};

export default settings;
