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
	const { hover, defaultHover, className, onChange } = props;

	const value = !isObject(hover) ? JSON.parse(hover) : hover;

	const hoverValue = !isObject(hover) ? JSON.parse(hover) : hover;

	const defaultValue = !isObject(defaultHover)
		? JSON.parse(defaultHover)
		: defaultHover;

	const classes = classnames('maxi-hover-effect-control', className);

	return (
		<div className={classes}>
			<__experimentalFancyRadioControl
				label={__('Hover Animation', 'maxi-blocks')}
				selected={hoverValue.type}
				options={[
					{ label: <Icon icon={hoverNone} />, value: 'none' },
					{ label: <Icon icon={hoverBasic} />, value: 'basic' },
					{ label: <Icon icon={hoverText} />, value: 'text' },
				]}
				onChange={val => {
					hoverValue.type = val;
					onChange(JSON.stringify(hoverValue));
				}}
			/>
			<__experimentalFancyRadioControl
				label={__('Preview', 'maxi-blocks')}
				selected={hoverValue.preview}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					hoverValue.preview = Number(val);
					onChange(JSON.stringify(hoverValue));
				}}
			/>
			{hoverValue.type === 'basic' && (
				<Fragment>
					<SelectControl
						label={__('Effect Type', 'maxi-blocks')}
						value={hoverValue.basicEffectType}
						options={[
							{ label: __('None', 'maxi-blocks'), value: 'none' },
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
							hoverValue.basicEffectType = val;
							onChange(JSON.stringify(hoverValue));
						}}
					/>
				</Fragment>
			)}
			{hoverValue.type === 'text' && (
				<Fragment>
					<SelectControl
						label={__('Animation Type', 'maxi-blocks')}
						value={hoverValue.textEffectType}
						options={[
							{ label: __('None', 'maxi-blocks'), value: 'none' },
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
								label: __('Flip Diag 1', 'maxi-blocks'),
								value: 'flip-diag-1',
							},
							{
								label: __('Flip Diag 2', 'maxi-blocks'),
								value: 'flip-diag-2',
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
							hoverValue.textEffectType = val;
							onChange(JSON.stringify(hoverValue));
						}}
					/>
					<__experimentalFancyRadioControl
						type='classic-border'
						selected={hoverValue.textPreset}
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
							hoverValue.textPreset = val;
							onChange(JSON.stringify(hoverValue));
						}}
					/>
					<TextareaControl
						placeholder={__(
							'Add your Hover Title Text here',
							'maxi-blocks'
						)}
						value={hoverValue.titleText}
						onChange={val => {
							hoverValue.titleText = val;
							onChange(JSON.stringify(hoverValue));
						}}
					/>
					<__experimentalFancyRadioControl
						label={__('Custom Hover Text', 'maxi-block')}
						selected={hoverValue.titleStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hoverValue.titleStatus = parseInt(val);
							onChange(JSON.stringify(hoverValue));
						}}
					/>
					{!!hoverValue.titleStatus && (
						<TypographyControl
							typography={hoverValue.titleTypography}
							defaultTypography={defaultValue.titleTypography}
							hideAlignment
							onChange={val => {
								hoverValue.titleTypography = val;
								onChange(JSON.stringify(hoverValue));
							}}
						/>
					)}
					<hr />
					<TextareaControl
						placeholder={__(
							'Add your Hover Content Text here',
							'maxi-blocks'
						)}
						value={hoverValue.contentText}
						onChange={val => {
							hoverValue.contentText = val;
							onChange(JSON.stringify(hoverValue));
						}}
					/>
					<__experimentalFancyRadioControl
						label={__('Custom Content Text', 'maxi-block')}
						selected={hoverValue.contentStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hoverValue.contentStatus = parseInt(val);
							onChange(JSON.stringify(hoverValue));
						}}
					/>
					{!!hoverValue.contentStatus && (
						<TypographyControl
							typography={hoverValue.contentTypography}
							defaultTypography={defaultValue.contentTypography}
							hideAlignment
							onChange={val => {
								hoverValue.contentTypography = val;
								onChange(JSON.stringify(hoverValue));
							}}
						/>
					)}
					<hr />
					<BackgroundControl
						background={hoverValue.background}
						defaultBackground={defaultValue.background}
						onChange={val => {
							hoverValue.background = val;
							onChange(JSON.stringify(hoverValue));
						}}
						disableClipPath
						disableImage
						disableVideo
					/>
					<__experimentalFancyRadioControl
						label={__('Custom Border', 'maxi-block')}
						selected={hoverValue.borderStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hoverValue.borderStatus = parseInt(val);
							onChange(JSON.stringify(hoverValue));
						}}
					/>
					{!!hoverValue.borderStatus && (
						<BorderControl
							border={hoverValue.border}
							defaultBorder={defaultValue.border}
							onChange={val => {
								hoverValue.border = val;
								onChange(JSON.stringify(hoverValue));
							}}
						/>
					)}
					<__experimentalFancyRadioControl
						label={__('Custom Padding', 'maxi-block')}
						selected={hoverValue.paddingStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hoverValue.paddingStatus = parseInt(val);
							onChange(JSON.stringify(hoverValue));
						}}
					/>
					{!!hoverValue.paddingStatus && (
						<__experimentalAxisControl
							values={hoverValue.padding}
							defaultValues={defaultValue.padding}
							disableAuto
							onChange={val => {
								hoverValue.padding = val;
								onChange(JSON.stringify(hoverValue));
							}}
						/>
					)}
					<__experimentalFancyRadioControl
						label={__('Custom Margin', 'maxi-block')}
						selected={hoverValue.marginStatus}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val => {
							hoverValue.marginStatus = parseInt(val);
							onChange(JSON.stringify(hoverValue));
						}}
					/>
					{!!hoverValue.marginStatus && (
						<__experimentalAxisControl
							values={hoverValue.margin}
							defaultValues={defaultValue.margin}
							disableAuto
							onChange={val => {
								hoverValue.margin = val;
								onChange(JSON.stringify(hoverValue));
							}}
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default HoverEffectControl;
