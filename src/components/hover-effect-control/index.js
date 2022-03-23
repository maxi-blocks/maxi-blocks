/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import AxisControl from '../axis-control';
import BackgroundControl from '../background-control';
import BorderControl from '../border-control';
import Icon from '../icon';
import SelectControl from '../select-control';
import TextareaControl from '../textarea-control';
import ToggleSwitch from '../toggle-switch';
import TypographyControl from '../typography-control';
import SettingTabsControl from '../setting-tabs-control';

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
			<SettingTabsControl
				label={__('Hover Animation', 'maxi-blocks')}
				type='buttons'
				selected={props['hover-type']}
				items={[
					{ icon: <Icon icon={hoverNone} />, value: 'none' },
					{ icon: <Icon icon={hoverBasic} />, value: 'basic' },
					{ icon: <Icon icon={hoverText} />, value: 'text' },
				]}
				onChange={val => {
					onChange({
						'hover-type': val,
						'hover-transition-duration': 0.5,
					});
				}}
				hasBorder
			/>
			<ToggleSwitch
				label={__('Preview', 'maxi-blocks')}
				selected={props['hover-preview']}
				onChange={val => onChange({ 'hover-preview': val })}
			/>
			<ToggleSwitch
				label={__('Allow extension', 'maxi-blocks')}
				selected={props['hover-extension']}
				onChange={val => onChange({ 'hover-extension': val })}
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
						'clear-grey-scale') && (
					<AdvancedNumberControl
						label={__('Duration(s)', 'maxi-blocks')}
						value={props['hover-transition-duration']}
						onChangeValue={val => {
							onChange({
								'hover-transition-duration':
									val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						step={0.1}
						max={10}
						onReset={() =>
							onChange({
								'hover-transition-duration':
									getDefaultAttribute(
										'hover-transition-duration'
									),
							})
						}
						initialPosition={getDefaultAttribute(
							'hover-transition-duration'
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
						'clear-grey-scale') && (
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
								value: 'grey-scale',
							},
							{
								label: __('Clear Gray Scale', 'maxi-blocks'),
								value: 'clear-grey-scale',
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
								<AdvancedNumberControl
									label={__('Amount', 'maxi-blocks')}
									value={
										props[
											`hover-basic-${props['hover-basic-effect-type']}-value`
										]
									}
									onChangeValue={val => {
										onChange({
											[`hover-basic-${props['hover-basic-effect-type']}-value`]:
												val !== undefined && val !== ''
													? val
													: '',
										});
									}}
									min={0}
									step={0.1}
									max={100}
									onReset={() =>
										onChange({
											[`hover-basic-${props['hover-basic-effect-type']}-value`]:
												getDefaultAttribute([
													`hover-basic-${props['hover-basic-effect-type']}-value`,
												]),
										})
									}
									initialPosition={getDefaultAttribute([
										`hover-basic-${props['hover-basic-effect-type']}-value`,
									])}
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
					<SettingTabsControl
						type='buttons'
						fullWidthMode
						selected={props['hover-text-preset']}
						items={[
							{
								icon: <Icon icon={alignLeftTop} />,
								value: 'left-top',
							},
							{
								icon: <Icon icon={alignRightTop} />,
								value: 'right-top',
							},
							{
								icon: <Icon icon={alignCenterCenter} />,
								value: 'center-center',
							},
							{
								icon: <Icon icon={alignLeftBottom} />,
								value: 'left-bottom',
							},
							{
								icon: <Icon icon={alignRightBottom} />,
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
					<ToggleSwitch
						label={__('Custom Hover Text', 'maxi-block')}
						selected={props['hover-title-typography-status']}
						onChange={val =>
							onChange({
								'hover-title-typography-status': val,
							})
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
					<ToggleSwitch
						label={__('Custom Content Text', 'maxi-block')}
						selected={props['hover-content-typography-status']}
						onChange={val =>
							onChange({
								'hover-content-typography-status': val,
							})
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
							clientId={clientId}
						/>
					)}
					<hr />
					<BackgroundControl
						{...getGroupAttributes(props, [
							'hoverBackground',
							'hoverBackgroundColor',
							'hoverBackgroundGradient',
						])}
						onChange={obj => onChange(obj)}
						disableClipPath
						disableImage
						disableVideo
						disableSVG
						prefix='hover-'
						clientId={clientId}
					/>
					<ToggleSwitch
						label={__('Custom Border', 'maxi-block')}
						selected={props['hover-border-status']}
						onChange={val =>
							onChange({
								'hover-border-status': val,
							})
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
					<ToggleSwitch
						label={__('Custom Padding', 'maxi-block')}
						selected={props['hover-padding-status']}
						onChange={val =>
							onChange({
								'hover-padding-status': val,
							})
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
					<ToggleSwitch
						label={__('Custom Margin', 'maxi-block')}
						selected={props['hover-margin-status']}
						onChange={val =>
							onChange({
								'hover-margin-status': val,
							})
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
