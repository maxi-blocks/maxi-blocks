/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import FancyRadioControl from '../fancy-radio-control';
import ToggleSwitch from '../toggle-switch';
import ColorControl from '../color-control';
import AxisControl from '../axis-control';
import GradientControl from '../gradient-control';
import BorderControl from '../border-control';
import InfoBox from '../info-box';
import {
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import SvgWidthControl from '../svg-width-control';
import SvgStrokeWidthControl from '../svg-stroke-width-control';
import MaxiModal from '../../editor/library/modal';
import Icon from '../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	smileIcon,
	backgroundColor,
	backgroundGradient,
	solid,
} from '../../icons';

/**
 * Component
 */
const IconControl = props => {
	const {
		className,
		onChange,
		clientId,
		deviceType,
		parentBlockStyle,
		isHover = false,
	} = props;

	const classes = classnames('maxi-icon-control', className);

	const [iconStyle, setIconStyle] = useState('color');

	const getOptions = () => {
		const options = [];

		options.push({
			label: <Icon icon={smileIcon} />,
			value: 'color',
		});

		options.push({
			label: <Icon icon={backgroundColor} />,
			value: 'background-color',
		});

		options.push({
			label: <Icon icon={backgroundGradient} />,
			value: 'gradient',
		});

		options.push({
			label: <Icon icon={solid} />,
			value: 'border',
		});

		return options;
	};

	return (
		<div className={classes}>
			{!isHover && deviceType === 'general' && (
				<MaxiModal
					type='button-icon'
					style={parentBlockStyle}
					onSelect={obj => onChange(obj)}
					onRemove={obj => onChange(obj)}
					icon={props['icon-content']}
				/>
			)}
			{isHover && (
				<ToggleSwitch
					label={__('Enable Icon Hover', 'maxi-blocks')}
					selected={props['icon-status-hover']}
					onChange={val =>
						onChange({
							'icon-status-hover': val,
						})
					}
				/>
			)}
			{(props['icon-content'] ||
				(isHover && props['icon-status-hover'])) && (
				<>
					{!isHover && deviceType === 'general' && (
						<>
							<hr />
							<ToggleSwitch
								label={__(
									'Icon only (remove text)',
									'maxi-blocks'
								)}
								className='maxi-sc-color-palette__custom'
								selected={props['icon-only']}
								onChange={val =>
									onChange({
										'icon-only': val,
									})
								}
							/>
						</>
					)}
					<SvgWidthControl
						prefix='icon-'
						{...getGroupAttributes(
							props,
							`icon${isHover ? 'Hover' : ''}`,
							isHover
						)}
						onChange={obj => {
							onChange(obj);
						}}
						breakpoint={deviceType}
						isHover={isHover}
					/>
					<SvgStrokeWidthControl
						prefix='icon-'
						{...getGroupAttributes(
							props,
							`icon${isHover ? 'Hover' : ''}`,
							isHover
						)}
						onChange={obj => {
							onChange(obj);
						}}
						breakpoint={deviceType}
						isHover={isHover}
					/>
					{!isHover && (
						<>
							<AdvancedNumberControl
								label={__('Spacing', 'maxi-blocks')}
								min={0}
								max={999}
								initial={1}
								step={1}
								breakpoint={deviceType}
								value={props[`icon-spacing-${deviceType}`]}
								onChangeValue={val => {
									onChange({
										[`icon-spacing-${deviceType}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								onReset={() =>
									onChange({
										[`icon-spacing-${deviceType}`]:
											getDefaultAttribute(
												`icon-spacing-${deviceType}`
											),
									})
								}
							/>
							{deviceType === 'general' && (
								<>
									<FancyRadioControl
										label={__(
											'Icon Position',
											'maxi-block'
										)}
										selected={props['icon-position']}
										options={[
											{
												label: __('Left', 'maxi-block'),
												value: 'left',
											},
											{
												label: __(
													'Right',
													'maxi-block'
												),
												value: 'right',
											},
										]}
										optionType='string'
										onChange={val =>
											onChange({
												'icon-position': val,
											})
										}
									/>
									<ToggleSwitch
										label={__(
											'Inherit Colour/Background from Button',
											'maxi-block'
										)}
										selected={props['icon-inherit']}
										onChange={val =>
											onChange({
												'icon-inherit': val,
											})
										}
									/>
								</>
							)}
						</>
					)}
					<FancyRadioControl
						label=''
						fullWidthMode
						selected={iconStyle}
						options={getOptions()}
						optionType='string'
						onChange={val => setIconStyle(val)}
					/>
					{iconStyle === 'color' && (
						<>
							{!props['icon-inherit'] ? (
								<ColorControl
									label={__('Icon', 'maxi-blocks')}
									color={
										props[
											`icon-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									defaultColor={getDefaultAttribute(
										'icon-color',
										isHover
									)}
									paletteColor={
										props[
											`icon-palette-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									paletteStatus={
										props[
											`icon-palette-color-status${
												isHover ? '-hover' : ''
											}`
										]
									}
									onChange={({
										color,
										paletteColor,
										paletteStatus,
									}) => {
										onChange({
											[`icon-color${
												isHover ? '-hover' : ''
											}`]: color,
											[`icon-palette-color${
												isHover ? '-hover' : ''
											}`]: paletteColor,
											[`icon-palette-color-status${
												isHover ? '-hover' : ''
											}`]: paletteStatus,
										});
									}}
									disableOpacity
									isHover={isHover}
								/>
							) : (
								<InfoBox
									key='maxi-warning-box__icon-color'
									message={__(
										'Icon colour is inheriting from button.',
										'maxi-blocks'
									)}
									links={[
										{
											title: __(
												'Button colour',
												'maxi-blocks'
											),
											panel: 'typography',
										},
									]}
								/>
							)}
						</>
					)}
					{iconStyle === 'background-color' && (
						<>
							{!props['icon-inherit'] ? (
								<ColorControl
									label={__('Icon background', 'maxi-blocks')}
									color={
										props[
											`icon-background-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									defaultColor={getDefaultAttribute(
										'icon-background-color',
										isHover
									)}
									paletteColor={
										props[
											`icon-background-palette-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									paletteStatus={
										props[
											`icon-background-palette-color-status${
												isHover ? '-hover' : ''
											}`
										]
									}
									onChange={({
										color,
										paletteColor,
										paletteStatus,
									}) => {
										onChange({
											[`icon-background-color${
												isHover ? '-hover' : ''
											}`]: color,
											[`icon-background-palette-color${
												isHover ? '-hover' : ''
											}`]: paletteColor,
											[`icon-background-palette-color-status${
												isHover ? '-hover' : ''
											}`]: paletteStatus,
										});
									}}
									isHover={isHover}
								/>
							) : (
								<InfoBox
									key='maxi-warning-box__icon-background'
									message={__(
										'Icon background is inheriting from button.',
										'maxi-blocks'
									)}
									links={[
										{
											title: __(
												'Button Background colour',
												'maxi-blocks'
											),
											panel: 'background',
										},
									]}
								/>
							)}
						</>
					)}
					{iconStyle === 'gradient' && (
						<GradientControl
							label={__(
								'Icon Background Gradient',
								'maxi-blocks'
							)}
							gradient={
								props[
									`icon-background-gradient${
										isHover ? '-hover' : ''
									}`
								]
							}
							gradientOpacity={
								props[
									`icon-background-gradient-opacity${
										isHover ? '-hover' : ''
									}`
								]
							}
							defaultGradient={getDefaultAttribute(
								'icon-background-gradient',
								isHover
							)}
							onChange={val =>
								onChange({
									[`icon-background-gradient${
										isHover ? '-hover' : ''
									}`]: val,
								})
							}
							onChangeOpacity={val =>
								onChange({
									[`icon-background-gradient-opacity${
										isHover ? '-hover' : ''
									}`]: val,
								})
							}
							isHover={isHover}
						/>
					)}
					{iconStyle === 'border' && (
						<BorderControl
							{...getGroupAttributes(props, [
								`iconBorder${isHover ? 'Hover' : ''}`,
								`iconBorderWidth${isHover ? 'Hover' : ''}`,
								`iconBorderRadius${isHover ? 'Hover' : ''}`,
							])}
							prefix='icon-'
							onChange={obj => onChange(obj)}
							breakpoint={deviceType}
							clientId={clientId}
							isHover={isHover}
						/>
					)}
					{!isHover && (
						<AxisControl
							{...getGroupAttributes(props, 'iconPadding')}
							label={__('Icon Padding', 'maxi-blocks')}
							onChange={obj => onChange(obj)}
							breakpoint={deviceType}
							target='icon-padding'
							disableAuto
						/>
					)}
				</>
			)}
		</div>
	);
};

export default IconControl;
