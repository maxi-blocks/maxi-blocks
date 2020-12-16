/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl, TextareaControl, Icon } = wp.components;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import TypographyControl from '../typography-control';
import BackgroundControl from '../background-control';
import BorderControl from '../border-control';
import __experimentalAxisControl from '../axis-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import { isObject, isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import {
	hoverNone,
	hoverBasic,
	hoverText,
	alignCenterCenter,
	alignLeftTop,
	alignLeftBottom,
	alignRightTop,
	alignRightBottom,
} from '../../icons';

/**
 * Component
 */
const HoverEffectControl = props => {
	const { className, onChange } = props;

	const hover = { ...props.hover };
	const defaultHover = { ...props.defaultHover };

	const classes = classnames('maxi-hover-effect-control', className);

	return (
		<div className={classes}>
			<__experimentalFancyRadioControl
				label={__('Hover Animation', 'maxi-blocks')}
				selected={hover.type}
				options={[
					{ label: <Icon icon={hoverNone} />, value: 'none' },
					{ label: <Icon icon={hoverBasic} />, value: 'basic' },
					{ label: <Icon icon={hoverText} />, value: 'text' },
				]}
				onChange={val => {
					hover.type = val;
					onChange(hover);
				}}
			/>
			<__experimentalFancyRadioControl
				label={__('Preview', 'maxi-blocks')}
				selected={hover.preview}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					hover.preview = Number(val);
					onChange(hover);
				}}
			/>
			{hover.type === 'basic' && (
				<Fragment>
					<SelectControl
						label={__('Effect Type', 'maxi-blocks')}
						value={hover.basicEffectType}
						options={[
							{
								label: __('Zoom In', 'maxi-blocks'),
								value: 'zoom-in',
							},
							{
								label: __('Zoom Out', 'maxi-blocks'),
								value: 'zoom-out',
							},
							{
								label: __('Slide', 'maxi-blocks'),
								value: 'slide',
							},
							{
								label: __('Rotate', 'maxi-blocks'),
								value: 'rotate',
							},
							{
								label: __('Flashing', 'maxi-blocks'),
								value: 'flashing',
							},
							{ label: __('Blur', 'maxi-blocks'), value: 'blur' },
							{
								label: __('Clear Blur', 'maxi-blocks'),
								value: 'clear-blur',
							},
							{
								label: __('Sepia', 'maxi-blocks'),
								value: 'sepia',
							},
							{
								label: __('Clear Sepia', 'maxi-blocks'),
								value: 'clear-sepia',
							},
							{
								label: __('Gray Scale', 'maxi-blocks'),
								value: 'greay-scale',
							},
							{
								label: __('Clear Gray Scale', 'maxi-blocks'),
								value: 'clear-greay-scale',
							},
							{
								label: __('Shine', 'maxi-blocks'),
								value: 'shine',
							},
							{
								label: __('Circle Shine', 'maxi-blocks'),
								value: 'circle-shine',
							},
						]}
						onChange={val => {
							hover.basicEffectType = val;
							onChange(hover);
						}}
					/>
				</Fragment>
			)}
			{hover.type === 'text' && (
				<Fragment>
					<SelectControl
						label={__('Animation Type', 'maxi-blocks')}
						value={hover.textEffectType}
						options={[
							{ label: __('Fade', 'maxi-blocks'), value: 'fade' },
							{
								label: __('Push Up', 'maxi-blocks'),
								value: 'push-up',
							},
							{
								label: __('Push Right', 'maxi-blocks'),
								value: 'push-right',
							},
							{
								label: __('Push Down', 'maxi-blocks'),
								value: 'push-down',
							},
							{
								label: __('Push Left', 'maxi-blocks'),
								value: 'push-left',
							},
							{
								label: __('Slide Up', 'maxi-blocks'),
								value: 'slide-up',
							},
							{
								label: __('Slide Right', 'maxi-blocks'),
								value: 'slide-right',
							},
							{
								label: __('Slide Down', 'maxi-blocks'),
								value: 'slide-down',
							},
							{
								label: __('Slide Left', 'maxi-blocks'),
								value: 'slide-left',
							},
							{
								label: __('Hinge Up', 'maxi-blocks'),
								value: 'hinge-up',
							},
							{
								label: __('Hinge Right', 'maxi-blocks'),
								value: 'hinge-right',
							},
							{
								label: __('Hinge Down', 'maxi-blocks'),
								value: 'hinge-down',
							},
							{
								label: __('Hinge Left', 'maxi-blocks'),
								value: 'hinge-left',
							},
							{
								label: __('Flip Horizontal', 'maxi-blocks'),
								value: 'flip-horiz',
							},
							{
								label: __('Flip Vertical', 'maxi-blocks'),
								value: 'flip-vert',
							},
							{
								label: __('Fold Up', 'maxi-blocks'),
								value: 'fold-up',
							},
							{
								label: __('Fold Right', 'maxi-blocks'),
								value: 'fold-right',
							},
							{
								label: __('Fold Down', 'maxi-blocks'),
								value: 'fold-down',
							},
							{
								label: __('Fold Left', 'maxi-blocks'),
								value: 'fold-left',
							},
							{
								label: __('Zoom In', 'maxi-blocks'),
								value: 'zoom-in',
							},
							{
								label: __('Zoom Out', 'maxi-blocks'),
								value: 'zoom-out',
							},
							{
								label: __('Zoom Out Up', 'maxi-blocks'),
								value: 'zoom-out-up',
							},
							{
								label: __('Zoom Out Down', 'maxi-blocks'),
								value: 'zoom-out-down',
							},
							{
								label: __('Zoom Out Right', 'maxi-blocks'),
								value: 'zoom-out-right',
							},
							{
								label: __('Zoom Out Left', 'maxi-blocks'),
								value: 'zoom-out-left',
							},
							{
								label: __(
									'Zoom Out Flip Horizontal',
									'maxi-blocks'
								),
								value: 'zoom-out-flip-horiz',
							},
							{
								label: __(
									'Zoom Out Flip Vertical',
									'maxi-blocks'
								),
								value: 'zoom-out-flip-vert',
							},
							{ label: __('Blur', 'maxi-blocks'), value: 'blur' },
						]}
						onChange={val => {
							hover.textEffectType = val;
							onChange(hover);
						}}
					/>
					<__experimentalFancyRadioControl
						type='classic-border'
						selected={hover.textPreset}
						options={[
							{
								label: <Icon icon={alignLeftTop} />,
								value: 'left-top',
							},
							{
								label: <Icon icon={alignRightTop} />,
								value: 'right-top',
							},
							{
								label: <Icon icon={alignCenterCenter} />,
								value: 'center-center',
							},
							{
								label: <Icon icon={alignLeftBottom} />,
								value: 'left-bottom',
							},
							{
								label: <Icon icon={alignRightBottom} />,
								value: 'right-bottom',
							},
						]}
						onChange={val => {
							hover.textPreset = val;
							onChange(hover);
						}}
					/>
					<TextareaControl
						placeholder={__(
							'Add your Hover Title Text here',
							'maxi-blocks'
						)}
						value={hover.titleText}
						onChange={val => {
							isNil(val)
								? (hover.titleText = defaultHover.titleText)
								: (hover.titleText = val);
							onChange(hover);
						}}
					/>
					<__experimentalFancyRadioControl
						label={__('Custom Hover Text', 'maxi-block')}
						selected={hover.titleStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hover.titleStatus = parseInt(val);
							onChange(hover);
						}}
					/>
					{!!hover.titleStatus && (
						<TypographyControl
							typography={hover.titleTypography}
							defaultTypography={defaultHover.titleTypography}
							hideAlignment
							onChange={() => {
								onChange(hover);
							}}
						/>
					)}
					<hr />
					<TextareaControl
						placeholder={__(
							'Add your Hover Content Text here',
							'maxi-blocks'
						)}
						value={hover.contentText}
						onChange={val => {
							isNil(val)
								? (hover.contentText = defaultHover.contentText)
								: (hover.contentText = val);
							onChange(hover);
						}}
					/>
					<__experimentalFancyRadioControl
						label={__('Custom Content Text', 'maxi-block')}
						selected={hover.contentStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hover.contentStatus = parseInt(val);
							onChange(hover);
						}}
					/>
					{!!hover.contentStatus && (
						<TypographyControl
							typography={hover.contentTypography}
							defaultTypography={defaultHover.contentTypography}
							hideAlignment
							onChange={() => {
								onChange(hover);
							}}
						/>
					)}
					<hr />
					<BackgroundControl
						background={hover.background}
						defaultBackground={defaultHover.background}
						onChange={val => {
							hover.background = val;
							onChange(hover);
						}}
						disableClipPath
						disableImage
						disableVideo
						disableSVG
					/>
					<__experimentalFancyRadioControl
						label={__('Custom Border', 'maxi-block')}
						selected={hover.borderStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hover.borderStatus = parseInt(val);
							onChange(hover);
						}}
					/>
					{!!hover.borderStatus && (
						<BorderControl
							border={hover.border}
							defaultBorder={defaultHover.border}
							onChange={val => {
								hover.border = val;
								onChange(hover);
							}}
						/>
					)}
					<__experimentalFancyRadioControl
						label={__('Custom Padding', 'maxi-block')}
						selected={hover.paddingStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hover.paddingStatus = parseInt(val);
							onChange(hover);
						}}
					/>
					{!!hover.paddingStatus && (
						<__experimentalAxisControl
							values={hover.padding}
							defaultValues={defaultHover.padding}
							disableAuto
							onChange={val => {
								hover.padding = val;
								onChange(hover);
							}}
						/>
					)}
					<__experimentalFancyRadioControl
						label={__('Custom Margin', 'maxi-block')}
						selected={hover.marginStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hover.marginStatus = parseInt(val);
							onChange(hover);
						}}
					/>
					{!!hover.marginStatus && (
						<__experimentalAxisControl
							values={hover.margin}
							defaultValues={defaultHover.margin}
							disableAuto
							onChange={val => {
								hover.margin = val;
								onChange(hover);
							}}
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default HoverEffectControl;
