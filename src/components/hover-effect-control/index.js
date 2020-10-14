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
import SizeControl from '../size-control';
import BackgroundControl from '../background-control';
import BorderControl from '../border-control';
import __experimentalAxisControl from '../axis-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import { isObject } from 'lodash';
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
	const { hover, defaultHover, className, onChange, uniqueID } = props;

	const value = !isObject(hover) ? JSON.parse(hover) : hover;

	const { settings: hoverSettings } = value;

	const defaultValue = !isObject(defaultHover)
		? JSON.parse(defaultHover)
		: defaultHover;

	const { settings: defaultHoverSettings } = defaultValue;

	const classes = classnames('maxi-hover-effect-control', className);

	return (
		<div className={classes}>
			<__experimentalFancyRadioControl
				label={__('Hover Animation', 'maxi-blocks')}
				selected={hoverSettings.type}
				options={[
					{ label: <Icon icon={hoverNone} />, value: 'none' },
					{ label: <Icon icon={hoverBasic} />, value: 'basic' },
					{ label: <Icon icon={hoverText} />, value: 'text' },
				]}
				onChange={val => {
					hoverSettings.type = val;
					onChange(JSON.stringify(value));
				}}
			/>
			{hoverSettings.type === 'basic' && (
				<Fragment>
					<SelectControl
						label={__('Effect Type', 'maxi-blocks')}
						value={hoverSettings.effectType}
						options={[
							{ label: 'Zoom In', value: 'zoom-in' },
							{ label: 'Zoom Out', value: 'zoom-out' },
							{ label: 'Slide', value: 'slide' },
							{ label: 'Rotate', value: 'rotate' },
							{ label: 'Flashing', value: 'flashing' },
							{ label: 'Blur', value: 'blur' },
							{ label: 'Clear Blur', value: 'clear-blur' },
							{ label: 'Sepia', value: 'sepia' },
							{ label: 'Clear Sepia', value: 'clear-sepia' },
							{ label: 'Gray Scale', value: 'greay-scale' },
							{
								label: 'Clear Gray Scale',
								value: 'clear-greay-scale',
							},
							{
								label: 'Shine',
								value: 'shine',
							},
							{
								label: 'Circle Shine',
								value: 'circle-shine',
							},
						]}
						onChange={val => {
							hoverSettings.effectType = val;
							onChange(JSON.stringify(value));
						}}
					/>
					<SizeControl
						label={__('Duration (s)', 'maxi-blocks')}
						disableUnit
						min={0}
						max={10}
						initial={1}
						step={0.1}
						value={hoverSettings.duration}
						defaultValue={defaultHoverSettings.duration}
						onChangeValue={val => {
							hoverSettings.duration = val;
							onChange(JSON.stringify(value));
						}}
					/>
				</Fragment>
			)}
			{hoverSettings.type === 'text' && (
				<Fragment>
					<SelectControl
						label={__('Animation Type', 'maxi-blocks')}
						value={hoverSettings.effectType}
						options={[
							{ label: 'Fade', value: 'fade' },
							{ label: 'Push Up', value: 'push-up' },
							{ label: 'Push Right', value: 'push-right' },
							{ label: 'Push Down', value: 'push-down' },
							{ label: 'Push Left', value: 'push-left' },
							{ label: 'Slide Up', value: 'slide-up' },
							{ label: 'Slide Right', value: 'slide-right' },
							{ label: 'Slide Down', value: 'slide-down' },
							{ label: 'Slide Left', value: 'slide-left' },
							{ label: 'Hinge Up', value: 'hinge-up' },
							{ label: 'Hinge Right', value: 'hinge-right' },
							{ label: 'Hinge Down', value: 'hinge-down' },
							{ label: 'Hinge Left', value: 'hinge-left' },
							{ label: 'Flip Horizontal', value: 'flip-horiz' },
							{ label: 'Flip Vertical', value: 'flip-vert' },
							{ label: 'Flip Diag 1', value: 'flip-diag-1' },
							{ label: 'Flip Diag 2', value: 'flip-diag-2' },
							{ label: 'Fold Up', value: 'fold-up' },
							{ label: 'Fold Right', value: 'fold-right' },
							{ label: 'Fold Down', value: 'fold-down' },
							{ label: 'Fold Left', value: 'fold-left' },
							{ label: 'Zoom In', value: 'zoom-in' },
							{ label: 'Zoom Out', value: 'zoom-out' },
							{ label: 'Zoom Out Up', value: 'zoom-out-up' },
							{ label: 'Zoom Out Down', value: 'zoom-out-down' },
							{
								label: 'Zoom Out Right',
								value: 'zoom-out-right',
							},
							{ label: 'Zoom Out Left', value: 'zoom-out-left' },
							{
								label: 'Zoom Out Flip Horizontal',
								value: 'zoom-out-flip-horiz',
							},
							{
								label: 'Zoom Out Flip Vertical',
								value: 'zoom-out-flip-vert',
							},
							{ label: 'Blur', value: 'blur' },
						]}
						onChange={val => {
							hoverSettings.effectType = val;
							onChange(JSON.stringify(value));
						}}
					/>
					<__experimentalFancyRadioControl
						type='classic-border'
						selected={value.textPreset}
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
							value.textPreset = val;
							onChange(JSON.stringify(value));
						}}
					/>
					<SizeControl
						label={__('Duration (s)', 'maxi-blocks')}
						disableUnit
						min={0}
						max={10}
						initial={1}
						step={0.1}
						value={hoverSettings.duration}
						defaultValue={defaultHoverSettings.duration}
						onChangeValue={val => {
							hoverSettings.duration = val;
							onChange(JSON.stringify(value));
						}}
					/>
					<TextareaControl
						placeholder={__(
							'Add your Hover Title Text here',
							'maxi-blocks'
						)}
						value={value.titleText}
						onChange={val => {
							value.titleText = val;
							onChange(JSON.stringify(value));
						}}
					/>
					<__experimentalFancyRadioControl
						label={__('Custom Hover Text', 'maxi-block')}
						selected={value.titleStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							value.titleStatus = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!value.titleStatus && (
						<TypographyControl
							typography={value.titleTypography}
							defaultTypography={defaultValue.titleTypography}
							hideAlignment
							onChange={val => {
								value.titleTypography = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}
					<hr />
					<TextareaControl
						placeholder={__(
							'Add your Hover Content Text here',
							'maxi-blocks'
						)}
						value={value.contentText}
						onChange={val => {
							value.contentText = val;
							onChange(JSON.stringify(value));
						}}
					/>
					<__experimentalFancyRadioControl
						label={__('Custom Content Text', 'maxi-block')}
						selected={value.contentStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							value.contentStatus = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!value.contentStatus && (
						<TypographyControl
							typography={value.contentTypography}
							defaultTypography={defaultValue.contentTypography}
							hideAlignment
							onChange={val => {
								value.contentTypography = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}
					<hr />
					<BackgroundControl
						background={value.background}
						defaultBackground={defaultValue.background}
						onChange={val => {
							value.background = val;
							onChange(JSON.stringify(value));
						}}
						disableClipPath
						disableImage
						disableVideo
					/>
					<__experimentalFancyRadioControl
						label={__('Custom Border', 'maxi-block')}
						selected={value.borderStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							value.borderStatus = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!value.borderStatus && (
						<BorderControl
							border={value.border}
							defaultBorder={defaultValue.border}
							onChange={val => {
								value.border = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}
					<__experimentalFancyRadioControl
						label={__('Custom Padding', 'maxi-block')}
						selected={value.paddingStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							value.paddingStatus = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!value.paddingStatus && (
						<__experimentalAxisControl
							values={value.padding}
							defaultValues={defaultValue.padding}
							disableAuto
							onChange={val => {
								value.padding = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}
					<__experimentalFancyRadioControl
						label={__('Custom Margin', 'maxi-block')}
						selected={value.marginStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							value.marginStatus = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!value.marginStatus && (
						<__experimentalAxisControl
							values={value.margin}
							defaultValues={defaultValue.margin}
							disableAuto
							onChange={val => {
								value.margin = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default HoverEffectControl;
