/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AxisControl from '../axis-control';
import BackgroundControl from '../background-control';
import BorderControl from '../border-control';
import FancyRadioControl from '../fancy-radio-control';
import Icon from '../icon';
import RangeSliderControl from '../range-slider-control';
import SelectControl from '../select-control';
import TypographyControl from '../typography-control';
import TextareaControl from '../textarea-control';

/**
 * External dependencies
 */
import BezierEditor from 'bezier-easing-editor';

import {
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
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
	const { className, onChange, blockStyle, clientId } = props;

	const classes = classnames('maxi-hover-effect-control', className);

	return (
		<div className={classes}>
			<FancyRadioControl
				label={__('Hover Animation', 'maxi-blocks')}
				selected={props['hover-type']}
				options={[
					{ label: <Icon icon={hoverNone} />, value: 'none' },
					{ label: <Icon icon={hoverBasic} />, value: 'basic' },
					{ label: <Icon icon={hoverText} />, value: 'text' },
				]}
				optionType='string'
				onChange={val => {
					onChange({
						'hover-type': val,
						'hover-transition-duration': 0.5,
					});
				}}
			/>
			<FancyRadioControl
				label={__('Preview', 'maxi-blocks')}
				selected={props['hover-preview']}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => onChange({ 'hover-preview': val })}
			/>
			{props['hover-type'] !== 'none' &&
				(props['hover-type'] === 'text' ||
					props['hover-basic-effect-type'] === 'zoom-in' ||
					props['hover-basic-effect-type'] === 'zoom-out' ||
					props['hover-basic-effect-type'] === 'slide' ||
					props['hover-basic-effect-type'] === 'rotate' ||
					props['hover-basic-effect-type'] === 'blur' ||
					props['hover-basic-effect-type'] === 'sepia' ||
					props['hover-basic-effect-type'] === 'clear-sepia' ||
					props['hover-basic-effect-type'] === 'grey-scale' ||
					props['hover-basic-effect-type'] ===
						'clear-greay-scale') && (
					<RangeSliderControl
						label={__('Duration(s)', 'maxi-blocks')}
						className={classes}
						value={props['hover-transition-duration']}
						defaultValue={getDefaultAttribute(
							'hover-transition-duration'
						)}
						onChange={val =>
							onChange({
								'hover-transition-duration': val,
							})
						}
						min={0}
						step={0.1}
						max={10}
						allowReset
						initialPosition={getDefaultAttribute(
							'hover-basic-transition-duration'
						)}
					/>
				)}
			{props['hover-type'] !== 'none' &&
				(props['hover-type'] === 'text' ||
					props['hover-basic-effect-type'] === 'zoom-in' ||
					props['hover-basic-effect-type'] === 'zoom-out' ||
					props['hover-basic-effect-type'] === 'slide' ||
					props['hover-basic-effect-type'] === 'rotate' ||
					props['hover-basic-effect-type'] === 'blur' ||
					props['hover-basic-effect-type'] === 'sepia' ||
					props['hover-basic-effect-type'] === 'clear-sepia' ||
					props['hover-basic-effect-type'] === 'grey-scale' ||
					props['hover-basic-effect-type'] ===
						'clear-greay-scale') && (
					<SelectControl
						label={__('Easing', 'maxi-blocks')}
						value={props['hover-transition-easing']}
						onChange={val =>
							onChange({ 'hover-transition-easing': val })
						}
						options={[
							{
								label: __('ease', 'maxi-blocks'),
								value: 'ease',
							},
							{
								label: __('linear', 'maxi-blocks'),
								value: 'linear',
							},
							{
								label: __('ease-in', 'maxi-blocks'),
								value: 'ease-in',
							},
							{
								label: __('ease-out', 'maxi-blocks'),
								value: 'ease-out',
							},
							{
								label: __('ease-in-out', 'maxi-blocks'),
								value: 'ease-in-out',
							},
							{
								label: __('cubic-bezier', 'maxi-blocks'),
								value: 'cubic-bezier',
							},
						]}
					/>
				)}
			{props['hover-transition-easing'] === 'cubic-bezier' && (
				<BezierEditor
					value={props['hover-transition-easing-cubic-bezier']}
					onChange={val =>
						onChange({
							'hover-transition-easing-cubic-bezier': val,
						})
					}
				/>
			)}
			{props['hover-type'] === 'basic' && (
				<>
					<SelectControl
						label={__('Effect Type', 'maxi-blocks')}
						value={props['hover-basic-effect-type']}
						onChange={val =>
							onChange({ 'hover-basic-effect-type': val })
						}
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
					/>
					{props['hover-type'] === 'basic' &&
						(props['hover-basic-effect-type'] === 'zoom-in' ||
							props['hover-basic-effect-type'] === 'zoom-out' ||
							props['hover-basic-effect-type'] === 'rotate' ||
							props['hover-basic-effect-type'] === 'blur' ||
							props['hover-basic-effect-type'] === 'slide') && (
							<>
								<RangeSliderControl
									label={__('Amount', 'maxi-blocks')}
									className={classes}
									value={
										props[
											`hover-basic-${props['hover-basic-effect-type']}-value`
										]
									}
									defaultValue={getDefaultAttribute(
										`hover-basic-${props['hover-basic-effect-type']}-value`
									)}
									onChange={val =>
										onChange({
											[`hover-basic-${props['hover-basic-effect-type']}-value`]:
												val,
										})
									}
									min={0}
									step={0.1}
									max={100}
									allowReset
									initialPosition={getDefaultAttribute(
										`hover-basic-${props['hover-basic-effect-type']}-value`
									)}
								/>
							</>
						)}
				</>
			)}
			{props['hover-type'] === 'text' && (
				<>
					<SelectControl
						label={__('Animation Type', 'maxi-blocks')}
						value={props['hover-text-effect-type']}
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
								label: __('Flip Horizontal', 'maxi-blocks'),
								value: 'flip-horiz',
							},
						]}
						onChange={val =>
							onChange({ 'hover-text-effect-type': val })
						}
					/>
					<FancyRadioControl
						type='classic-border'
						selected={props['hover-text-preset']}
						optionType='string'
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
						onChange={val => onChange({ 'hover-text-preset': val })}
					/>
					<TextareaControl
						placeholder={__(
							'Add your Hover Title Text here',
							'maxi-blocks'
						)}
						value={props['hover-title-typography-content']}
						onChange={val =>
							onChange({
								'hover-title-typography-content': isNil(val)
									? getDefaultAttribute(
											'hover-title-typography-content'
									  )
									: val,
							})
						}
					/>
					<FancyRadioControl
						label={__('Custom Hover Text', 'maxi-block')}
						selected={props['hover-title-typography-status']}
						options={[
							{ label: __('Yes', 'maxi-block'), value: 1 },
							{ label: __('No', 'maxi-block'), value: 0 },
						]}
						onChange={val =>
							onChange({ 'hover-title-typography-status': val })
						}
					/>
					{props['hover-title-typography-status'] && (
						<TypographyControl
							typography={{
								...getGroupAttributes(
									props,
									'hoverTitleTypography'
								),
							}}
							hideAlignment
							onChange={obj => onChange(obj)}
							prefix='hover-title-'
							disableCustomFormats
							blockStyle={blockStyle}
							disablePalette
							clientId={clientId}
						/>
					)}
					<hr />
					<TextareaControl
						placeholder={__(
							'Add your Hover Content Text here',
							'maxi-blocks'
						)}
						value={props['hover-content-typography-content']}
						onChange={val =>
							onChange({
								'hover-content-typography-content': isNil(val)
									? getDefaultAttribute(
											'hover-content-typography-content'
									  )
									: val,
							})
						}
					/>
					<FancyRadioControl
						label={__('Custom Content Text', 'maxi-block')}
						selected={props['hover-content-typography-status']}
						options={[
							{ label: __('Yes', 'maxi-block'), value: 1 },
							{ label: __('No', 'maxi-block'), value: 0 },
						]}
						onChange={val =>
							onChange({ 'hover-content-typography-status': val })
						}
					/>
					{props['hover-content-typography-status'] && (
						<TypographyControl
							typography={{
								...getGroupAttributes(
									props,
									'hoverContentTypography'
								),
							}}
							hideAlignment
							onChange={obj => onChange(obj)}
							prefix='hover-content-'
							disableCustomFormats
							blockStyle={blockStyle}
							disablePalette
							clientId={clientId}
						/>
					)}
					<hr />
					<BackgroundControl
						{...getGroupAttributes(props, [
							'hoverBackground',
							'hoverBackgroundColor',
							'hoverBackgroundGradient',
							'palette',
						])}
						onChange={obj => onChange(obj)}
						disableLayers
						disableClipPath
						disableImage
						disableVideo
						disableSVG
						prefix='hover-'
						clientId={clientId}
					/>
					<FancyRadioControl
						label={__('Custom Border', 'maxi-block')}
						selected={props['hover-border-status']}
						options={[
							{ label: __('Yes', 'maxi-block'), value: 1 },
							{ label: __('No', 'maxi-block'), value: 0 },
						]}
						onChange={val =>
							onChange({ 'hover-border-status': val })
						}
					/>
					{props['hover-border-status'] && (
						<BorderControl
							{...getGroupAttributes(props, [
								'hoverBorder',
								'hoverBorderWidth',
								'hoverBorderRadius',
							])}
							onChange={obj => onChange(obj)}
							prefix='hover-'
							disablePalette
							clientId={clientId}
						/>
					)}
					<FancyRadioControl
						label={__('Custom Padding', 'maxi-block')}
						selected={props['hover-padding-status']}
						options={[
							{ label: __('Yes', 'maxi-block'), value: 1 },
							{ label: __('No', 'maxi-block'), value: 0 },
						]}
						onChange={val =>
							onChange({ 'hover-padding-status': val })
						}
					/>
					{props['hover-padding-status'] && (
						<AxisControl
							{...getGroupAttributes(props, 'hoverPadding')}
							label={__('Padding', 'maxi-blocks')}
							onChange={obj => onChange(obj)}
							target='hover-padding'
							disableAuto
						/>
					)}
					<FancyRadioControl
						label={__('Custom Margin', 'maxi-block')}
						selected={props['hover-margin-status']}
						options={[
							{ label: __('Yes', 'maxi-block'), value: 1 },
							{ label: __('No', 'maxi-block'), value: 0 },
						]}
						onChange={val =>
							onChange({ 'hover-margin-status': val })
						}
					/>
					{props['hover-margin-status'] && (
						<AxisControl
							{...getGroupAttributes(props, 'hoverMargin')}
							label={__('Margin', 'maxi-blocks')}
							onChange={obj => onChange(obj)}
							target='hover-margin'
							optionType='string'
						/>
					)}
				</>
			)}
		</div>
	);
};

export default HoverEffectControl;
